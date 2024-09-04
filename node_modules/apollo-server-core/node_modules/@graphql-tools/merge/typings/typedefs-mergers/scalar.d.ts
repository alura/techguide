import { ScalarTypeDefinitionNode, ScalarTypeExtensionNode } from 'graphql';
import { Config } from './merge-typedefs.js';
export declare function mergeScalar(node: ScalarTypeDefinitionNode | ScalarTypeExtensionNode, existingNode: ScalarTypeDefinitionNode | ScalarTypeExtensionNode, config?: Config): ScalarTypeDefinitionNode | ScalarTypeExtensionNode;
