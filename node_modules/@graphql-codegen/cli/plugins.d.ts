import { Types, CodegenPlugin } from '@graphql-codegen/plugin-helpers';
export declare function getPluginByName(name: string, pluginLoader: Types.PackageLoaderFn<CodegenPlugin>): Promise<CodegenPlugin>;
