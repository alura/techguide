"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDefinition = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("js-yaml"));
const fs = tslib_1.__importStar(require("fs"));
const Variables_js_1 = require("./Variables.js");
const Output_js_1 = require("./Output.js");
const cache = {};
async function readDefinition(filePath, args, out = new Output_js_1.Output(), envVars, _graceful) {
    try {
        fs.accessSync(filePath);
    }
    catch (_a) {
        throw new Error(`${filePath} could not be found.`);
    }
    const file = fs.readFileSync(filePath, 'utf-8');
    const json = yaml.load(file);
    // we need this copy because populateJson runs inplace
    const jsonCopy = { ...json };
    const vars = new Variables_js_1.Variables(filePath, args, out, envVars);
    const populatedJson = await vars.populateJson(json);
    if (populatedJson.custom) {
        delete populatedJson.custom;
    }
    cache[file] = populatedJson;
    return {
        definition: populatedJson,
        rawJson: jsonCopy,
    };
}
exports.readDefinition = readDefinition;
