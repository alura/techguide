import { PrismaDefinition } from './prisma-json-schema.cjs';
import { Args } from './types/common.cjs';
import { Environment } from './Environment.cjs';
import { IOutput } from './Output.cjs';
import { Cluster } from './Cluster.cjs';
import { FunctionInput } from './types/rc.cjs';
import { ParseEndpointResult } from './utils/parseEndpoint.cjs';
export interface EnvVars {
    [key: string]: string | undefined;
}
export type HookType = 'post-deploy';
export declare class PrismaDefinitionClass {
    definition?: PrismaDefinition;
    rawJson?: any;
    typesString?: string;
    secrets: string[] | null;
    definitionPath?: string | null;
    definitionDir: string | undefined;
    env: Environment;
    out?: IOutput;
    envVars: any;
    rawEndpoint?: string;
    private definitionString;
    constructor(env: Environment, definitionPath?: string | null, envVars?: EnvVars, out?: IOutput);
    load(args: Args, envPath?: string, graceful?: boolean): Promise<void>;
    private loadDefinition;
    get endpoint(): string | undefined;
    get clusterBaseUrl(): string | undefined;
    get service(): string | undefined;
    get stage(): string | undefined;
    get cluster(): string | undefined;
    validate(): void;
    getToken(serviceName: string, stageName: string): Promise<string | undefined>;
    getCluster(_?: boolean): Promise<Cluster | undefined>;
    findClusterByBaseUrl(baseUrl: string): Cluster | undefined;
    getClusterByEndpoint(data: ParseEndpointResult): Promise<Cluster>;
    getTypesString(definition: PrismaDefinition): string;
    getClusterName(): string | null;
    getWorkspace(): string | null;
    getDeployName(): Promise<string>;
    getSubscriptions(): FunctionInput[];
    replaceEndpoint(newEndpoint: any): void;
    addDatamodel(datamodel: any): void;
    getEndpoint(serviceInput?: string, stageInput?: string): Promise<string | null>;
    getHooks(hookType: HookType): string[];
}
export declare function concatName(cluster: Cluster, name: string, workspace: string | null): string;
