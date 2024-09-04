"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeArguments = void 0;
const utils_1 = require("@graphql-tools/utils");
function mergeArguments(args1, args2, config) {
    const result = deduplicateArguments([...args2, ...args1].filter(utils_1.isSome));
    if (config && config.sort) {
        result.sort(utils_1.compareNodes);
    }
    return result;
}
exports.mergeArguments = mergeArguments;
function deduplicateArguments(args) {
    return args.reduce((acc, current) => {
        const dup = acc.find(arg => arg.name.value === current.name.value);
        if (!dup) {
            return acc.concat([current]);
        }
        return acc;
    }, []);
}
