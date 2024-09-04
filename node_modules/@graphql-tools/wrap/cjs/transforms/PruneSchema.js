"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@graphql-tools/utils");
class PruneTypes {
    constructor(options = {}) {
        this.options = options;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        return (0, utils_1.pruneSchema)(originalWrappingSchema, this.options);
    }
}
exports.default = PruneTypes;
