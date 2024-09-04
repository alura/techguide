import { GraphQLSchema, FieldNode, GraphQLArgument } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
interface HoistFieldTransformationContext extends Record<string, any> {
}
export default class HoistField<TContext extends Record<string, any> = Record<string, any>> implements Transform<HoistFieldTransformationContext, TContext> {
    private readonly typeName;
    private readonly newFieldName;
    private readonly pathToField;
    private readonly oldFieldName;
    private readonly argFilters;
    private readonly argLevels;
    private readonly transformer;
    constructor(typeName: string, pathConfig: Array<string | {
        fieldName: string;
        argFilter?: (arg: GraphQLArgument) => boolean;
    }>, newFieldName: string, alias?: string);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: HoistFieldTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: HoistFieldTransformationContext): ExecutionResult;
}
export declare function wrapFieldNode(fieldNode: FieldNode, path: Array<string>, alias: string, argLevels: Record<string, number>): FieldNode;
export declare function renameFieldNode(fieldNode: FieldNode, name: string): FieldNode;
export declare function unwrapValue(originalValue: any, alias: string): any;
export {};
