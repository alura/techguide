import { UnionTypeDefinitionNode, UnionTypeExtensionNode } from 'graphql';
import { Config } from './merge-typedefs.js';
export declare function mergeUnion(first: UnionTypeDefinitionNode | UnionTypeExtensionNode, second: UnionTypeDefinitionNode | UnionTypeExtensionNode, config?: Config): UnionTypeDefinitionNode | UnionTypeExtensionNode;
