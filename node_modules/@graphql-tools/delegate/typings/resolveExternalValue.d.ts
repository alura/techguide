import { GraphQLResolveInfo, GraphQLError, GraphQLSchema, GraphQLOutputType } from 'graphql';
import { SubschemaConfig } from './types.js';
export declare function resolveExternalValue<TContext extends Record<string, any>>(result: any, unpathedErrors: Array<GraphQLError>, subschema: GraphQLSchema | SubschemaConfig<any, any, any, TContext>, context?: Record<string, any>, info?: GraphQLResolveInfo, returnType?: GraphQLOutputType, skipTypeMerging?: boolean): any;
