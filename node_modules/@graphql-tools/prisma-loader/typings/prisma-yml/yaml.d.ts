import { PrismaDefinition } from './prisma-json-schema.js';
import { Args } from './types/common.js';
import { IOutput } from './Output.js';
export declare function readDefinition(filePath: string, args: Args, out?: IOutput, envVars?: any, _graceful?: boolean): Promise<{
    definition: PrismaDefinition;
    rawJson: any;
}>;
