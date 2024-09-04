/// <reference types="node" />
import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
type BufferJson = {
    type: 'Buffer';
    data: number[];
};
export declare const GraphQLByteConfig: GraphQLScalarTypeConfig<Buffer | string | BufferJson, Buffer>;
export declare const GraphQLByte: GraphQLScalarType<string | BufferJson | Buffer, Buffer>;
export {};
