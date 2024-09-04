import { visit, Kind } from 'graphql';
import { MapperKind, mapSchema, renameType, visitData } from '@graphql-tools/utils';
export default class RenameRootTypes {
    constructor(renamer) {
        this.renamer = renamer;
        this.map = Object.create(null);
        this.reverseMap = Object.create(null);
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        return mapSchema(originalWrappingSchema, {
            [MapperKind.ROOT_OBJECT]: type => {
                const oldName = type.name;
                const newName = this.renamer(oldName);
                if (newName !== undefined && newName !== oldName) {
                    this.map[oldName] = newName;
                    this.reverseMap[newName] = oldName;
                    return renameType(type, newName);
                }
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
