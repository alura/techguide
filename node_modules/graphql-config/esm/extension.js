import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { UrlLoader } from '@graphql-tools/url-loader';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import { LoadersRegistry } from './loaders.js';
export class GraphQLExtensionsRegistry {
    constructor({ cwd }) {
        this._extensions = {};
        this.loaders = {
            schema: new LoadersRegistry({ cwd }),
            documents: new LoadersRegistry({ cwd }),
        };
        // schema
        this.loaders.schema.register(new GraphQLFileLoader());
        this.loaders.schema.register(new UrlLoader());
        this.loaders.schema.register(new JsonFileLoader());
        // documents
        this.loaders.documents.register(new GraphQLFileLoader());
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
