import { Types } from '@graphql-codegen/plugin-helpers';
import { CodegenContext } from '../config';
export declare const createWatcher: (initalContext: CodegenContext, onNext: (result: Types.FileOutput[]) => Promise<Types.FileOutput[]>) => Promise<void>;
