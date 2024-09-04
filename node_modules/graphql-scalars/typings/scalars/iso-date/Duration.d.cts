import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type ISO8601Duration = string;
export declare const GraphQLDurationConfig: GraphQLScalarTypeConfig<string, string>;
export declare const GraphQLISO8601Duration: GraphQLScalarType<string, string>;
export declare const GraphQLDuration: GraphQLScalarType<string, string>;
