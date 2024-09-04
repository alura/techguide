export function isSubschemaConfig(value) {
    return Boolean(value === null || value === void 0 ? void 0 : value.schema);
}
export function cloneSubschemaConfig(subschemaConfig) {
    var _a, _b;
    const newSubschemaConfig = {
        ...subschemaConfig,
        transforms: subschemaConfig.transforms != null ? [...subschemaConfig.transforms] : undefined,
    };
    if (newSubschemaConfig.merge != null) {
        newSubschemaConfig.merge = { ...subschemaConfig.merge };
        for (const typeName in newSubschemaConfig.merge) {
            const mergedTypeConfig = (newSubschemaConfig.merge[typeName] = { ...((_b = (_a = subschemaConfig.merge) === null || _a === void 0 ? void 0 : _a[typeName]) !== null && _b !== void 0 ? _b : {}) });
            if (mergedTypeConfig.entryPoints != null) {
                mergedTypeConfig.entryPoints = mergedTypeConfig.entryPoints.map(entryPoint => ({ ...entryPoint }));
            }
            if (mergedTypeConfig.fields != null) {
                const fields = (mergedTypeConfig.fields = { ...mergedTypeConfig.fields });
                for (const fieldName in fields) {
                    fields[fieldName] = { ...fields[fieldName] };
                }
            }
        }
    }
    return newSubschemaConfig;
}
