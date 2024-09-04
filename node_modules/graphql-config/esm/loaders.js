import { loadSchema, loadSchemaSync, loadTypedefs, loadTypedefsSync, loadDocuments, loadDocumentsSync, OPERATION_KINDS, } from '@graphql-tools/load';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { buildASTSchema, print } from 'graphql';
import { useMiddleware } from './helpers/index.js';
export class LoadersRegistry {
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
        return loadTypedefs(pointer, {
            loaders: Array.from(this._loaders),
            cwd: this.cwd,
            ...options,
        });
    }
    loadTypeDefsSync(pointer, options) {
        return loadTypedefsSync(pointer, this.createOptions(options));
    }
    async loadDocuments(pointer, options) {
        return loadDocuments(pointer, this.createOptions(options));
    }
    loadDocumentsSync(pointer, options) {
        return loadDocumentsSync(pointer, this.createOptions(options));
    }
    async loadSchema(pointer, out, options) {
        out = out || 'GraphQLSchema';
        const loadSchemaOptions = this.createOptions(options);
        if (out === 'GraphQLSchema' && !this._middlewares.length) {
            return loadSchema(pointer, loadSchemaOptions);
        }
        const schemaDoc = this.transformSchemaSources(await loadTypedefs(pointer, {
            filterKinds: OPERATION_KINDS,
            ...loadSchemaOptions,
        }));
        // TODO: TS screams about `out` not being compatible with SchemaOutput
        return this.castSchema(schemaDoc, out);
    }
    loadSchemaSync(pointer, out, options) {
        out = out || 'GraphQLSchema';
        const loadSchemaOptions = this.createOptions(options);
        if (out === 'GraphQLSchema' && !this._middlewares.length) {
            return loadSchemaSync(pointer, loadSchemaOptions);
        }
        const schemaDoc = this.transformSchemaSources(loadTypedefsSync(pointer, {
            filterKinds: OPERATION_KINDS,
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
        const document = mergeTypeDefs(documents);
        return useMiddleware(this._middlewares)(document);
    }
    castSchema(doc, out) {
        if (out === 'DocumentNode') {
            return doc;
        }
        if (out === 'GraphQLSchema') {
            return buildASTSchema(doc);
        }
        return print(doc);
    }
}
