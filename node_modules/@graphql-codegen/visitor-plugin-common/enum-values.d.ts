import { EnumValuesMap, ParsedEnumValuesMap } from './types';
import { GraphQLSchema } from 'graphql';
export declare function parseEnumValues({ schema, mapOrStr, ignoreEnumValuesFromSchema, }: {
    schema: GraphQLSchema;
    mapOrStr: EnumValuesMap;
    ignoreEnumValuesFromSchema?: boolean;
}): ParsedEnumValuesMap;
