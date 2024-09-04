import { visit, Kind } from 'graphql';
export default class WrapQuery {
    constructor(path, wrapper, extractor) {
        this.path = path;
        this.wrapper = wrapper;
        this.extractor = extractor;
    }
    transformRequest(originalRequest, _delegationContext, _transformationContext) {
        const fieldPath = [];
        const ourPath = JSON.stringify(this.path);
        const document = visit(originalRequest.document, {
            [Kind.FIELD]: {
                enter: (node) => {
                    fieldPath.push(node.name.value);
                    if (node.selectionSet != null && ourPath === JSON.stringify(fieldPath)) {
                        const wrapResult = this.wrapper(node.selectionSet);
                        // Selection can be either a single selection or a selection set. If it's just one selection,
                        // let's wrap it in a selection set. Otherwise, keep it as is.
                        const selectionSet = wrapResult != null && wrapResult.kind === Kind.SELECTION_SET
                            ? wrapResult
                            : {
                                kind: Kind.SELECTION_SET,
                                selections: [wrapResult],
                            };
                        return {
                            ...node,
                            selectionSet,
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
    transformResult(originalResult, _delegationContext, _transformationContext) {
        const rootData = originalResult.data;
        if (rootData != null) {
            let data = rootData;
            const path = [...this.path];
            while (path.length > 1) {
                const next = path.shift();
                if (data[next]) {
                    data = data[next];
                }
            }
            data[path[0]] = this.extractor(data[path[0]]);
        }
        return {
            data: rootData,
            errors: originalResult.errors,
        };
    }
}
