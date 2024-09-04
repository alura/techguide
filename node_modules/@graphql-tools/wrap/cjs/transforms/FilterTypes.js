"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@graphql-tools/utils");
class FilterTypes {
    constructor(filter) {
        this.filter = filter;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        return (0, utils_1.mapSchema)(originalWrappingSchema, {
            [utils_1.MapperKind.TYPE]: (type) => {
                if (this.filter(type)) {
                    return undefined;
                }
                return null;
            },
        });
    }
}
exports.default = FilterTypes;
