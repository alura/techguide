import { GraphQLSchema } from 'graphql';
import { SubschemaConfig, Subschema } from '@graphql-tools/delegate';
export declare const wrapSchema: <TConfig extends Record<string, any> = Record<string, any>>(subschemaConfig: SubschemaConfig<any, any, any, TConfig> | Subschema<any, any, any, TConfig>) => GraphQLSchema;
