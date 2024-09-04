import { introspectionFromSchema } from 'graphql';
import { removeFederation } from '@graphql-codegen/plugin-helpers';
import { extname } from 'path';

var MapperKind;
(function (MapperKind) {
    MapperKind[MapperKind["Namespace"] = 0] = "Namespace";
    MapperKind[MapperKind["Default"] = 1] = "Default";
    MapperKind[MapperKind["Regular"] = 2] = "Regular";
})(MapperKind || (MapperKind = {}));

const getConfigValue = (value, defaultValue) => {
    if (value === null || value === undefined) {
        return defaultValue;
    }
    return value;
};

const plugin = async (schema, _documents, pluginConfig) => {
    const cleanSchema = pluginConfig.federation ? removeFederation(schema) : schema;
    const descriptions = getConfigValue(pluginConfig.descriptions, true);
    const directiveIsRepeatable = getConfigValue(pluginConfig.directiveIsRepeatable, true);
    const schemaDescription = getConfigValue(pluginConfig.schemaDescription, undefined);
    const specifiedByUrl = getConfigValue(pluginConfig.specifiedByUrl, undefined);
    const introspection = introspectionFromSchema(cleanSchema, {
        descriptions,
        directiveIsRepeatable,
        schemaDescription,
        specifiedByUrl,
    });
    return pluginConfig.minify ? JSON.stringify(introspection) : JSON.stringify(introspection, null, 2);
};
const validate = async (schema, documents, config, outputFile) => {
    if (extname(outputFile) !== '.json') {
        throw new Error(`Plugin "introspection" requires extension to be ".json"!`);
    }
};

export { plugin, validate };
