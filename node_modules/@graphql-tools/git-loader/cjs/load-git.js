"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFromGitSync = exports.loadFromGit = exports.readTreeAtRefSync = exports.readTreeAtRef = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const os_1 = tslib_1.__importDefault(require("os"));
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
async function readTreeAtRef(ref) {
    try {
        return await new Promise((resolve, reject) => {
            (0, child_process_1.execFile)('git', createTreeCommand({ ref }), { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 1024 }, (error, stdout) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(stdout.split(os_1.default.EOL).map(line => line.trim()));
                }
            });
        });
    }
    catch (error) {
        throw createTreeError(error);
    }
}
exports.readTreeAtRef = readTreeAtRef;
/**
 * @internal
 */
function readTreeAtRefSync(ref) {
    try {
        return (0, child_process_1.execFileSync)('git', createTreeCommand({ ref }), { encoding: 'utf-8' })
            .split(os_1.default.EOL)
            .map(line => line.trim());
    }
    catch (error) {
        throw createTreeError(error);
    }
}
exports.readTreeAtRefSync = readTreeAtRefSync;
/**
 * @internal
 */
async function loadFromGit(input) {
    try {
        return await new Promise((resolve, reject) => {
            (0, child_process_1.execFile)('git', createShowCommand(input), { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 1024 }, (error, stdout) => {
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
exports.loadFromGit = loadFromGit;
/**
 * @internal
 */
function loadFromGitSync(input) {
    try {
        return (0, child_process_1.execFileSync)('git', createShowCommand(input), { encoding: 'utf-8' });
    }
    catch (error) {
        throw createLoadError(error);
    }
}
exports.loadFromGitSync = loadFromGitSync;
