import { ExecutionRequest } from '@graphql-tools/utils';
import { DelegationContext } from './types.cjs';
export declare function finalizeGatewayRequest<TContext>(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>): ExecutionRequest;
