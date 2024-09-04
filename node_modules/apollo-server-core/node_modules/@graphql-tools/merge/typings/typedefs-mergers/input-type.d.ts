import { Config } from './merge-typedefs.js';
import { InputObjectTypeDefinitionNode, InputObjectTypeExtensionNode } from 'graphql';
export declare function mergeInputType(node: InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode, existingNode: InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode, config?: Config): InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode;
