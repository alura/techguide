import { isNonEmptyArray } from "./arrays.js";
import { isExecutionPatchIncrementalResult } from "./incrementalResult.js";
export function graphQLResultHasError(result) {
    var errors = getGraphQLErrorsFromResult(result);
    return isNonEmptyArray(errors);
}
export function getGraphQLErrorsFromResult(result) {
    var graphQLErrors = isNonEmptyArray(result.errors) ? result.errors.slice(0) : [];
    if (isExecutionPatchIncrementalResult(result) &&
        isNonEmptyArray(result.incremental)) {
        result.incremental.forEach(function (incrementalResult) {
            if (incrementalResult.errors) {
                graphQLErrors.push.apply(graphQLErrors, incrementalResult.errors);
            }
        });
    }
    return graphQLErrors;
}
//# sourceMappingURL=errorHandling.js.map