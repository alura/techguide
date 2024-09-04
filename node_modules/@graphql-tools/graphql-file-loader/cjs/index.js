"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLFileLoader = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const path_1 = require("path");
const fs_1 = require("fs");
const process_1 = require("process");
const import_1 = require("@graphql-tools/import");
const globby_1 = tslib_1.__importDefault(require("globby"));
const unixify_1 = tslib_1.__importDefault(require("unixify"));
const { readFile, access } = fs_1.promises;
const FILE_EXTENSIONS = ['.gql', '.gqls', '.graphql', '.graphqls'];
function isGraphQLImportFile(rawSDL) {
    const trimmedRawSDL = rawSDL.trim();
    return trimmedRawSDL.startsWith('# import') || trimmedRawSDL.startsWith('#import');
}
function createGlobbyOptions(options) {
    return { absolute: true, ...options, ignore: [] };
}
const buildIgnoreGlob = (path) => `!${path}`;
/**
 * This loader loads documents and type definitions from `.graphql` files.
 *
 * You can load a single source:
 *
 * ```js
 * const schema = await loadSchema('schema.graphql', {
 *   loaders: [
 *     new GraphQLFileLoader()
 *   ]
 * });
 * ```
 *
 * Or provide a glob pattern to load multiple sources:
 *
 * ```js
 * const schema = await loadSchema('graphql/*.graphql', {
 *   loaders: [
 *     new GraphQLFileLoader()
 *   ]
 * });
 * ```
 */
class GraphQLFileLoader {
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
        if (!glob.includes('*') &&
            (await this.canLoad(glob, options)) &&
            !(0, utils_1.asArray)(options.ignore || []).length &&
            !options['includeSources'])
            return [glob]; // bypass globby when no glob character, can be loaded, no ignores and source not requested. Fixes problem with pkg and passes ci tests
        const globs = this._buildGlobs(glob, options);
        const result = await (0, globby_1.default)(globs, createGlobbyOptions(options));
        return result;
    }
    resolveGlobsSync(glob, options) {
        if (!glob.includes('*') &&
            this.canLoadSync(glob, options) &&
            !(0, utils_1.asArray)(options.ignore || []).length &&
            !options['includeSources'])
            return [glob]; // bypass globby when no glob character, can be loaded, no ignores and source not requested. Fixes problem with pkg and passes ci tests
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
                    finalResult.push(this.handleFileContent(rawSDL, normalizedFilePath, options));
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
                    finalResult.push(this.handleFileContent(rawSDL, normalizedFilePath, options));
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
    handleFileContent(rawSDL, pointer, options) {
        if (!options.skipGraphQLImport && isGraphQLImportFile(rawSDL)) {
            const document = (0, import_1.processImport)(pointer, options.cwd);
            return {
                location: pointer,
                document,
            };
        }
        return (0, utils_1.parseGraphQLSDL)(pointer, rawSDL, options);
    }
}
exports.GraphQLFileLoader = GraphQLFileLoader;
