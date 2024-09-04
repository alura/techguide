import { GraphQLExtensionDeclaration, GraphQLConfig } from 'graphql-config';
export declare const CodegenExtension: GraphQLExtensionDeclaration;
export declare function findAndLoadGraphQLConfig(filepath?: string): Promise<GraphQLConfig | void>;
