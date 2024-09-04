import { mapSchema, MapperKind } from '@graphql-tools/utils';
import TransformObjectFields from './TransformObjectFields.js';
export default class RenameObjectFieldArguments {
    constructor(renamer) {
        this.renamer = renamer;
        this.transformer = new TransformObjectFields((typeName, fieldName, fieldConfig) => {
            const argsConfig = Object.fromEntries(Object.entries(fieldConfig.args || []).map(([argName, conf]) => {
                const newName = renamer(typeName, fieldName, argName);
                if (newName !== undefined && newName !== argName) {
                    if (newName != null) {
                        return [newName, conf];
                    }
                }
                return [argName, conf];
            }));
            return [fieldName, { ...fieldConfig, args: argsConfig }];
        }, (typeName, fieldName, inputFieldNode) => {
            if (!(typeName in this.reverseMap)) {
                return inputFieldNode;
            }
            if (!(fieldName in this.reverseMap[typeName])) {
                return inputFieldNode;
            }
            const fieldNameMap = this.reverseMap[typeName][fieldName];
            return {
                ...inputFieldNode,
                arguments: (inputFieldNode.arguments || []).map(argNode => {
                    return argNode.name.value in fieldNameMap
                        ? {
                            ...argNode,
                            name: {
                                ...argNode.name,
                                value: fieldNameMap[argNode.name.value],
                            },
                        }
                        : argNode;
                }),
            };
        });
        this.reverseMap = Object.create(null);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        mapSchema(originalWrappingSchema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
                Object.entries(fieldConfig.args || {}).forEach(([argName]) => {
                    const newName = this.renamer(typeName, fieldName, argName);
                    if (newName !== undefined && newName !== fieldName) {
                        if (this.reverseMap[typeName] == null) {
                            this.reverseMap[typeName] = Object.create(null);
                        }
                        if (this.reverseMap[typeName][fieldName] == null) {
                            this.reverseMap[typeName][fieldName] = Object.create(null);
                        }
                        this.reverseMap[typeName][fieldName][newName] = argName;
                    }
                });
                return undefined;
            },
            [MapperKind.ROOT_OBJECT]() {
                return undefined;
            },
        });
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
}
