import { PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers';
import { RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';
import { TypeScriptTypedDocumentNodesConfig } from './config.js';
export declare const plugin: PluginFunction<TypeScriptTypedDocumentNodesConfig>;
export declare const validate: PluginValidateFn<RawClientSideBasePluginConfig>;
export { TypeScriptTypedDocumentNodesConfig };
