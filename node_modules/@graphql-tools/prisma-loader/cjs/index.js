"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaLoader = void 0;
const url_loader_1 = require("@graphql-tools/url-loader");
const index_js_1 = require("./prisma-yml/index.js");
const path_1 = require("path");
const fs_1 = require("fs");
const os_1 = require("os");
const process_1 = require("process");
const { access } = fs_1.promises;
/**
 * This loader loads a schema from a `prisma.yml` file
 */
class PrismaLoader extends url_loader_1.UrlLoader {
    canLoadSync() {
        return false;
    }
    async canLoad(prismaConfigFilePath, options) {
        if (typeof prismaConfigFilePath === 'string' && prismaConfigFilePath.endsWith('prisma.yml')) {
            const joinedYmlPath = (0, path_1.join)(options.cwd || (0, process_1.cwd)(), prismaConfigFilePath);
            try {
                await access(joinedYmlPath);
                return true;
            }
            catch (_a) {
                return false;
            }
        }
        return false;
    }
    async load(prismaConfigFilePath, options) {
        if (!(await this.canLoad(prismaConfigFilePath, options))) {
            return [];
        }
        const { graceful, envVars } = options;
        const home = (0, os_1.homedir)();
        const env = new index_js_1.Environment(home);
        await env.load();
        const joinedYmlPath = (0, path_1.join)(options.cwd || (0, process_1.cwd)(), prismaConfigFilePath);
        const definition = new index_js_1.PrismaDefinitionClass(env, joinedYmlPath, envVars);
        await definition.load({}, undefined, graceful);
        const serviceName = definition.service;
        const stage = definition.stage;
        const clusterName = definition.cluster;
        if (!clusterName) {
            throw new Error(`No cluster set. Please set the "cluster" property in your prisma.yml`);
        }
        const cluster = await definition.getCluster();
        if (!cluster) {
            throw new Error(`Cluster ${clusterName} provided in prisma.yml could not be found in global ~/.prisma/config.yml.
      Please check in ~/.prisma/config.yml, if the cluster exists.
      You can use \`docker-compose up -d\` to start a new cluster.`);
        }
        const token = await definition.getToken(serviceName, stage);
        const url = cluster.getApiEndpoint(serviceName, stage, definition.getWorkspace() || undefined);
        const headers = token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : undefined;
        return super.load(url, { headers });
    }
}
exports.PrismaLoader = PrismaLoader;
