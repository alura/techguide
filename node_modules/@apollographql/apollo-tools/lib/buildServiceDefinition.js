"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServiceDefinition = void 0;
const graphql_1 = require("graphql");
const graphql_2 = require("./utilities/graphql");
const predicates_1 = require("./utilities/predicates");
function flattened(arr) {
    return new Array().concat(...arr);
}
function buildServiceDefinition(modules) {
    const errors = [];
    const typeDefinitionsMap = Object.create(null);
    const typeExtensionsMap = Object.create(null);
    const directivesMap = Object.create(null);
    const schemaDefinitions = [];
    const schemaExtensions = [];
    for (let module of modules) {
        if ((0, graphql_2.isNode)(module) && (0, graphql_2.isDocumentNode)(module)) {
            module = { typeDefs: module };
        }
        for (const definition of module.typeDefs.definitions) {
            if ((0, graphql_1.isTypeDefinitionNode)(definition)) {
                const typeName = definition.name.value;
                if (typeDefinitionsMap[typeName]) {
                    typeDefinitionsMap[typeName].push(definition);
                }
                else {
                    typeDefinitionsMap[typeName] = [definition];
                }
            }
            else if ((0, graphql_1.isTypeExtensionNode)(definition)) {
                const typeName = definition.name.value;
                if (typeExtensionsMap[typeName]) {
                    typeExtensionsMap[typeName].push(definition);
                }
                else {
                    typeExtensionsMap[typeName] = [definition];
                }
            }
            else if (definition.kind === graphql_1.Kind.DIRECTIVE_DEFINITION) {
                const directiveName = definition.name.value;
                if (directivesMap[directiveName]) {
                    directivesMap[directiveName].push(definition);
                }
                else {
                    directivesMap[directiveName] = [definition];
                }
            }
            else if (definition.kind === graphql_1.Kind.SCHEMA_DEFINITION) {
                schemaDefinitions.push(definition);
            }
            else if (definition.kind === graphql_1.Kind.SCHEMA_EXTENSION) {
                schemaExtensions.push(definition);
            }
        }
    }
    for (const [typeName, typeDefinitions] of Object.entries(typeDefinitionsMap)) {
        if (typeDefinitions.length > 1) {
            errors.push(new graphql_1.GraphQLError(`Type "${typeName}" was defined more than once.`, typeDefinitions));
        }
    }
    for (const [directiveName, directives] of Object.entries(directivesMap)) {
        if (directives.length > 1) {
            errors.push(new graphql_1.GraphQLError(`Directive "${directiveName}" was defined more than once.`, directives));
        }
    }
    let operationTypeMap;
    if (schemaDefinitions.length > 0 || schemaExtensions.length > 0) {
        operationTypeMap = {};
        const schemaDefinition = schemaDefinitions[schemaDefinitions.length - 1];
        const operationTypes = flattened([schemaDefinition, ...schemaExtensions]
            .map((node) => node.operationTypes)
            .filter(predicates_1.isNotNullOrUndefined));
        for (const operationType of operationTypes) {
            const typeName = operationType.type.name.value;
            const operation = operationType.operation;
            if (operationTypeMap[operation]) {
                throw new graphql_1.GraphQLError(`Must provide only one ${operation} type in schema.`, [schemaDefinition]);
            }
            if (!(typeDefinitionsMap[typeName] || typeExtensionsMap[typeName])) {
                throw new graphql_1.GraphQLError(`Specified ${operation} type "${typeName}" not found in document.`, [schemaDefinition]);
            }
            operationTypeMap[operation] = typeName;
        }
    }
    else {
        operationTypeMap = {
            query: "Query",
            mutation: "Mutation",
            subscription: "Subscription",
        };
    }
    for (const [typeName, typeExtensions] of Object.entries(typeExtensionsMap)) {
        if (!typeDefinitionsMap[typeName]) {
            if (Object.values(operationTypeMap).includes(typeName)) {
                typeDefinitionsMap[typeName] = [
                    {
                        kind: graphql_1.Kind.OBJECT_TYPE_DEFINITION,
                        name: {
                            kind: graphql_1.Kind.NAME,
                            value: typeName,
                        },
                    },
                ];
            }
            else {
                errors.push(new graphql_1.GraphQLError(`Cannot extend type "${typeName}" because it does not exist in the existing schema.`, typeExtensions));
            }
        }
    }
    if (errors.length > 0) {
        return { errors };
    }
    try {
        const typeDefinitions = flattened(Object.values(typeDefinitionsMap));
        const directives = flattened(Object.values(directivesMap));
        let schema = (0, graphql_1.buildASTSchema)({
            kind: graphql_1.Kind.DOCUMENT,
            definitions: [...typeDefinitions, ...directives],
        });
        const typeExtensions = flattened(Object.values(typeExtensionsMap));
        if (typeExtensions.length > 0) {
            schema = (0, graphql_1.extendSchema)(schema, {
                kind: graphql_1.Kind.DOCUMENT,
                definitions: typeExtensions,
            });
        }
        for (const module of modules) {
            if ("kind" in module || !module.resolvers)
                continue;
            addResolversToSchema(schema, module.resolvers);
        }
        return { schema };
    }
    catch (error) {
        return { errors: [error] };
    }
}
exports.buildServiceDefinition = buildServiceDefinition;
function addResolversToSchema(schema, resolvers) {
    for (const [typeName, fieldConfigs] of Object.entries(resolvers)) {
        const type = schema.getType(typeName);
        if (!(0, graphql_1.isObjectType)(type))
            continue;
        const fieldMap = type.getFields();
        for (const [fieldName, fieldConfig] of Object.entries(fieldConfigs)) {
            if (fieldName.startsWith("__")) {
                type[fieldName.substring(2)] = fieldConfig;
                continue;
            }
            const field = fieldMap[fieldName];
            if (!field)
                continue;
            if (typeof fieldConfig === "function") {
                field.resolve = fieldConfig;
            }
            else {
                if (fieldConfig.resolve) {
                    field.resolve = fieldConfig.resolve;
                }
                if (fieldConfig.subscribe) {
                    field.subscribe = fieldConfig.subscribe;
                }
            }
        }
    }
}
//# sourceMappingURL=buildServiceDefinition.js.map