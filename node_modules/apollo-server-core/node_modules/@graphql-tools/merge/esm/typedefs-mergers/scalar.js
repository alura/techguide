import { Kind } from 'graphql';
import { mergeDirectives } from './directives.js';
export function mergeScalar(node, existingNode, config) {
    if (existingNode) {
        return {
            name: node.name,
            description: node['description'] || existingNode['description'],
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) ||
                node.kind === 'ScalarTypeDefinition' ||
                existingNode.kind === 'ScalarTypeDefinition'
                ? 'ScalarTypeDefinition'
                : 'ScalarTypeExtension',
            loc: node.loc,
            directives: mergeDirectives(node.directives, existingNode.directives, config),
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...node,
            kind: Kind.SCALAR_TYPE_DEFINITION,
        }
        : node;
}
