import { Types } from '@graphql-codegen/plugin-helpers';
import { Answers } from './types';
export declare function writeConfig(answers: Answers, config: Types.Config): Promise<{
    relativePath: string;
    fullPath: string;
}>;
export declare function writePackage(answers: Answers, configLocation: string): Promise<void>;
export declare function bold(str: string): string;
export declare function grey(str: string): string;
export declare function italic(str: string): string;
