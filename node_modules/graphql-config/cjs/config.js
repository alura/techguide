"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLConfig = exports.loadConfigSync = exports.loadConfig = void 0;
const path_1 = require("path");
const project_config_js_1 = require("./project-config.js");
const index_js_1 = require("./helpers/index.js");
const errors_js_1 = require("./errors.js");
const extension_js_1 = require("./extension.js");
const endpoints_js_1 = require("./extensions/endpoints.js");
const cosmiconfig_js_1 = require("./helpers/cosmiconfig.js");
const CWD = process.cwd();
const defaultConfigName = 'graphql';
const defaultLoadConfigOptions = {
    rootDir: CWD,
    extensions: [],
    throwOnMissing: true,
    throwOnEmpty: true,
    configName: defaultConfigName,
    legacy: true,
};
async function loadConfig(options) {
    const { filepath, configName, rootDir, extensions, throwOnEmpty, throwOnMissing, legacy } = {
        ...defaultLoadConfigOptions,
        ...options,
    };
    try {
        const found = filepath
            ? await (0, index_js_1.getConfig)({ filepath, configName, legacy })
            : await (0, index_js_1.findConfig)({ rootDir, configName, legacy });
        return new GraphQLConfig(found, extensions);
    }
    catch (error) {
        return handleError(error, { throwOnMissing, throwOnEmpty });
    }
}
exports.loadConfig = loadConfig;
function loadConfigSync(options) {
    const { filepath, configName, rootDir, extensions, throwOnEmpty, throwOnMissing, legacy } = {
        ...defaultLoadConfigOptions,
        ...options,
    };
    try {
        const found = filepath
            ? (0, index_js_1.getConfigSync)({ filepath, configName, legacy })
            : (0, index_js_1.findConfigSync)({ rootDir, configName, legacy });
        return new GraphQLConfig(found, extensions);
    }
    catch (error) {
        return handleError(error, { throwOnMissing, throwOnEmpty });
    }
}
exports.loadConfigSync = loadConfigSync;
function handleError(error, options) {
    if ((!options.throwOnMissing && error instanceof errors_js_1.ConfigNotFoundError) ||
        (!options.throwOnEmpty && error instanceof errors_js_1.ConfigEmptyError)) {
        return;
    }
    throw error;
}
class GraphQLConfig {
    constructor(raw, extensions) {
        // TODO: in v5 change projects to `Object.create(null)` and refactor `graphql-codegen-cli` to remove `projects.hasOwnProperty`
        // https://github.com/dotansimha/graphql-code-generator/blob/3c6abbde7a20515d9a1d55b4003ef365d248efb5/packages/graphql-codegen-cli/src/graphql-config.ts#L62-L72
        this.projects = {};
        this._rawConfig = raw.config;
        this.filepath = raw.filepath;
        this.dirpath = (0, path_1.dirname)(raw.filepath);
        this.extensions = new extension_js_1.GraphQLExtensionsRegistry({ cwd: this.dirpath });
        // Register Endpoints
        this.extensions.register(endpoints_js_1.EndpointsExtension);
        for (const extension of extensions) {
            this.extensions.register(extension);
        }
        if ((0, index_js_1.isMultipleProjectConfig)(this._rawConfig)) {
            for (const [projectName, config] of Object.entries(this._rawConfig.projects)) {
                this.projects[projectName] = new project_config_js_1.GraphQLProjectConfig({
                    filepath: this.filepath,
                    name: projectName,
                    config,
                    extensionsRegistry: this.extensions,
                });
            }
        }
        else if ((0, index_js_1.isSingleProjectConfig)(this._rawConfig) || (0, index_js_1.isLegacyProjectConfig)(this._rawConfig)) {
            this.projects.default = new project_config_js_1.GraphQLProjectConfig({
                filepath: this.filepath,
                name: 'default',
                config: this._rawConfig,
                extensionsRegistry: this.extensions,
            });
        }
    }
    getProject(name) {
        if (!name) {
            return this.getDefault();
        }
        const project = this.projects[name];
        if (!project) {
            throw new errors_js_1.ProjectNotFoundError(`Project '${name}' not found`);
        }
        return project;
    }
    getProjectForFile(filepath) {
        // Looks for a project that includes the file or the file is a part of schema or documents
        for (const project of Object.values(this.projects)) {
            if (project.match(filepath)) {
                return project;
            }
        }
        // The file doesn't match any of the project
        // Looks for a first project that has no `include` and `exclude`
        for (const project of Object.values(this.projects)) {
            if (!project.include && !project.exclude) {
                return project;
            }
        }
        throw new errors_js_1.ProjectNotFoundError(`File '${filepath}' doesn't match any project`);
    }
    getDefault() {
        return this.getProject('default');
    }
    isLegacy() {
        return (0, cosmiconfig_js_1.isLegacyConfig)(this.filepath);
    }
}
exports.GraphQLConfig = GraphQLConfig;
