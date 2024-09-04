"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBatchingExecutor = void 0;
const utils_1 = require("@graphql-tools/utils");
const createBatchingExecutor_js_1 = require("./createBatchingExecutor.js");
exports.getBatchingExecutor = (0, utils_1.memoize2of4)(function getBatchingExecutor(_context, executor, dataLoaderOptions, extensionsReducer) {
    return (0, createBatchingExecutor_js_1.createBatchingExecutor)(executor, dataLoaderOptions, extensionsReducer);
});
