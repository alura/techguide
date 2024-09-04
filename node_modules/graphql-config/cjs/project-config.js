"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLProjectConfig = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const minimatch_1 = tslib_1.__importDefault(require("minimatch"));
const errors_js_1 = require("./errors.js");
const index_js_1 = require("./helpers/index.js");
class GraphQLProjectConfig {
    constructor({ filepath, name, config, extensionsRegistry, }) {
        this.filepath = filepath;
        this.dirpath = (0, path_1.dirname)(filepath);
        this.name = name;
        this.extensions = config.extensions || {};
        if ((0, index_js_1.isLegacyProjectConfig)(config)) {
            this.schema = config.schemaPath;
            this.include = config.includes;
            this.exclude = config.excludes;
            this.isLegacy = true;
        }
        else {
            this.schema = config.schema;
            this.documents = config.documents;
            this.include = config.include;
            this.exclude = config.exclude;
            this.isLegacy = false;
        }
        this._extensionsRegistry = extensionsRegistry;
    }
    hasExtension(name) {
        return Boolean(this.extensions[name]);
    }
    extension(name) {
        if (this.isLegacy) {
            const extension = this.extensions[name];
            if (!extension) {
                throw new errors_js_1.ExtensionMissingError(`Project ${this.name} is missing ${name} extension`);
            }
            return extension;
        }
        const extension = this._extensionsRegistry.get(name);
        if (!extension) {
            throw new errors_js_1.ExtensionMissingError(`Project ${this.name} is missing ${name} extension`);
        }
        return {
            ...this.extensions[name],
            schema: this.schema,
            documents: this.documents,
            include: this.include,
            exclude: this.exclude,
        };
    }
    async getSchema(out) {
        return this.loadSchema(this.schema, out);
    }
    getSchemaSync(out) {
        return this.loadSchemaSync(this.schema, out);
    }
    // Get Documents
    async getDocuments() {
        if (!this.documents) {
            return [];
        }
        return this.loadDocuments(this.documents);
    }
    getDocumentsSync() {
        if (!this.documents) {
            return [];
        }
        return this.loadDocumentsSync(this.documents);
    }
    async loadSchema(pointer, out, options) {
        return this._extensionsRegistry.loaders.schema.loadSchema(pointer, out, options);
    }
    loadSchemaSync(pointer, out, options) {
        return this._extensionsRegistry.loaders.schema.loadSchemaSync(pointer, out, options);
    }
    // Load Documents
    async loadDocuments(pointer, options) {
        if (!pointer) {
            return [];
        }
        return this._extensionsRegistry.loaders.documents.loadDocuments(pointer, options);
    }
    loadDocumentsSync(pointer, options) {
        if (!pointer) {
            return [];
        }
        return this._extensionsRegistry.loaders.documents.loadDocumentsSync(pointer, options);
    }
    // Rest
    match(filepath) {
        const isSchemaOrDocument = [this.schema, this.documents].some((pointer) => match(filepath, this.dirpath, pointer));
        if (isSchemaOrDocument) {
            return true;
        }
        const isExcluded = this.exclude ? match(filepath, this.dirpath, this.exclude) : false;
        if (isExcluded) {
            return false;
        }
        return this.include ? match(filepath, this.dirpath, this.include) : false;
    }
}
exports.GraphQLProjectConfig = GraphQLProjectConfig;
// XXX: it works but uses nodejs - expose normalization of file and dir paths in config
function match(filepath, dirpath, pointer) {
    if (!pointer) {
        return false;
    }
    if (Array.isArray(pointer)) {
        return pointer.some((p) => match(filepath, dirpath, p));
    }
    if (typeof pointer === 'string') {
        const normalizedFilepath = (0, path_1.normalize)((0, path_1.isAbsolute)(filepath) ? (0, path_1.relative)(dirpath, filepath) : filepath);
        return (0, minimatch_1.default)(normalizedFilepath, (0, path_1.normalize)(pointer), { dot: true });
    }
    if (typeof pointer === 'object') {
        return match(filepath, dirpath, Object.keys(pointer)[0]);
    }
    return false;
}
