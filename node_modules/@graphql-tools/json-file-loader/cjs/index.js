"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileLoader = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const path_1 = require("path");
const fs_1 = require("fs");
const process_1 = require("process");
const globby_1 = tslib_1.__importDefault(require("globby"));
const unixify_1 = tslib_1.__importDefault(require("unixify"));
const { readFile, access } = fs_1.promises;
const FILE_EXTENSIONS = ['.json'];
function createGlobbyOptions(options) {
    return { absolute: true, ...options, ignore: [] };
}
const buildIgnoreGlob = (path) => `!${path}`;
/**
 * This loader loads documents and type definitions from JSON files.
 *
 * The JSON file can be the result of an introspection query made against a schema:
 *
 * ```js
 * const schema = await loadSchema('schema-introspection.json', {
 *   loaders: [
 *     new JsonFileLoader()
 *   ]
 * });
 * ```
 *
 * Or it can be a `DocumentNode` object representing a GraphQL document or type definitions:
 *
 * ```js
 * const documents = await loadDocuments('queries/*.json', {
 *   loaders: [
 *     new GraphQLFileLoader()
 *   ]
 * });
 * ```
 */
class JsonFileLoader {
    async canLoad(pointer, options) {
        if ((0, utils_1.isValidPath)(pointer)) {
            if (FILE_EXTENSIONS.find(extension => pointer.endsWith(extension))) {
                const normalizedFilePath = (0, path_1.isAbsolute)(pointer) ? pointer : (0, path_1.resolve)(options.cwd || (0, process_1.cwd)(), pointer);
                try {
                    await access(normalizedFilePath);
                    return true;
                }
                catch (_a) {
                    return false;
                }
            }
        }
        return false;
    }
    canLoadSync(pointer, options) {
        if ((0, utils_1.isValidPath)(pointer)) {
            if (FILE_EXTENSIONS.find(extension => pointer.endsWith(extension))) {
                const normalizedFilePath = (0, path_1.isAbsolute)(pointer) ? pointer : (0, path_1.resolve)(options.cwd || (0, process_1.cwd)(), pointer);
                return (0, fs_1.existsSync)(normalizedFilePath);
            }
        }
        return false;
    }
    _buildGlobs(glob, options) {
        const ignores = (0, utils_1.asArray)(options.ignore || []);
        const globs = [(0, unixify_1.default)(glob), ...ignores.map(v => buildIgnoreGlob((0, unixify_1.default)(v)))];
        return globs;
    }
    async resolveGlobs(glob, options) {
        const globs = this._buildGlobs(glob, options);
        const result = await (0, globby_1.default)(globs, createGlobbyOptions(options));
        return result;
    }
    resolveGlobsSync(glob, options) {
        const globs = this._buildGlobs(glob, options);
        const result = globby_1.default.sync(globs, createGlobbyOptions(options));
        return result;
    }
    async load(pointer, options) {
        const resolvedPaths = await this.resolveGlobs(pointer, options);
        const finalResult = [];
        const errors = [];
        await Promise.all(resolvedPaths.map(async (path) => {
            if (await this.canLoad(path, options)) {
                try {
                    const normalizedFilePath = (0, path_1.isAbsolute)(path) ? path : (0, path_1.resolve)(options.cwd || (0, process_1.cwd)(), path);
                    const rawSDL = await readFile(normalizedFilePath, { encoding: 'utf8' });
                    finalResult.push(this.handleFileContent(normalizedFilePath, rawSDL, options));
                }
                catch (e) {
                    if (process_1.env['DEBUG']) {
                        console.error(e);
                    }
                    errors.push(e);
                }
            }
        }));
        if (errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            }
            throw new utils_1.AggregateError(errors, `Reading from ${pointer} failed ; \n ` + errors.map((e) => e.message).join('\n'));
        }
        return finalResult;
    }
    loadSync(pointer, options) {
        const resolvedPaths = this.resolveGlobsSync(pointer, options);
        const finalResult = [];
        const errors = [];
        for (const path of resolvedPaths) {
            if (this.canLoadSync(path, options)) {
                try {
                    const normalizedFilePath = (0, path_1.isAbsolute)(path) ? path : (0, path_1.resolve)(options.cwd || (0, process_1.cwd)(), path);
                    const rawSDL = (0, fs_1.readFileSync)(normalizedFilePath, { encoding: 'utf8' });
                    finalResult.push(this.handleFileContent(normalizedFilePath, rawSDL, options));
                }
                catch (e) {
                    if (process_1.env['DEBUG']) {
                        console.error(e);
                    }
                    errors.push(e);
                }
            }
        }
        if (errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            }
            throw new utils_1.AggregateError(errors, `Reading from ${pointer} failed ; \n ` + errors.map((e) => e.message).join('\n'));
        }
        return finalResult;
    }
    handleFileContent(normalizedFilePath, rawSDL, options) {
        try {
            return (0, utils_1.parseGraphQLJSON)(normalizedFilePath, rawSDL, options);
        }
        catch (e) {
            throw new Error(`Unable to read JSON file: ${normalizedFilePath}: ${e.message || /* istanbul ignore next */ e}`);
        }
    }
}
exports.JsonFileLoader = JsonFileLoader;
