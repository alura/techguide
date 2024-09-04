"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
class RenameRootTypes {
    constructor(renamer) {
        this.renamer = renamer;
        this.map = Object.create(null);
        this.reverseMap = Object.create(null);
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        return (0, utils_1.mapSchema)(originalWrappingSchema, {
            [utils_1.MapperKind.ROOT_OBJECT]: type => {
                const oldName = type.name;
                const newName = this.renamer(oldName);
                if (newName !== undefined && newName !== oldName) {
                    this.map[oldName] = newName;
                    this.reverseMap[newName] = oldName;
                    return (0, utils_1.renameType)(type, newName);
                }
            },
        });
    }
    transformRequest(originalRequest, _delegationContext, _transformationContext) {
        const document = (0, graphql_1.visit)(originalRequest.document, {
            [graphql_1.Kind.NAMED_TYPE]: (node) => {
                const name = node.name.value;
                if (name in this.reverseMap) {
                    return {
                        ...node,
                        name: {
                            kind: graphql_1.Kind.NAME,
                            value: this.reverseMap[name],
                        },
                    };
                }
            },
        });
        return {
            ...originalRequest,
            document,
        };
    }
    transformResult(originalResult, _delegationContext, _transformationContext) {
        return {
            ...originalResult,
            data: (0, utils_1.visitData)(originalResult.data, object => {
                const typeName = object === null || object === void 0 ? void 0 : object.__typename;
                if (typeName != null && typeName in this.map) {
                    object.__typename = this.map[typeName];
                }
                return object;
            }),
        };
    }
}
exports.default = RenameRootTypes;
