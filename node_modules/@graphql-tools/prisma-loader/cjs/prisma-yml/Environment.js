"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocal = exports.Environment = void 0;
const tslib_1 = require("tslib");
const Cluster_js_1 = require("./Cluster.js");
const fs = tslib_1.__importStar(require("fs"));
const yaml = tslib_1.__importStar(require("js-yaml"));
const ClusterNotFound_js_1 = require("./errors/ClusterNotFound.js");
const Variables_js_1 = require("./Variables.js");
const Output_js_1 = require("./Output.js");
const path = tslib_1.__importStar(require("path"));
const fetch_1 = require("@whatwg-node/fetch");
const ClusterNotSet_js_1 = require("./errors/ClusterNotSet.js");
const constants_js_1 = require("./constants.js");
// eslint-disable-next-line
// @ts-ignore
const debug_1 = tslib_1.__importDefault(require("debug"));
const jose_1 = require("jose");
const debug = (0, debug_1.default)('Environment');
class Environment {
    constructor(home, out = new Output_js_1.Output(), version) {
        this.sharedClusters = ['prisma-eu1', 'prisma-us1'];
        this.clusterEndpointMap = constants_js_1.clusterEndpointMap;
        this.globalRC = {};
        this.clustersFetched = false;
        this.out = out;
        this.home = home;
        this.version = version;
        this.rcPath = path.join(this.home, '.prisma/config.yml');
        fs.mkdirSync(path.dirname(this.rcPath), { recursive: true });
    }
    _getClusters() {
        const clusters = this.clusters;
        if (clusters === undefined) {
            throw new Error(`Cannot get clusters. Did you forget to call "Environment.load()"?`);
        }
        return clusters;
    }
    async load() {
        await this.loadGlobalRC();
    }
    get cloudSessionKey() {
        return process.env['PRISMA_CLOUD_SESSION_KEY'] || this.globalRC.cloudSessionKey;
    }
    async renewToken() {
        if (this.cloudSessionKey) {
            const data = (0, jose_1.decodeJwt)(this.cloudSessionKey);
            if (!data.exp) {
                return;
            }
            const timeLeft = data.exp * 1000 - Date.now();
            if (timeLeft < 1000 * 60 * 60 * 24 && timeLeft > 0) {
                try {
                    const res = await this.requestCloudApi(`
          mutation {
            renewToken
          }
        `);
                    if (res.renewToken) {
                        this.globalRC.cloudSessionKey = res.renewToken;
                        this.saveGlobalRC();
                    }
                }
                catch (e) {
                    debug(e);
                }
            }
        }
    }
    async fetchClusters() {
        if (!this.clustersFetched && this.cloudSessionKey) {
            const renewPromise = this.renewToken();
            try {
                const res = (await Promise.race([
                    this.requestCloudApi(`
            query prismaCliGetClusters {
              me {
                memberships {
                  workspace {
                    id
                    slug
                    clusters {
                      id
                      name
                      connectInfo {
                        endpoint
                      }
                      customConnectionInfo {
                        endpoint
                      }
                    }
                  }
                }
              }
            }
          `),
                    // eslint-disable-next-line
                    new Promise((_, r) => setTimeout(() => r(), 6000)),
                ]));
                if (!res) {
                    return;
                }
                if (res.me && res.me.memberships && Array.isArray(res.me.memberships)) {
                    // clean up all prisma-eu1 and prisma-us1 clusters if they already exist
                    this.clusters = this._getClusters().filter(c => c.name !== 'prisma-eu1' && c.name !== 'prisma-us1');
                    for (const m of res.me.memberships) {
                        for (const cluster of m.workspace.clusters) {
                            const endpoint = cluster.connectInfo
                                ? cluster.connectInfo.endpoint
                                : cluster.customConnectionInfo
                                    ? cluster.customConnectionInfo.endpoint
                                    : this.clusterEndpointMap[cluster.name];
                            this.addCluster(new Cluster_js_1.Cluster(this.out, cluster.name, endpoint, this.globalRC.cloudSessionKey, false, ['prisma-eu1', 'prisma-us1'].includes(cluster.name), !['prisma-eu1', 'prisma-us1'].includes(cluster.name), m.workspace.slug));
                        }
                    }
                }
            }
            catch (e) {
                debug(e);
            }
            await renewPromise;
        }
    }
    clusterByName(name, throws = false) {
        if (!this.clusters) {
            return;
        }
        const cluster = this.clusters.find(c => c.name === name);
        if (!throws) {
            return cluster;
        }
        if (!cluster) {
            if (!name) {
                throw new ClusterNotSet_js_1.ClusterNotSet();
            }
            throw new ClusterNotFound_js_1.ClusterNotFound(name);
        }
        return cluster;
    }
    setToken(token) {
        this.globalRC.cloudSessionKey = token;
    }
    addCluster(cluster) {
        const clusters = this._getClusters();
        const existingClusterIndex = clusters.findIndex(c => {
            if (cluster.workspaceSlug) {
                return c.workspaceSlug === cluster.workspaceSlug && c.name === cluster.name;
            }
            else {
                return c.name === cluster.name;
            }
        });
        if (existingClusterIndex > -1) {
            clusters.splice(existingClusterIndex, 1);
        }
        clusters.push(cluster);
    }
    removeCluster(name) {
        this.clusters = this._getClusters().filter(c => c.name !== name);
    }
    saveGlobalRC() {
        const rc = {
            cloudSessionKey: this.globalRC.cloudSessionKey ? this.globalRC.cloudSessionKey.trim() : undefined,
            clusters: this.getLocalClusterConfig(),
        };
        // parse & stringify to rm undefined for yaml parser
        const rcString = yaml.dump(JSON.parse(JSON.stringify(rc)));
        fs.writeFileSync(this.rcPath, rcString);
    }
    setActiveCluster(cluster) {
        this.activeCluster = cluster;
    }
    async loadGlobalRC() {
        if (this.rcPath) {
            try {
                fs.accessSync(this.rcPath);
                const globalFile = fs.readFileSync(this.rcPath, 'utf-8');
                await this.parseGlobalRC(globalFile);
            }
            catch (_a) {
                await this.parseGlobalRC();
            }
        }
        else {
            await this.parseGlobalRC();
        }
    }
    async parseGlobalRC(globalFile) {
        if (globalFile) {
            this.globalRC = await this.loadYaml(globalFile, this.rcPath);
        }
        this.clusters = this.initClusters(this.globalRC);
    }
    async loadYaml(file, filePath = null) {
        if (file) {
            let content;
            try {
                content = yaml.load(file);
            }
            catch (e) {
                throw new Error(`Yaml parsing error in ${filePath}: ${e.message}`);
            }
            const variables = new Variables_js_1.Variables(filePath || 'no filepath provided', this.args, this.out);
            content = await variables.populateJson(content);
            return content;
        }
        else {
            return {};
        }
    }
    initClusters(rc) {
        const sharedClusters = this.getSharedClusters(rc);
        return [...sharedClusters];
    }
    getSharedClusters(rc) {
        return this.sharedClusters.map(clusterName => {
            return new Cluster_js_1.Cluster(this.out, clusterName, this.clusterEndpointMap[clusterName], rc && rc.cloudSessionKey, false, true);
        });
    }
    getLocalClusterConfig() {
        return this._getClusters()
            .filter(c => !c.shared && c.clusterSecret !== this.cloudSessionKey && !c.isPrivate)
            .reduce((acc, cluster) => {
            return {
                ...acc,
                [cluster.name]: {
                    host: cluster.baseUrl,
                    clusterSecret: cluster.clusterSecret,
                },
            };
        }, {});
    }
    async requestCloudApi(query) {
        const res = await (0, fetch_1.fetch)('https://api.cloud.prisma.sh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.cloudSessionKey}`,
                'X-Cli-Version': this.version,
            },
            body: JSON.stringify({
                query,
            }),
        });
        const json = await res.json();
        return json.data;
    }
}
exports.Environment = Environment;
const isLocal = (hostname) => hostname.includes('localhost') || hostname.includes('127.0.0.1');
exports.isLocal = isLocal;
