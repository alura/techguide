import { mapSchema, MapperKind } from '@graphql-tools/utils';
import TransformInputObjectFields from './TransformInputObjectFields.js';
export default class RenameInputObjectFields {
    constructor(renamer) {
        this.renamer = renamer;
        this.transformer = new TransformInputObjectFields((typeName, inputFieldName, inputFieldConfig) => {
            const newName = renamer(typeName, inputFieldName, inputFieldConfig);
            if (newName !== undefined && newName !== inputFieldName) {
                const value = renamer(typeName, inputFieldName, inputFieldConfig);
                if (value != null) {
                    return [value, inputFieldConfig];
                }
            }
        }, (typeName, inputFieldName, inputFieldNode) => {
            if (!(typeName in this.reverseMap)) {
                return inputFieldNode;
            }
            const inputFieldNameMap = this.reverseMap[typeName];
            if (!(inputFieldName in inputFieldNameMap)) {
                return inputFieldNode;
            }
            return {
                ...inputFieldNode,
                name: {
                    ...inputFieldNode.name,
                    value: inputFieldNameMap[inputFieldName],
                },
            };
        });
        this.reverseMap = Object.create(null);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        mapSchema(originalWrappingSchema, {
            [MapperKind.INPUT_OBJECT_FIELD]: (inputFieldConfig, fieldName, typeName) => {
                const newName = this.renamer(typeName, fieldName, inputFieldConfig);
                if (newName !== undefined && newName !== fieldName) {
                    if (this.reverseMap[typeName] == null) {
                        this.reverseMap[typeName] = Object.create(null);
                    }
                    this.reverseMap[typeName][newName] = fieldName;
                }
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
