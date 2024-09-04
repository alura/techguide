"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizedExecutor = void 0;
const graphql_1 = require("graphql");
const execute_js_1 = require("./execute.js");
const value_or_promise_1 = require("value-or-promise");
function normalizedExecutor(args) {
    const operationAST = (0, graphql_1.getOperationAST)(args.document, args.operationName);
    if (operationAST == null) {
        throw new Error('Must provide an operation.');
    }
    if (operationAST.operation === 'subscription') {
        return (0, execute_js_1.subscribe)(args);
    }
    return new value_or_promise_1.ValueOrPromise(() => (0, execute_js_1.execute)(args))
        .then((result) => {
        if ('initialResult' in result) {
            return (0, execute_js_1.flattenIncrementalResults)(result);
        }
        return result;
    })
        .resolve();
}
exports.normalizedExecutor = normalizedExecutor;
