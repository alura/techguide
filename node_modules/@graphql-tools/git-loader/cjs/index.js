"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLoader = void 0;
const tslib_1 = require("tslib");
const graphql_tag_pluck_1 = require("@graphql-tools/graphql-tag-pluck");
const micromatch_1 = tslib_1.__importDefault(require("micromatch"));
const unixify_1 = tslib_1.__importDefault(require("unixify"));
const load_git_js_1 = require("./load-git.js");
const parse_js_1 = require("./parse.js");
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const is_glob_1 = tslib_1.__importDefault(require("is-glob"));
const process_1 = require("process");
// git:branch:path/to/file
function extractData(pointer) {
    const parts = pointer.replace(/^git\:/i, '').split(':');
    if (!parts || parts.length !== 2) {
        return null;
    }
    return {
        ref: parts[0],
        path: parts[1],
    };
}
/**
 * This loader loads a file from git.
 *
 * ```js
 * const typeDefs = await loadTypedefs('git:someBranch:some/path/to/file.js', {
 *   loaders: [new GitLoader()],
 * })
 * ```
 */
class GitLoader {
    async canLoad(pointer) {
        return this.canLoadSync(pointer);
    }
    canLoadSync(pointer) {
        return typeof pointer === 'string' && pointer.toLowerCase().startsWith('git:');
    }
    async resolveGlobs(glob, ignores) {
        const data = extractData(glob);
        if (data === null) {
            return [];
        }
        const refsForPaths = new Map();
        const { ref, path } = data;
        if (!refsForPaths.has(ref)) {
            refsForPaths.set(ref, []);
        }
        refsForPaths.get(ref).push((0, unixify_1.default)(path));
        for (const ignore of ignores) {
            const data = extractData(ignore);
            if (data === null) {
                continue;
            }
            const { ref, path } = data;
            if (!refsForPaths.has(ref)) {
                refsForPaths.set(ref, []);
            }
            refsForPaths.get(ref).push(`!${(0, unixify_1.default)(path)}`);
        }
        const maybeLeadingDotSlash = path.startsWith('./') ? './' : '';
        const resolved = [];
        await Promise.all([...refsForPaths.entries()].map(async ([ref, paths]) => {
            resolved.push(...(0, micromatch_1.default)(await (0, load_git_js_1.readTreeAtRef)(ref), paths).map(filePath => `git:${ref}:${maybeLeadingDotSlash}${filePath}`));
        }));
        return resolved;
    }
    resolveGlobsSync(glob, ignores) {
        const data = extractData(glob);
        if (data === null) {
            return [];
        }
        const { ref, path } = data;
        const refsForPaths = new Map();
        if (!refsForPaths.has(ref)) {
            refsForPaths.set(ref, []);
        }
        refsForPaths.get(ref).push((0, unixify_1.default)(path));
        for (const ignore of ignores) {
            const data = extractData(ignore);
            if (data === null) {
                continue;
            }
            const { ref, path } = data;
            if (!refsForPaths.has(ref)) {
                refsForPaths.set(ref, []);
            }
            refsForPaths.get(ref).push(`!${(0, unixify_1.default)(path)}`);
        }
        const maybeLeadingDotSlash = path.startsWith('./') ? './' : '';
        const resolved = [];
        for (const [ref, paths] of refsForPaths.entries()) {
            resolved.push(...(0, micromatch_1.default)((0, load_git_js_1.readTreeAtRefSync)(ref), paths).map(filePath => `git:${ref}:${maybeLeadingDotSlash}${filePath}`));
        }
        return resolved;
    }
    async handleSingularPointerAsync(pointer, options) {
        const result = extractData(pointer);
        if (result === null) {
            return [];
        }
        const { ref, path } = result;
        const content = await (0, load_git_js_1.loadFromGit)({ ref, path });
        const parsed = (0, parse_js_1.parse)({ path, options, pointer, content });
        if (parsed) {
            return [parsed];
        }
        const sources = await (0, graphql_tag_pluck_1.gqlPluckFromCodeString)(pointer, content, options.pluckConfig);
        return sources.map(source => ({
            location: pointer,
            document: (0, graphql_1.parse)(source, options),
        }));
    }
    async load(pointer, options) {
        const result = extractData(pointer);
        if (result === null) {
            return [];
        }
        const { path } = result;
        const finalResult = [];
        const errors = [];
        try {
            if ((0, is_glob_1.default)(path)) {
                const resolvedPaths = await this.resolveGlobs(pointer, (0, utils_1.asArray)(options.ignore || []));
                await Promise.all(resolvedPaths.map(async (path) => {
                    const results = await this.load(path, options);
                    results === null || results === void 0 ? void 0 : results.forEach(result => finalResult.push(result));
                }));
            }
            else if (await this.canLoad(pointer)) {
                const results = await this.handleSingularPointerAsync(pointer, options);
                results === null || results === void 0 ? void 0 : results.forEach(result => finalResult.push(result));
            }
        }
        catch (error) {
            if (process_1.env['DEBUG']) {
                console.error(error);
            }
            if (error instanceof utils_1.AggregateError) {
                for (const errorElement of error.errors) {
                    errors.push(errorElement);
                }
            }
            else {
                errors.push(error);
            }
        }
        if (finalResult.length === 0 && errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            }
            throw new utils_1.AggregateError(errors, `Reading from ${pointer} failed ; \n ` + errors.map((e) => e.message).join('\n'));
        }
        return finalResult;
    }
    handleSingularPointerSync(pointer, options) {
        const result = extractData(pointer);
        if (result === null) {
            return [];
        }
        const { ref, path } = result;
        const content = (0, load_git_js_1.loadFromGitSync)({ ref, path });
        const parsed = (0, parse_js_1.parse)({ path, options, pointer, content });
        if (parsed) {
            return [parsed];
        }
        const sources = (0, graphql_tag_pluck_1.gqlPluckFromCodeStringSync)(pointer, content, options.pluckConfig);
        return sources.map(source => ({
            location: pointer,
            document: (0, graphql_1.parse)(source, options),
        }));
    }
    loadSync(pointer, options) {
        const result = extractData(pointer);
        if (result === null) {
            return [];
        }
        const { path } = result;
        const finalResult = [];
        const errors = [];
        try {
            if ((0, is_glob_1.default)(path)) {
                const resolvedPaths = this.resolveGlobsSync(pointer, (0, utils_1.asArray)(options.ignore || []));
                for (const path of resolvedPaths) {
                    if (this.canLoadSync(path)) {
                        const results = this.loadSync(path, options);
                        for (const result of results) {
                            finalResult.push(result);
                        }
                    }
                }
            }
            else if (this.canLoadSync(pointer)) {
                const results = this.handleSingularPointerSync(pointer, options);
                for (const result of results) {
                    finalResult.push(result);
                }
            }
        }
        catch (error) {
            if (process_1.env['DEBUG']) {
                console.error(error);
            }
            if (error instanceof utils_1.AggregateError) {
                for (const errorElement of error.errors) {
                    errors.push(errorElement);
                }
            }
            else {
                errors.push(error);
            }
        }
        if (finalResult.length === 0 && errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            }
            throw new utils_1.AggregateError(errors, `Reading from ${pointer} failed ; \n ` + errors.map((e) => e.message).join('\n'));
        }
        return finalResult;
    }
}
exports.GitLoader = GitLoader;
