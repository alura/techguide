import { GraphQLRequest, Operation, OperationContext, OperationType } from '../types';
declare function makeOperation<Data = any, Variables = object>(kind: OperationType, request: GraphQLRequest<Data, Variables>, context: OperationContext): Operation<Data, Variables>;
declare function makeOperation<Data = any, Variables = object>(kind: OperationType, request: Operation<Data, Variables>, context?: OperationContext): Operation<Data, Variables>;
export { makeOperation };
/** Spreads the provided metadata to the source operation's meta property in context.  */
export declare const addMetadata: (operation: Operation, meta: OperationContext['meta']) => Operation<any, any>;
