import { visit, Kind, BREAK } from 'graphql';
export default class ExtractField {
    constructor({ from, to }) {
        this.from = from;
        this.to = to;
    }
    transformRequest(originalRequest, _delegationContext, _transformationContext) {
        let fromSelection;
        const ourPathFrom = JSON.stringify(this.from);
        const ourPathTo = JSON.stringify(this.to);
        let fieldPath = [];
        visit(originalRequest.document, {
            [Kind.FIELD]: {
                enter: (node) => {
                    fieldPath.push(node.name.value);
                    if (ourPathFrom === JSON.stringify(fieldPath)) {
                        fromSelection = node.selectionSet;
                        return BREAK;
                    }
                },
                leave: () => {
                    fieldPath.pop();
                },
            },
        });
        fieldPath = [];
        const document = visit(originalRequest.document, {
            [Kind.FIELD]: {
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
