import { TypeInfo, visit, visitWithTypeInfo, Kind, } from 'graphql';
import { MapperKind, mapSchema, visitData } from '@graphql-tools/utils';
export default class TransformCompositeFields {
    constructor(fieldTransformer, fieldNodeTransformer, dataTransformer, errorsTransformer) {
        this.fieldTransformer = fieldTransformer;
        this.fieldNodeTransformer = fieldNodeTransformer;
        this.dataTransformer = dataTransformer;
        this.errorsTransformer = errorsTransformer;
        this.mapping = {};
    }
    _getTypeInfo() {
        const typeInfo = this.typeInfo;
        if (typeInfo === undefined) {
            throw new Error(`The TransformCompositeFields transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return typeInfo;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        var _a;
        this.transformedSchema = mapSchema(originalWrappingSchema, {
            [MapperKind.COMPOSITE_FIELD]: (fieldConfig, fieldName, typeName) => {
                const transformedField = this.fieldTransformer(typeName, fieldName, fieldConfig);
                if (Array.isArray(transformedField)) {
                    const newFieldName = transformedField[0];
                    if (newFieldName !== fieldName) {
                        if (!(typeName in this.mapping)) {
                            this.mapping[typeName] = {};
                        }
                        this.mapping[typeName][newFieldName] = fieldName;
                    }
                }
                return transformedField;
            },
        });
        this.typeInfo = new TypeInfo(this.transformedSchema);
        this.subscriptionTypeName = (_a = originalWrappingSchema.getSubscriptionType()) === null || _a === void 0 ? void 0 : _a.name;
        return this.transformedSchema;
    }
    transformRequest(originalRequest, _delegationContext, transformationContext) {
        const document = originalRequest.document;
        return {
            ...originalRequest,
            document: this.transformDocument(document, transformationContext),
        };
    }
    transformResult(result, _delegationContext, transformationContext) {
        const dataTransformer = this.dataTransformer;
        if (dataTransformer != null) {
            result.data = visitData(result.data, value => dataTransformer(value, transformationContext));
        }
        if (this.errorsTransformer != null && Array.isArray(result.errors)) {
            result.errors = this.errorsTransformer(result.errors, transformationContext);
        }
        return result;
    }
    transformDocument(document, transformationContext) {
        const fragments = Object.create(null);
        for (const def of document.definitions) {
            if (def.kind === Kind.FRAGMENT_DEFINITION) {
                fragments[def.name.value] = def;
            }
        }
        return visit(document, visitWithTypeInfo(this._getTypeInfo(), {
            [Kind.SELECTION_SET]: {
                leave: node => this.transformSelectionSet(node, this._getTypeInfo(), fragments, transformationContext),
            },
        }));
    }
    transformSelectionSet(node, typeInfo, fragments, transformationContext) {
        var _a, _b;
        const parentType = typeInfo.getParentType();
        if (parentType == null) {
            return undefined;
        }
        const parentTypeName = parentType.name;
        let newSelections = [];
        let typeNameExists = node.selections.some(selection => selection.kind === Kind.FIELD && selection.name.value === '__typename');
        for (const selection of node.selections) {
            if (selection.kind !== Kind.FIELD || selection.name.value === '__typename') {
                newSelections.push(selection);
                continue;
            }
            const newName = selection.name.value;
            // See https://github.com/ardatan/graphql-tools/issues/2282
            if (!typeNameExists &&
                (this.dataTransformer != null || this.errorsTransformer != null) &&
                (this.subscriptionTypeName == null || parentTypeName !== this.subscriptionTypeName)) {
                newSelections.push({
                    kind: Kind.FIELD,
                    name: {
                        kind: Kind.NAME,
                        value: '__typename',
                    },
                });
                typeNameExists = true;
            }
            let transformedSelection;
            if (this.fieldNodeTransformer == null) {
                transformedSelection = selection;
            }
            else {
                transformedSelection = this.fieldNodeTransformer(parentTypeName, newName, selection, fragments, transformationContext);
                transformedSelection = transformedSelection === undefined ? selection : transformedSelection;
            }
            if (transformedSelection == null) {
                continue;
            }
            else if (Array.isArray(transformedSelection)) {
                newSelections = newSelections.concat(transformedSelection);
                continue;
            }
            else if (transformedSelection.kind !== Kind.FIELD) {
                newSelections.push(transformedSelection);
                continue;
            }
            const typeMapping = this.mapping[parentTypeName];
            if (typeMapping == null) {
                newSelections.push(transformedSelection);
                continue;
            }
            const oldName = this.mapping[parentTypeName][newName];
            if (oldName == null) {
                newSelections.push(transformedSelection);
                continue;
            }
            newSelections.push({
                ...transformedSelection,
                name: {
                    kind: Kind.NAME,
                    value: oldName,
                },
                alias: {
                    kind: Kind.NAME,
                    value: (_b = (_a = transformedSelection.alias) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : newName,
                },
            });
        }
        return {
            ...node,
            selections: newSelections,
        };
    }
}
