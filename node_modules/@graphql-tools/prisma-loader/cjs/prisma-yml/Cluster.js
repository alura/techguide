"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const tslib_1 = require("tslib");
const fetch_1 = require("@whatwg-node/fetch");
const crypto_1 = require("crypto");
const buffer_1 = require("buffer");
const constants_js_1 = require("./constants.js");
const graphql_request_1 = require("graphql-request");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const getProxyAgent_js_1 = require("./utils/getProxyAgent.js");
const debug_1 = tslib_1.__importDefault(require("debug"));
const jose_1 = require("jose");
const debug = (0, debug_1.default)('Environment');
class Cluster {
    constructor(out, name, baseUrl, clusterSecret, local = true, shared = false, isPrivate = false, workspaceSlug) {
        this.out = out;
        this.name = name;
        // All `baseUrl` extension points in this class
        // adds a trailing slash. Here we remove it from
        // the passed `baseUrl` in order to avoid double
        // slashes.
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.clusterSecret = clusterSecret;
        this.local = local;
        this.shared = shared;
        this.isPrivate = isPrivate;
        this.workspaceSlug = workspaceSlug;
        this.hasOldDeployEndpoint = false;
    }
    async getToken(serviceName, workspaceSlug, stageName) {
        // public clusters just take the token
        const needsAuth = await this.needsAuth();
        debug({ needsAuth });
        if (!needsAuth) {
            return null;
        }
        if (this.name === 'shared-public-demo') {
            return '';
        }
        if (this.isPrivate && process.env['PRISMA_MANAGEMENT_API_SECRET']) {
            return this.getLocalToken();
        }
        if (this.shared || (this.isPrivate && !process.env['PRISMA_MANAGEMENT_API_SECRET'])) {
            return this.generateClusterToken(serviceName, workspaceSlug, stageName);
        }
        else {
            return this.getLocalToken();
        }
    }
    async getLocalToken() {
        if (!this.clusterSecret && !process.env['PRISMA_MANAGEMENT_API_SECRET']) {
            return null;
        }
        if (!this.cachedToken) {
            const grants = [{ target: `*/*`, action: '*' }];
            const secret = process.env['PRISMA_MANAGEMENT_API_SECRET'] || this.clusterSecret;
            if (!secret) {
                throw new Error(`Could not generate token for cluster ${chalk_1.default.bold(this.getDeployEndpoint())}. Did you provide the env var PRISMA_MANAGEMENT_API_SECRET?`);
            }
            try {
                const algorithm = process.env['PRISMA_MANAGEMENT_API_SECRET'] ? 'HS256' : 'RS256';
                this.cachedToken = await new jose_1.SignJWT({ grants })
                    .setProtectedHeader({ alg: algorithm, typ: 'JWT' })
                    .setExpirationTime('5y')
                    .setIssuedAt()
                    .sign(algorithm === 'HS256' ? buffer_1.Buffer.from(secret) : (0, crypto_1.createPrivateKey)(secret));
            }
            catch (e) {
                throw new Error(`Could not generate token for cluster ${chalk_1.default.bold(this.getDeployEndpoint())}.
Original error: ${e.message}`);
            }
        }
        return this.cachedToken;
    }
    get cloudClient() {
        return new graphql_request_1.GraphQLClient(constants_js_1.cloudApiEndpoint, {
            headers: {
                Authorization: `Bearer ${this.clusterSecret}`,
            },
            agent: (0, getProxyAgent_js_1.getProxyAgent)(constants_js_1.cloudApiEndpoint),
        });
    }
    async generateClusterToken(serviceName, workspaceSlug = this.workspaceSlug || '*', stageName) {
        const query = /* GraphQL */ `
      mutation ($input: GenerateClusterTokenRequest!) {
        generateClusterToken(input: $input) {
          clusterToken
        }
      }
    `;
        const { generateClusterToken: { clusterToken }, } = await this.cloudClient.request(query, {
            input: {
                workspaceSlug,
                clusterName: this.name,
                serviceName,
                stageName,
            },
        });
        return clusterToken;
    }
    async addServiceToCloudDBIfMissing(serviceName, workspaceSlug = this.workspaceSlug, stageName) {
        const query = /* GraphQL */ `
      mutation ($input: GenerateClusterTokenRequest!) {
        addServiceToCloudDBIfMissing(input: $input)
      }
    `;
        const serviceCreated = await this.cloudClient.request(query, {
            input: {
                workspaceSlug,
                clusterName: this.name,
                serviceName,
                stageName,
            },
        });
        return serviceCreated.addServiceToCloudDBIfMissing;
    }
    getApiEndpoint(service, stage, workspaceSlug) {
        if (!this.shared && service === 'default' && stage === 'default') {
            return this.baseUrl;
        }
        if (!this.shared && stage === 'default') {
            return `${this.baseUrl}/${service}`;
        }
        if (this.isPrivate || this.local) {
            return `${this.baseUrl}/${service}/${stage}`;
        }
        const workspaceString = workspaceSlug ? `${workspaceSlug}/` : '';
        return `${this.baseUrl}/${workspaceString}${service}/${stage}`;
    }
    getWSEndpoint(service, stage, workspaceSlug) {
        return this.getApiEndpoint(service, stage, workspaceSlug).replace(/^http/, 'ws');
    }
    getImportEndpoint(service, stage, workspaceSlug) {
        return this.getApiEndpoint(service, stage, workspaceSlug) + `/import`;
    }
    getExportEndpoint(service, stage, workspaceSlug) {
        return this.getApiEndpoint(service, stage, workspaceSlug) + `/export`;
    }
    getDeployEndpoint() {
        return `${this.baseUrl}/${this.hasOldDeployEndpoint ? 'cluster' : 'management'}`;
    }
    async isOnline() {
        const version = await this.getVersion();
        return typeof version === 'string';
    }
    async getVersion() {
        // first try new api
        try {
            const result = await this.request(`{
        serverInfo {
          version
        }
      }`);
            const res = await result.json();
            const { data, errors } = res;
            if (errors && errors[0].code === 3016 && errors[0].message.includes('management@default')) {
                this.hasOldDeployEndpoint = true;
                return await this.getVersion();
            }
            if (data && data.serverInfo) {
                return data.serverInfo.version;
            }
        }
        catch (e) {
            debug(e);
        }
        // if that doesn't work, try the old one
        try {
            const result = await this.request(`{
        serverInfo {
          version
        }
      }`);
            const res = await result.json();
            const { data } = res;
            return data.serverInfo.version;
        }
        catch (e) {
            debug(e);
        }
        return null;
    }
    request(query, variables) {
        return (0, fetch_1.fetch)(this.getDeployEndpoint(), {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });
    }
    async needsAuth() {
        try {
            const result = await this.request(`{
        listProjects {
          name
        }
      }`);
            const data = await result.json();
            if (data.errors && data.errors.length > 0) {
                return true;
            }
            return false;
        }
        catch (e) {
            debug('Assuming that the server needs authentication');
            debug(e.toString());
            return true;
        }
    }
    toJSON() {
        return {
            name: this.name,
            baseUrl: this.baseUrl,
            local: this.local,
            clusterSecret: this.clusterSecret,
            shared: this.shared,
            isPrivate: this.isPrivate,
            workspaceSlug: this.workspaceSlug,
        };
    }
}
exports.Cluster = Cluster;
