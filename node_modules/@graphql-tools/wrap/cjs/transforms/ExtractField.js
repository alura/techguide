"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
class ExtractField {
    constructor({ from, to }) {
        this.from = from;
        this.to = to;
    }
    transformRequest(originalRequest, _delegationContext, _transformationContext) {
        let fromSelection;
        const ourPathFrom = JSON.stringify(this.from);
        const ourPathTo = JSON.stringify(this.to);
        let fieldPath = [];
        (0, graphql_1.visit)(originalRequest.document, {
            [graphql_1.Kind.FIELD]: {
                enter: (node) => {
                    fieldPath.push(node.name.value);
                    if (ourPathFrom === JSON.stringify(fieldPath)) {
                        fromSelection = node.selectionSet;
                        return graphql_1.BREAK;
                    }
                },
                leave: () => {
                    fieldPath.pop();
                },
            },
        });
        fieldPath = [];
        const document = (0, graphql_1.visit)(originalRequest.document, {
            [graphql_1.Kind.FIELD]: {
                enter: (node) => {
                    fieldPath.push(node.name.value);
                    if (ourPathTo === JSON.stringify(fieldPath) && fromSelection != null) {
                        return {
                            ...node,
                            selectionSet: fromSelection,
                        };
                    }
                },
                leave: () => {
                    fieldPath.pop();
                },
            },
        });
        return {
            ...originalRequest,
            document,
        };
    }
}
exports.default = ExtractField;
