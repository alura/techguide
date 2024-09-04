"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReferencedFieldsByType = void 0;
const graphql_1 = require("graphql");
const usage_reporting_protobuf_1 = require("@apollo/usage-reporting-protobuf");
function calculateReferencedFieldsByType({ document, schema, resolvedOperationName, }) {
    const documentSeparatedByOperation = (0, graphql_1.separateOperations)(document);
    const filteredDocument = documentSeparatedByOperation[resolvedOperationName !== null && resolvedOperationName !== void 0 ? resolvedOperationName : ""];
    if (!filteredDocument) {
        throw Error(`shouldn't happen: operation '${resolvedOperationName !== null && resolvedOperationName !== void 0 ? resolvedOperationName : ""}' not found`);
    }
    const typeInfo = new graphql_1.TypeInfo(schema);
    const interfaces = new Set();
    const referencedFieldSetByType = Object.create(null);
    (0, graphql_1.visit)(filteredDocument, (0, graphql_1.visitWithTypeInfo)(typeInfo, {
        Field(field) {
            const fieldName = field.name.value;
            const parentType = typeInfo.getParentType();
            if (!parentType) {
                throw Error(`shouldn't happen: missing parent type for field ${fieldName}`);
            }
            const parentTypeName = parentType.name;
            if (!referencedFieldSetByType[parentTypeName]) {
                referencedFieldSetByType[parentTypeName] = new Set();
                if ((0, graphql_1.isInterfaceType)(parentType)) {
                    interfaces.add(parentTypeName);
                }
            }
            referencedFieldSetByType[parentTypeName].add(fieldName);
        },
    }));
    const referencedFieldsByType = Object.create(null);
    for (const [typeName, fieldNames] of Object.entries(referencedFieldSetByType)) {
        referencedFieldsByType[typeName] = new usage_reporting_protobuf_1.ReferencedFieldsForType({
            fieldNames: [...fieldNames],
            isInterface: interfaces.has(typeName),
        });
    }
    return referencedFieldsByType;
}
exports.calculateReferencedFieldsByType = calculateReferencedFieldsByType;
//# sourceMappingURL=calculateReferencedFieldsByType.js.map