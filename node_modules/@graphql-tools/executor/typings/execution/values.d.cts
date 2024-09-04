import { GraphQLError, VariableDefinitionNode, GraphQLSchema } from 'graphql';
type CoercedVariableValues = {
    errors: ReadonlyArray<GraphQLError>;
    coerced?: never;
} | {
    coerced: {
        [variable: string]: unknown;
    };
    errors?: never;
};
/**
 * Prepares an object map of variableValues of the correct type based on the
 * provided variable definitions and arbitrary input. If the input cannot be
 * parsed to match the variable definitions, a GraphQLError will be thrown.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
export declare function getVariableValues(schema: GraphQLSchema, varDefNodes: ReadonlyArray<VariableDefinitionNode>, inputs: {
    readonly [variable: string]: unknown;
}, options?: {
    maxErrors?: number;
}): CoercedVariableValues;
export {};
