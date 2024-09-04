import { GraphQLSchema } from 'graphql';
import { SubschemaConfig } from './types.js';
export declare const applySchemaTransforms: (originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, any>) => GraphQLSchema;
