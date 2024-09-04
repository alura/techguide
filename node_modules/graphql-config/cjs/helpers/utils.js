"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMiddleware = exports.isLegacyProjectConfig = exports.isSingleProjectConfig = exports.isMultipleProjectConfig = void 0;
function isMultipleProjectConfig(config) {
    return typeof config.projects === 'object';
}
exports.isMultipleProjectConfig = isMultipleProjectConfig;
function isSingleProjectConfig(config) {
    return config.schema !== undefined;
}
exports.isSingleProjectConfig = isSingleProjectConfig;
function isLegacyProjectConfig(config) {
    return (config.schemaPath !== undefined ||
        config.includes !== undefined ||
        config.excludes !== undefined);
}
exports.isLegacyProjectConfig = isLegacyProjectConfig;
function useMiddleware(fns) {
    return (input) => {
        if (fns.length) {
            return fns.reduce((obj, cb) => cb(obj), input);
        }
        return input;
    };
}
exports.useMiddleware = useMiddleware;
