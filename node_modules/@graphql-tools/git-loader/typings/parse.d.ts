import { Source, GraphQLParseOptions } from '@graphql-tools/utils';
/**
 * @internal
 */
export declare function parse<T extends GraphQLParseOptions>({ path, pointer, content, options, }: {
    path: string;
    pointer: string;
    content: string;
    options: T;
}): Source | void;
