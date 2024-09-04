import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const MONGODB_OBJECTID_REGEX = /*#__PURE__*/ /^[A-Fa-f0-9]{24}$/;
export const GraphQLObjectID = /*#__PURE__*/ new GraphQLScalarType({
    name: 'ObjectID',
    description: 'A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c',
    serialize(value) {
        if (!MONGODB_OBJECTID_REGEX.test(value)) {
            throw createGraphQLError(`Value is not a valid mongodb object id of form: ${value}`);
        }
        return value;
    },
    parseValue(value) {
        if (!MONGODB_OBJECTID_REGEX.test(value)) {
            throw createGraphQLError(`Value is not a valid mongodb object id of form: ${value}`);
        }
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as mongodb object id but got a: ${ast.kind}`, {
                nodes: [ast],
            });
        }
        if (!MONGODB_OBJECTID_REGEX.test(ast.value)) {
            throw createGraphQLError(`Value is not a valid mongodb object id of form: ${ast.value}`, {
                nodes: ast,
            });
        }
        return ast.value;
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'ObjectID',
            type: 'string',
            pattern: MONGODB_OBJECTID_REGEX.source,
        },
    },
});
