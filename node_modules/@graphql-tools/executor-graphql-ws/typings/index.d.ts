import { Executor } from '@graphql-tools/utils';
import { Client, ClientOptions } from 'graphql-ws';
interface GraphQLWSExecutorOptions extends ClientOptions {
    onClient?: (client: Client) => void;
}
export declare function buildGraphQLWSExecutor(clientOptionsOrClient: GraphQLWSExecutorOptions | Client): Executor;
export {};
