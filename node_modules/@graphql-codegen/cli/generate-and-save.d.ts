import { Types } from '@graphql-codegen/plugin-helpers';
import { CodegenContext } from './config';
export declare function generate(input: CodegenContext | (Types.Config & {
    cwd?: string;
}), saveToFile?: boolean): Promise<Types.FileOutput[] | any>;
