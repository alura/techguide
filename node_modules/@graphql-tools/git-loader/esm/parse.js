import { parseGraphQLSDL, parseGraphQLJSON } from '@graphql-tools/utils';
/**
 * @internal
 */
export function parse({ path, pointer, content, options, }) {
    if (/\.(gql|graphql)s?$/i.test(path)) {
        return parseGraphQLSDL(pointer, content, options);
    }
    if (/\.json$/i.test(path)) {
        return parseGraphQLJSON(pointer, content, options);
    }
}
