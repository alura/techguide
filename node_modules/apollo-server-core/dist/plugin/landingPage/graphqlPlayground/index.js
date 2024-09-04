"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginLandingPageGraphQLPlayground = void 0;
const graphql_playground_html_1 = require("@apollographql/graphql-playground-html");
const defaultPlaygroundVersion = '1.7.42';
function ApolloServerPluginLandingPageGraphQLPlayground(options = Object.create(null)) {
    return {
        async serverWillStart() {
            return {
                async renderLandingPage() {
                    return {
                        html: (0, graphql_playground_html_1.renderPlaygroundPage)({
                            version: defaultPlaygroundVersion,
                            ...options,
                        }),
                    };
                },
            };
        },
    };
}
exports.ApolloServerPluginLandingPageGraphQLPlayground = ApolloServerPluginLandingPageGraphQLPlayground;
//# sourceMappingURL=index.js.map