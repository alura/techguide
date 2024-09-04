import { Kind, isScalarType, isSpecifiedScalarType, visit, } from 'graphql';
import { MapperKind, mapSchema, visitData, renameType, } from '@graphql-tools/utils';
export default class RenameTypes {
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
        return mapSchema(originalWrappingSchema, {
            [MapperKind.TYPE]: (type) => {
                if (isSpecifiedScalarType(type) && !this.renameBuiltins) {
                    return undefined;
                }
                if (isScalarType(type) && !this.renameScalars) {
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
                    return renameType(type, newName);
                }
            },
            [MapperKind.ROOT_OBJECT]() {
                return undefined;
            },
        });
    }
    transformRequest(originalRequest, _delegationContext, _transformationContext) {
        const document = visit(originalRequest.document, {
            [Kind.NAMED_TYPE]: (node) => {
                const name = node.name.value;
                if (name in this.reverseMap) {
                    return {
                        ...node,
                        name: {
                            kind: Kind.NAME,
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
            data: visitData(originalResult.data, object => {
                const typeName = object === null || object === void 0 ? void 0 : object.__typename;
                if (typeName != null && typeName in this.map) {
                    object.__typename = this.map[typeName];
                }
                return object;
            }),
        };
    }
}
