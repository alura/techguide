import { Kind } from 'graphql';
export function getDocumentMetadata(document) {
    const operations = [];
    const fragments = [];
    const fragmentNames = new Set();
    for (let i = 0; i < document.definitions.length; i++) {
        const def = document.definitions[i];
        if (def.kind === Kind.FRAGMENT_DEFINITION) {
            fragments.push(def);
            fragmentNames.add(def.name.value);
        }
        else if (def.kind === Kind.OPERATION_DEFINITION) {
            operations.push(def);
        }
    }
    return {
        operations,
        fragments,
        fragmentNames,
    };
}
