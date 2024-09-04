"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConfigSync = exports.findConfig = void 0;
const errors_js_1 = require("../errors.js");
const cosmiconfig_js_1 = require("./cosmiconfig.js");
const CWD = process.cwd();
async function findConfig({ rootDir = CWD, legacy = true, configName, }) {
    validate(rootDir);
    return resolve({
        rootDir,
        result: await (0, cosmiconfig_js_1.createCosmiConfig)(configName, legacy).search(rootDir),
    });
}
exports.findConfig = findConfig;
function findConfigSync({ rootDir = CWD, legacy = true, configName }) {
    validate(rootDir);
    return resolve({
        rootDir,
        result: (0, cosmiconfig_js_1.createCosmiConfigSync)(configName, legacy).search(rootDir),
    });
}
exports.findConfigSync = findConfigSync;
function validate(rootDir) {
    if (!rootDir) {
        throw new Error(`Defining a root directory is required`);
    }
}
function resolve({ result, rootDir }) {
    if (!result) {
        throw new errors_js_1.ConfigNotFoundError((0, errors_js_1.composeMessage)(`GraphQL Config file is not available in the provided config directory: ${rootDir}`, `Please check the config directory.`));
    }
    if (result.isEmpty) {
        throw new errors_js_1.ConfigEmptyError((0, errors_js_1.composeMessage)(`GraphQL Config file is empty.`, `Please check ${result.filepath}`));
    }
    return {
        config: result.config,
        filepath: result.filepath,
    };
}
