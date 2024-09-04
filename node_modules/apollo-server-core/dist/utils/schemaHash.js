"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemaHash = void 0;
const language_1 = require("graphql/language");
const execution_1 = require("graphql/execution");
const utilities_1 = require("graphql/utilities");
const fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
const createSHA_1 = __importDefault(require("./createSHA"));
function generateSchemaHash(schema) {
    const introspectionQuery = (0, utilities_1.getIntrospectionQuery)();
    const document = (0, language_1.parse)(introspectionQuery);
    const result = (0, execution_1.execute)({
        schema,
        document,
    });
    if (result &&
        typeof result.then === 'function') {
        throw new Error([
            'The introspection query is resolving asynchronously; execution of an introspection query is not expected to return a `Promise`.',
            '',
            'Wrapped type resolvers should maintain the existing execution dynamics of the resolvers they wrap (i.e. async vs sync) or introspection types should be excluded from wrapping by checking them with `graphql/type`s, `isIntrospectionType` predicate function prior to wrapping.',
        ].join('\n'));
    }
    if (!result || !result.data || !result.data.__schema) {
        throw new Error('Unable to generate server introspection document.');
    }
    const introspectionSchema = result.data.__schema;
    const stringifiedSchema = (0, fast_json_stable_stringify_1.default)(introspectionSchema);
    return (0, createSHA_1.default)('sha512')
        .update(stringifiedSchema)
        .digest('hex');
}
exports.generateSchemaHash = generateSchemaHash;
//# sourceMappingURL=schemaHash.js.map