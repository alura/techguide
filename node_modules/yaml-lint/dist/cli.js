#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const nconf_1 = __importDefault(require("nconf"));
const consola_1 = __importDefault(require("consola"));
const globby_1 = require("globby");
const _1 = require(".");
nconf_1.default
    .argv()
    .env({
    match: /^yamllint/i,
})
    .file({
    file: (0, path_1.resolve)(process.cwd(), '.yaml-lint.json'),
});
const options = {
    schema: nconf_1.default.get('schema') ||
        nconf_1.default.get('yamllint_schema') ||
        nconf_1.default.get('YAMLLINT_SCHEMA'),
    ignore: nconf_1.default.get('ignore') ||
        nconf_1.default.get('yamllint_ignore') ||
        nconf_1.default.get('YAMLLINT_IGNORE'),
};
const config = nconf_1.default.get();
let files = [];
(config._ || []).forEach((pattern) => {
    files = files.concat((0, globby_1.sync)((0, path_1.resolve)(process.cwd(), pattern).replace(/\\/g, '/'), {
        dot: true,
        ignore: []
            .concat(config.ignore)
            .filter(Boolean)
            .map((item) => (0, path_1.resolve)(process.cwd(), item).replace(/\\/g, '/')),
        absolute: true,
    }));
});
if (files.length === 0) {
    consola_1.default.error('YAML Lint failed.');
    consola_1.default.error('No YAML files were found matching your selection.');
    process.exit(1);
}
else {
    Promise.allSettled(files.map((file) => (0, _1.lintFile)(file, options).catch((err) => {
        throw Object.assign(err, {
            file,
        });
    }))).then((results) => {
        const errors = results.filter((result) => result.status === 'rejected');
        if (errors.length > 0) {
            consola_1.default.error(`YAML Lint failed for ${errors.length} file${errors.length === 1 ? '' : 's'}`);
            errors.forEach((error) => {
                consola_1.default.log(error.reason.file);
                consola_1.default.error(error.reason);
            });
            process.exit(1);
        }
        else {
            consola_1.default.success('YAML Lint successful.');
        }
    });
}
