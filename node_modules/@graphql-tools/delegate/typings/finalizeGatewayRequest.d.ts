import { ExecutionRequest } from '@graphql-tools/utils';
import { DelegationContext } from './types.js';
export declare function finalizeGatewayRequest<TContext>(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>): ExecutionRequest;
