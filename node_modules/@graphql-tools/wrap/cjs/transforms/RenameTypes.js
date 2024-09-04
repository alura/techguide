"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
class RenameTypes {
    constructor(renamer, options) {
        this.renamer = renamer;
        this.map = Object.create(null);
        this.reverseMap = Object.create(null);
        const { renameBuiltins = false, renameScalars = true } = options != null ? options : {};
        this.renameBuiltins = renameBuiltins;
        this.renameScalars = renameScalars;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        const typeNames = new Set(Object.keys(originalWrappingSchema.getTypeMap()));
        return (0, utils_1.mapSchema)(originalWrappingSchema, {
            [utils_1.MapperKind.TYPE]: (type) => {
                if ((0, graphql_1.isSpecifiedScalarType)(type) && !this.renameBuiltins) {
                    return undefined;
                }
                if ((0, graphql_1.isScalarType)(type) && !this.renameScalars) {
                    return undefined;
                }
                const oldName = type.name;
                const newName = this.renamer(oldName);
                if (newName !== undefined && newName !== oldName) {
                    if (typeNames.has(newName)) {
                        console.warn(`New type name ${newName} for ${oldName} already exists in the schema. Skip renaming.`);
                        return;
                    }
                    this.map[oldName] = newName;
                    this.reverseMap[newName] = oldName;
                    typeNames.delete(oldName);
                    typeNames.add(newName);
                    return (0, utils_1.renameType)(type, newName);
                }
            },
            [utils_1.MapperKind.ROOT_OBJECT]() {
                return undefined;
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
exports.default = RenameTypes;
