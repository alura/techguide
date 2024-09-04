import { Types } from '@graphql-codegen/plugin-helpers';
export declare function getPresetByName(name: string, loader: Types.PackageLoaderFn<{
    preset?: Types.OutputPreset;
    default?: Types.OutputPreset;
}>): Promise<Types.OutputPreset>;
