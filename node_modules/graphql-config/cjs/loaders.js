"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadersRegistry = void 0;
const load_1 = require("@graphql-tools/load");
const merge_1 = require("@graphql-tools/merge");
const graphql_1 = require("graphql");
const index_js_1 = require("./helpers/index.js");
class LoadersRegistry {
    constructor({ cwd }) {
        this._loaders = new Set();
        this._middlewares = [];
        this.cwd = cwd;
    }
    register(loader) {
        this._loaders.add(loader);
    }
    override(loaders) {
        this._loaders = new Set(loaders);
    }
    use(middleware) {
        this._middlewares.push(middleware);
    }
    async loadTypeDefs(pointer, options) {
        return (0, load_1.loadTypedefs)(pointer, {
            loaders: Array.from(this._loaders),
            cwd: this.cwd,
            ...options,
        });
    }
    loadTypeDefsSync(pointer, options) {
        return (0, load_1.loadTypedefsSync)(pointer, this.createOptions(options));
    }
    async loadDocuments(pointer, options) {
        return (0, load_1.loadDocuments)(pointer, this.createOptions(options));
    }
    loadDocumentsSync(pointer, options) {
        return (0, load_1.loadDocumentsSync)(pointer, this.createOptions(options));
    }
    async loadSchema(pointer, out, options) {
        out = out || 'GraphQLSchema';
        const loadSchemaOptions = this.createOptions(options);
        if (out === 'GraphQLSchema' && !this._middlewares.length) {
            return (0, load_1.loadSchema)(pointer, loadSchemaOptions);
        }
        const schemaDoc = this.transformSchemaSources(await (0, load_1.loadTypedefs)(pointer, {
            filterKinds: load_1.OPERATION_KINDS,
            ...loadSchemaOptions,
        }));
        // TODO: TS screams about `out` not being compatible with SchemaOutput
        return this.castSchema(schemaDoc, out);
    }
    loadSchemaSync(pointer, out, options) {
        out = out || 'GraphQLSchema';
        const loadSchemaOptions = this.createOptions(options);
        if (out === 'GraphQLSchema' && !this._middlewares.length) {
            return (0, load_1.loadSchemaSync)(pointer, loadSchemaOptions);
        }
        const schemaDoc = this.transformSchemaSources((0, load_1.loadTypedefsSync)(pointer, {
            filterKinds: load_1.OPERATION_KINDS,
            ...loadSchemaOptions,
        }));
        return this.castSchema(schemaDoc, out);
    }
    createOptions(options) {
        return {
            loaders: Array.from(this._loaders),
            cwd: this.cwd,
            ...options,
        };
    }
    transformSchemaSources(sources) {
        const documents = sources.map((source) => source.document);
        const document = (0, merge_1.mergeTypeDefs)(documents);
        return (0, index_js_1.useMiddleware)(this._middlewares)(document);
    }
    castSchema(doc, out) {
        if (out === 'DocumentNode') {
            return doc;
        }
        if (out === 'GraphQLSchema') {
            return (0, graphql_1.buildASTSchema)(doc);
        }
        return (0, graphql_1.print)(doc);
    }
}
exports.LoadersRegistry = LoadersRegistry;
