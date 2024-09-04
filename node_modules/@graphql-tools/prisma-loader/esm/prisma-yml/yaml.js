import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { Variables } from './Variables.js';
import { Output } from './Output.js';
const cache = {};
export async function readDefinition(filePath, args, out = new Output(), envVars, _graceful) {
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
    const vars = new Variables(filePath, args, out, envVars);
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
