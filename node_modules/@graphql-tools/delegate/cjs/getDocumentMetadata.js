"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentMetadata = void 0;
const graphql_1 = require("graphql");
function getDocumentMetadata(document) {
    const operations = [];
    const fragments = [];
    const fragmentNames = new Set();
    for (let i = 0; i < document.definitions.length; i++) {
        const def = document.definitions[i];
        if (def.kind === graphql_1.Kind.FRAGMENT_DEFINITION) {
            fragments.push(def);
            fragmentNames.add(def.name.value);
        }
        else if (def.kind === graphql_1.Kind.OPERATION_DEFINITION) {
            operations.push(def);
        }
    }
    return {
        operations,
        fragments,
        fragmentNames,
    };
}
exports.getDocumentMetadata = getDocumentMetadata;
