"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const utils_1 = require("@graphql-tools/utils");
/**
 * @internal
 */
function parse({ path, pointer, content, options, }) {
    if (/\.(gql|graphql)s?$/i.test(path)) {
        return (0, utils_1.parseGraphQLSDL)(pointer, content, options);
    }
    if (/\.json$/i.test(path)) {
        return (0, utils_1.parseGraphQLJSON)(pointer, content, options);
    }
}
exports.parse = parse;
