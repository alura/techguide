import { isValidPath, parseGraphQLSDL, asArray, AggregateError, } from '@graphql-tools/utils';
import { isAbsolute, resolve } from 'path';
import { readFileSync, promises as fsPromises, existsSync } from 'fs';
import { cwd as processCwd, env } from 'process';
import { processImport } from '@graphql-tools/import';
import globby from 'globby';
import unixify from 'unixify';
const { readFile, access } = fsPromises;
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
export class GraphQLFileLoader {
    async canLoad(pointer, options) {
        if (isValidPath(pointer)) {
            if (FILE_EXTENSIONS.find(extension => pointer.endsWith(extension))) {
                const normalizedFilePath = isAbsolute(pointer) ? pointer : resolve(options.cwd || processCwd(), pointer);
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
        if (isValidPath(pointer)) {
            if (FILE_EXTENSIONS.find(extension => pointer.endsWith(extension))) {
                const normalizedFilePath = isAbsolute(pointer) ? pointer : resolve(options.cwd || processCwd(), pointer);
                return existsSync(normalizedFilePath);
            }
        }
        return false;
    }
    _buildGlobs(glob, options) {
        const ignores = asArray(options.ignore || []);
        const globs = [unixify(glob), ...ignores.map(v => buildIgnoreGlob(unixify(v)))];
        return globs;
    }
    async resolveGlobs(glob, options) {
        if (!glob.includes('*') &&
            (await this.canLoad(glob, options)) &&
            !asArray(options.ignore || []).length &&
            !options['includeSources'])
            return [glob]; // bypass globby when no glob character, can be loaded, no ignores and source not requested. Fixes problem with pkg and passes ci tests
        const globs = this._buildGlobs(glob, options);
        const result = await globby(globs, createGlobbyOptions(options));
        return result;
    }
    resolveGlobsSync(glob, options) {
        if (!glob.includes('*') &&
            this.canLoadSync(glob, options) &&
            !asArray(options.ignore || []).length &&
            !options['includeSources'])
            return [glob]; // bypass globby when no glob character, can be loaded, no ignores and source not requested. Fixes problem with pkg and passes ci tests
        const globs = this._buildGlobs(glob, options);
        const result = globby.sync(globs, createGlobbyOptions(options));
        return result;
    }
    async load(pointer, options) {
        const resolvedPaths = await this.resolveGlobs(pointer, options);
        const finalResult = [];
        const errors = [];
        await Promise.all(resolvedPaths.map(async (path) => {
            if (await this.canLoad(path, options)) {
                try {
                    const normalizedFilePath = isAbsolute(path) ? path : resolve(options.cwd || processCwd(), path);
                    const rawSDL = await readFile(normalizedFilePath, { encoding: 'utf8' });
                    finalResult.push(this.handleFileContent(rawSDL, normalizedFilePath, options));
                }
                catch (e) {
                    if (env['DEBUG']) {
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
            throw new AggregateError(errors, `Reading from ${pointer} failed ; \n ` + errors.map((e) => e.message).join('\n'));
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
                    const normalizedFilePath = isAbsolute(path) ? path : resolve(options.cwd || processCwd(), path);
                    const rawSDL = readFileSync(normalizedFilePath, { encoding: 'utf8' });
                    finalResult.push(this.handleFileContent(rawSDL, normalizedFilePath, options));
                }
                catch (e) {
                    if (env['DEBUG']) {
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
            throw new AggregateError(errors, `Reading from ${pointer} failed ; \n ` + errors.map((e) => e.message).join('\n'));
        }
        return finalResult;
    }
    handleFileContent(rawSDL, pointer, options) {
        if (!options.skipGraphQLImport && isGraphQLImportFile(rawSDL)) {
            const document = processImport(pointer, options.cwd);
            return {
                location: pointer,
                document,
            };
        }
        return parseGraphQLSDL(pointer, rawSDL, options);
    }
}
