import { PrismaDefinition } from './prisma-json-schema.cjs';
import { Args } from './types/common.cjs';
import { IOutput } from './Output.cjs';
export declare function readDefinition(filePath: string, args: Args, out?: IOutput, envVars?: any, _graceful?: boolean): Promise<{
    definition: PrismaDefinition;
    rawJson: any;
}>;
