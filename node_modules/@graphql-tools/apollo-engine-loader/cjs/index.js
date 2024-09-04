"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEMA_QUERY = exports.ApolloEngineLoader = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const fetch_1 = require("@whatwg-node/fetch");
const sync_fetch_1 = tslib_1.__importDefault(require("@ardatan/sync-fetch"));
const DEFAULT_APOLLO_ENDPOINT = 'https://engine-graphql.apollographql.com/api/graphql';
/**
 * This loader loads a schema from Apollo Engine
 */
class ApolloEngineLoader {
    getFetchArgs(options) {
        return [
            options.engine.endpoint || DEFAULT_APOLLO_ENDPOINT,
            {
                method: 'POST',
                headers: {
                    'x-api-key': options.engine.apiKey,
                    'apollo-client-name': 'Apollo Language Server',
                    'apollo-client-reference-id': '146d29c0-912c-46d3-b686-920e52586be6',
                    'apollo-client-version': '2.6.8',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...options.headers,
                },
                body: JSON.stringify({
                    query: exports.SCHEMA_QUERY,
                    variables: {
                        id: options.graph,
                        tag: options.variant,
                    },
                }),
            },
        ];
    }
    async canLoad(ptr) {
        return this.canLoadSync(ptr);
    }
    canLoadSync(ptr) {
        return typeof ptr === 'string' && ptr === 'apollo-engine';
    }
    async load(pointer, options) {
        if (!(await this.canLoad(pointer))) {
            return [];
        }
        const fetchArgs = this.getFetchArgs(options);
        const response = await (0, fetch_1.fetch)(...fetchArgs);
        const { data, errors } = await response.json();
        if (errors) {
            throw new utils_1.AggregateError(errors, 'Introspection from Apollo Engine failed; \n ' + errors.map((e) => e.message).join('\n'));
        }
        const source = (0, utils_1.parseGraphQLSDL)(pointer, data.service.schema.document, options);
        return [source];
    }
    loadSync(pointer, options) {
        if (!this.canLoadSync(pointer)) {
            return [];
        }
        const fetchArgs = this.getFetchArgs(options);
        const response = (0, sync_fetch_1.default)(...fetchArgs);
        const { data, errors } = response.json();
        if (errors) {
            throw new utils_1.AggregateError(errors, 'Introspection from Apollo Engine failed; \n ' + errors.map((e) => e.message).join('\n'));
        }
        const source = (0, utils_1.parseGraphQLSDL)(pointer, data.service.schema.document, options);
        return [source];
    }
}
exports.ApolloEngineLoader = ApolloEngineLoader;
/**
 * @internal
 */
exports.SCHEMA_QUERY = `
  query GetSchemaByTag($tag: String!, $id: ID!) {
    service(id: $id) {
      ... on Service {
        __typename
        schema(tag: $tag) {
          document
        }
      }
    }
  }
`;
