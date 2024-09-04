import { Types, PluginValidateFn, PluginFunction } from '@graphql-codegen/plugin-helpers';
import { ReactApolloVisitor } from './visitor';
import { ReactApolloRawPluginConfig } from './config';
export declare const plugin: PluginFunction<ReactApolloRawPluginConfig, Types.ComplexPluginOutput>;
export declare const validate: PluginValidateFn<any>;
export { ReactApolloVisitor };
