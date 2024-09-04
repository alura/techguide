"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLExtensionsRegistry = void 0;
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const url_loader_1 = require("@graphql-tools/url-loader");
const json_file_loader_1 = require("@graphql-tools/json-file-loader");
const loaders_js_1 = require("./loaders.js");
class GraphQLExtensionsRegistry {
    constructor({ cwd }) {
        this._extensions = {};
        this.loaders = {
            schema: new loaders_js_1.LoadersRegistry({ cwd }),
            documents: new loaders_js_1.LoadersRegistry({ cwd }),
        };
        // schema
        this.loaders.schema.register(new graphql_file_loader_1.GraphQLFileLoader());
        this.loaders.schema.register(new url_loader_1.UrlLoader());
        this.loaders.schema.register(new json_file_loader_1.JsonFileLoader());
        // documents
        this.loaders.documents.register(new graphql_file_loader_1.GraphQLFileLoader());
    }
    register(extensionFn) {
        const extension = extensionFn({
            logger: {},
            loaders: this.loaders,
        });
        this._extensions[extension.name] = extension;
    }
    has(extensionName) {
        return !!this._extensions[extensionName];
    }
    get(extensionName) {
        return this._extensions[extensionName];
    }
    names() {
        return Object.keys(this._extensions);
    }
    forEach(cb) {
        for (const extensionName in this._extensions) {
            cb(this._extensions[extensionName]);
        }
    }
}
exports.GraphQLExtensionsRegistry = GraphQLExtensionsRegistry;
