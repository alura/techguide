import { visit, Kind } from 'graphql';
import { relocatedError } from '@graphql-tools/utils';
export default class TransformQuery {
    constructor({ path, queryTransformer, resultTransformer = result => result, errorPathTransformer = errorPath => [...errorPath], fragments = {}, }) {
        this.path = path;
        this.queryTransformer = queryTransformer;
        this.resultTransformer = resultTransformer;
        this.errorPathTransformer = errorPathTransformer;
        this.fragments = fragments;
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        const pathLength = this.path.length;
        let index = 0;
        const document = visit(originalRequest.document, {
            [Kind.FIELD]: {
                enter: node => {
                    if (index === pathLength || node.name.value !== this.path[index]) {
                        return false;
                    }
                    index++;
                    if (index === pathLength) {
                        const selectionSet = this.queryTransformer(node.selectionSet, this.fragments, delegationContext, transformationContext);
                        return {
                            ...node,
                            selectionSet,
                        };
                    }
                },
                leave: () => {
                    index--;
                },
            },
        });
        return {
            ...originalRequest,
            document,
        };
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        const data = this.transformData(originalResult.data, delegationContext, transformationContext);
        const errors = originalResult.errors;
        return {
            data,
            errors: errors != null ? this.transformErrors(errors) : undefined,
        };
    }
    transformData(data, delegationContext, transformationContext) {
        const leafIndex = this.path.length - 1;
        let index = 0;
        let newData = data;
        if (newData) {
            let next = this.path[index];
            while (index < leafIndex) {
                if (data[next]) {
                    newData = newData[next];
                }
                else {
                    break;
                }
                index++;
                next = this.path[index];
            }
            newData[next] = this.resultTransformer(newData[next], delegationContext, transformationContext);
        }
        return data;
    }
    transformErrors(errors) {
        return errors.map(error => {
            const path = error.path;
            if (path == null) {
                return error;
            }
            let match = true;
            let index = 0;
            while (index < this.path.length) {
                if (path[index] !== this.path[index]) {
                    match = false;
                    break;
                }
                index++;
            }
            const newPath = match ? path.slice(0, index).concat(this.errorPathTransformer(path.slice(index))) : path;
            return relocatedError(error, newPath);
        });
    }
}
