"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintFile = exports.lint = void 0;
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const schemas = {
    FAILSAFE_SCHEMA: js_yaml_1.FAILSAFE_SCHEMA,
    JSON_SCHEMA: js_yaml_1.JSON_SCHEMA,
    CORE_SCHEMA: js_yaml_1.CORE_SCHEMA,
    DEFAULT_SCHEMA: js_yaml_1.DEFAULT_SCHEMA,
};
const lint = (content, opts) => new Promise((resolve, reject) => {
    var _a;
    try {
        (0, js_yaml_1.loadAll)(content, undefined, {
            schema: schemas[(_a = opts === null || opts === void 0 ? void 0 : opts.schema) !== null && _a !== void 0 ? _a : 'DEFAULT_SCHEMA'],
        });
        resolve(true);
    }
    catch (e) {
        reject(e);
    }
});
exports.lint = lint;
const lintFile = (file, opts) => new Promise((resolve, reject) => {
    (0, fs_1.readFile)(file, 'utf8', (err, content) => {
        if (err) {
            reject(err);
        }
        else {
            (0, exports.lint)(content, opts)
                .then((result) => {
                resolve(result);
            })
                .catch((e) => {
                reject(e);
            });
        }
    });
});
exports.lintFile = lintFile;
