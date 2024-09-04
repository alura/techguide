"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigSync = exports.getConfig = void 0;
const errors_js_1 = require("../errors.js");
const cosmiconfig_js_1 = require("./cosmiconfig.js");
async function getConfig({ filepath, configName, legacy = true, }) {
    validate(filepath);
    return resolve({
        result: await (0, cosmiconfig_js_1.createCosmiConfig)(configName, legacy).load(filepath),
        filepath,
    });
}
exports.getConfig = getConfig;
function getConfigSync({ filepath, configName, legacy = true, }) {
    validate(filepath);
    return resolve({
        result: (0, cosmiconfig_js_1.createCosmiConfigSync)(configName, legacy).load(filepath),
        filepath,
    });
}
exports.getConfigSync = getConfigSync;
//
function resolve({ result, filepath }) {
    if (!result) {
        throw new errors_js_1.ConfigNotFoundError((0, errors_js_1.composeMessage)(`GraphQL Config file is not available: ${filepath}`, `Please check the config filepath.`));
    }
    if (result.isEmpty) {
        throw new errors_js_1.ConfigEmptyError((0, errors_js_1.composeMessage)(`GraphQL Config file is empty.`, `Please check ${result.filepath}`));
    }
    return {
        config: result.config,
        filepath: result.filepath,
    };
}
function validate(filepath) {
    if (!filepath) {
        throw new Error(`Defining a file path is required`);
    }
}
