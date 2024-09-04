import { ConfigNotFoundError, ConfigEmptyError, composeMessage } from '../errors.js';
import { createCosmiConfig, createCosmiConfigSync } from './cosmiconfig.js';
const CWD = process.cwd();
export async function findConfig({ rootDir = CWD, legacy = true, configName, }) {
    validate(rootDir);
    return resolve({
        rootDir,
        result: await createCosmiConfig(configName, legacy).search(rootDir),
    });
}
export function findConfigSync({ rootDir = CWD, legacy = true, configName }) {
    validate(rootDir);
    return resolve({
        rootDir,
        result: createCosmiConfigSync(configName, legacy).search(rootDir),
    });
}
function validate(rootDir) {
    if (!rootDir) {
        throw new Error(`Defining a root directory is required`);
    }
}
function resolve({ result, rootDir }) {
    if (!result) {
        throw new ConfigNotFoundError(composeMessage(`GraphQL Config file is not available in the provided config directory: ${rootDir}`, `Please check the config directory.`));
    }
    if (result.isEmpty) {
        throw new ConfigEmptyError(composeMessage(`GraphQL Config file is empty.`, `Please check ${result.filepath}`));
    }
    return {
        config: result.config,
        filepath: result.filepath,
    };
}
