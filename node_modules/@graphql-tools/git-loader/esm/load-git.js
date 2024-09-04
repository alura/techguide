import { execFile, execFileSync } from 'child_process';
import os from 'os';
const createLoadError = (error) => new Error('Unable to load file from git: ' + error);
const createShowCommand = ({ ref, path }) => {
    return ['show', `${ref}:${path}`];
};
const createTreeError = (error) => new Error('Unable to load the file tree from git: ' + error);
const createTreeCommand = ({ ref }) => {
    return ['ls-tree', '-r', '--name-only', ref];
};
/**
 * @internal
 */
export async function readTreeAtRef(ref) {
    try {
        return await new Promise((resolve, reject) => {
            execFile('git', createTreeCommand({ ref }), { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 1024 }, (error, stdout) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(stdout.split(os.EOL).map(line => line.trim()));
                }
            });
        });
    }
    catch (error) {
        throw createTreeError(error);
    }
}
/**
 * @internal
 */
export function readTreeAtRefSync(ref) {
    try {
        return execFileSync('git', createTreeCommand({ ref }), { encoding: 'utf-8' })
            .split(os.EOL)
            .map(line => line.trim());
    }
    catch (error) {
        throw createTreeError(error);
    }
}
/**
 * @internal
 */
export async function loadFromGit(input) {
    try {
        return await new Promise((resolve, reject) => {
            execFile('git', createShowCommand(input), { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 1024 }, (error, stdout) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
    catch (error) {
        throw createLoadError(error);
    }
}
/**
 * @internal
 */
export function loadFromGitSync(input) {
    try {
        return execFileSync('git', createShowCommand(input), { encoding: 'utf-8' });
    }
    catch (error) {
        throw createLoadError(error);
    }
}
