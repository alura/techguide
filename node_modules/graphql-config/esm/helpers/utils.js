export function isMultipleProjectConfig(config) {
    return typeof config.projects === 'object';
}
export function isSingleProjectConfig(config) {
    return config.schema !== undefined;
}
export function isLegacyProjectConfig(config) {
    return (config.schemaPath !== undefined ||
        config.includes !== undefined ||
        config.excludes !== undefined);
}
export function useMiddleware(fns) {
    return (input) => {
        if (fns.length) {
            return fns.reduce((obj, cb) => cb(obj), input);
        }
        return input;
    };
}
