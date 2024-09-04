"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateToEndpoint = exports.replaceYamlValue = void 0;
const tslib_1 = require("tslib");
const yamlParser = tslib_1.__importStar(require("yaml-ast-parser"));
/**
 * Comments out the current entry of a specific key in a yaml document and creates a new value next to it
 * @param key key in yaml document to comment out
 * @param newValue new value to add in the document
 */
function replaceYamlValue(input, key, newValue) {
    const ast = yamlParser.safeLoad(input);
    const position = getPosition(ast, key);
    const newEntry = `${key}: ${newValue}\n`;
    if (!position) {
        return input + '\n' + newEntry;
    }
    return (input.slice(0, position.start) +
        '#' +
        input.slice(position.start, position.end) +
        newEntry +
        input.slice(position.end));
}
exports.replaceYamlValue = replaceYamlValue;
function getPosition(ast, key) {
    const mapping = ast.mappings.find((m) => m.key.value === key);
    if (!mapping) {
        return undefined;
    }
    return {
        start: mapping.startPosition,
        end: mapping.endPosition + 1,
    };
}
function commentOut(input, keys) {
    let output = input;
    for (const key of keys) {
        const ast = yamlParser.safeLoad(output);
        const position = getPosition(ast, key);
        if (position) {
            output = output.slice(0, position.start) + '#' + output.slice(position.start);
        }
    }
    return output;
}
function migrateToEndpoint(input, endpoint) {
    const output = commentOut(input, ['service', 'stage', 'cluster']);
    return replaceYamlValue(output, 'endpoint', endpoint);
}
exports.migrateToEndpoint = migrateToEndpoint;
