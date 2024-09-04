import { ConfigNotFoundError, ConfigEmptyError, composeMessage } from '../errors.js';
import { createCosmiConfigSync, createCosmiConfig } from './cosmiconfig.js';
export async function getConfig({ filepath, configName, legacy = true, }) {
    validate(filepath);
    return resolve({
        result: await createCosmiConfig(configName, legacy).load(filepath),
        filepath,
    });
}
export function getConfigSync({ filepath, configName, legacy = true, }) {
    validate(filepath);
    return resolve({
        result: createCosmiConfigSync(configName, legacy).load(filepath),
        filepath,
    });
}
//
function resolve({ result, filepath }) {
    if (!result) {
        throw new ConfigNotFoundError(composeMessage(`GraphQL Config file is not available: ${filepath}`, `Please check the config filepath.`));
    }
    if (result.isEmpty) {
        throw new ConfigEmptyError(composeMessage(`GraphQL Config file is empty.`, `Please check ${result.filepath}`));
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
