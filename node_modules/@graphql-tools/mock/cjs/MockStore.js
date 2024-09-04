"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockStore = exports.MockStore = exports.defaultMocks = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const fast_json_stable_stringify_1 = tslib_1.__importDefault(require("fast-json-stable-stringify"));
const types_js_1 = require("./types.js");
const utils_js_1 = require("./utils.js");
const MockList_js_1 = require("./MockList.js");
exports.defaultMocks = {
    Int: () => Math.round(Math.random() * 200) - 100,
    Float: () => Math.random() * 200 - 100,
    String: () => 'Hello World',
    Boolean: () => Math.random() > 0.5,
    ID: () => (0, utils_js_1.uuidv4)(),
};
const defaultKeyFieldNames = ['id', '_id'];
class MockStore {
    constructor({ schema, mocks, typePolicies, }) {
        this.store = {};
        this.schema = schema;
        this.mocks = { ...exports.defaultMocks, ...mocks };
        this.typePolicies = typePolicies || {};
    }
    has(typeName, key) {
        return !!this.store[typeName] && !!this.store[typeName][key];
    }
    get(_typeName, _key, _fieldName, _fieldArgs) {
        if (typeof _typeName !== 'string') {
            if (_key === undefined) {
                if ((0, types_js_1.isRef)(_typeName)) {
                    throw new Error("Can't provide a ref as first argument and no other argument");
                }
                // get({...})
                return this.getImpl(_typeName);
            }
            else {
                (0, types_js_1.assertIsRef)(_typeName);
                const { $ref } = _typeName;
                // arguments shift
                _fieldArgs = _fieldName;
                _fieldName = _key;
                _key = $ref.key;
                _typeName = $ref.typeName;
            }
        }
        const args = {
            typeName: _typeName,
        };
        if ((0, types_js_1.isRecord)(_key) || _key === undefined) {
            // get('User', { name: 'Alex'})
            args.defaultValue = _key;
            return this.getImpl(args);
        }
        args.key = _key;
        if (Array.isArray(_fieldName) && _fieldName.length === 1) {
            _fieldName = _fieldName[0];
        }
        if (typeof _fieldName !== 'string' && !Array.isArray(_fieldName)) {
            // get('User', 'me', { name: 'Alex'})
            args.defaultValue = _fieldName;
            return this.getImpl(args);
        }
        if (Array.isArray(_fieldName)) {
            // get('User', 'me', ['father', 'name'])
            const ref = this.get(_typeName, _key, _fieldName[0], _fieldArgs);
            (0, types_js_1.assertIsRef)(ref);
            return this.get(ref.$ref.typeName, ref.$ref.key, _fieldName.slice(1, _fieldName.length));
        }
        // get('User', 'me', 'name'...);
        args.fieldName = _fieldName;
        args.fieldArgs = _fieldArgs;
        return this.getImpl(args);
    }
    set(_typeName, _key, _fieldName, _value) {
        if (typeof _typeName !== 'string') {
            if (_key === undefined) {
                if ((0, types_js_1.isRef)(_typeName)) {
                    throw new Error("Can't provide a ref as first argument and no other argument");
                }
                // set({...})
                return this.setImpl(_typeName);
            }
            else {
                (0, types_js_1.assertIsRef)(_typeName);
                const { $ref } = _typeName;
                // arguments shift
                _value = _fieldName;
                _fieldName = _key;
                _key = $ref.key;
                _typeName = $ref.typeName;
            }
        }
        assertIsDefined(_key, 'key was not provided');
        const args = {
            typeName: _typeName,
            key: _key,
        };
        if (typeof _fieldName !== 'string') {
            // set('User', 1, { name: 'Foo' })
            if (!(0, types_js_1.isRecord)(_fieldName))
                throw new Error('Expected value to be a record');
            args.value = _fieldName;
            return this.setImpl(args);
        }
        args.fieldName = _fieldName;
        args.value = _value;
        return this.setImpl(args);
    }
    reset() {
        this.store = {};
    }
    filter(key, predicate) {
        const entity = this.store[key];
        return Object.values(entity).filter(predicate);
    }
    find(key, predicate) {
        const entity = this.store[key];
        return Object.values(entity).find(predicate);
    }
    getImpl(args) {
        const { typeName, key, fieldName, fieldArgs, defaultValue } = args;
        if (!fieldName) {
            if (defaultValue !== undefined && !(0, types_js_1.isRecord)(defaultValue)) {
                throw new Error('`defaultValue` should be an object');
            }
            let valuesToInsert = defaultValue || {};
            if (key) {
                valuesToInsert = { ...valuesToInsert, ...(0, utils_js_1.makeRef)(typeName, key) };
            }
            return this.insert(typeName, valuesToInsert, true);
        }
        assertIsDefined(key, 'key argument should be given when fieldName is given');
        const fieldNameInStore = getFieldNameInStore(fieldName, fieldArgs);
        if (this.store[typeName] === undefined ||
            this.store[typeName][key] === undefined ||
            this.store[typeName][key][fieldNameInStore] === undefined) {
            let value;
            if (defaultValue !== undefined) {
                value = defaultValue;
            }
            else if (this.isKeyField(typeName, fieldName)) {
                value = key;
            }
            else {
                value = this.generateFieldValue(typeName, fieldName, (otherFieldName, otherValue) => {
                    // if we get a key field in the mix we don't care
                    if (this.isKeyField(typeName, otherFieldName))
                        return;
                    this.set({ typeName, key, fieldName: otherFieldName, value: otherValue, noOverride: true });
                });
            }
            this.set({ typeName, key, fieldName, fieldArgs, value, noOverride: true });
        }
        return this.store[typeName][key][fieldNameInStore];
    }
    setImpl(args) {
        const { typeName, key, fieldName, fieldArgs, noOverride } = args;
        let { value } = args;
        if ((0, MockList_js_1.isMockList)(value)) {
            value = (0, MockList_js_1.deepResolveMockList)(value);
        }
        if (this.store[typeName] === undefined) {
            this.store[typeName] = {};
        }
        if (this.store[typeName][key] === undefined) {
            this.store[typeName][key] = {};
        }
        if (!fieldName) {
            if (!(0, types_js_1.isRecord)(value)) {
                throw new Error('When no `fieldName` is provided, `value` should be a record.');
            }
            for (const fieldName in value) {
                this.setImpl({
                    typeName,
                    key,
                    fieldName,
                    value: value[fieldName],
                    noOverride,
                });
            }
            return;
        }
        const fieldNameInStore = getFieldNameInStore(fieldName, fieldArgs);
        if (this.isKeyField(typeName, fieldName) && value !== key) {
            throw new Error(`Field ${fieldName} is a key field of ${typeName} and you are trying to set it to ${value} while the key is ${key}`);
        }
        // if already set and we don't override
        if (this.store[typeName][key][fieldNameInStore] !== undefined && noOverride) {
            return;
        }
        const fieldType = this.getFieldType(typeName, fieldName);
        const currentValue = this.store[typeName][key][fieldNameInStore];
        let valueToStore;
        try {
            valueToStore = this.normalizeValueToStore(fieldType, value, currentValue, (typeName, values) => this.insert(typeName, values, noOverride));
        }
        catch (e) {
            throw new Error(`Value to set in ${typeName}.${fieldName} in not normalizable: ${e.message}`);
        }
        this.store[typeName][key] = {
            ...this.store[typeName][key],
            [fieldNameInStore]: valueToStore,
        };
    }
    normalizeValueToStore(fieldType, value, currentValue, onInsertType) {
        const fieldTypeName = fieldType.toString();
        if (value === null) {
            if (!(0, graphql_1.isNullableType)(fieldType)) {
                throw new Error(`should not be null because ${fieldTypeName} is not nullable. Received null.`);
            }
            return null;
        }
        const nullableFieldType = (0, graphql_1.getNullableType)(fieldType);
        if (value === undefined)
            return this.generateValueFromType(nullableFieldType);
        // deal with nesting insert
        if ((0, graphql_1.isCompositeType)(nullableFieldType)) {
            if (!(0, types_js_1.isRecord)(value))
                throw new Error(`should be an object or null or undefined. Received ${value}`);
            let joinedTypeName;
            if ((0, graphql_1.isAbstractType)(nullableFieldType)) {
                if ((0, types_js_1.isRef)(value)) {
                    joinedTypeName = value.$ref.typeName;
                }
                else {
                    if (typeof value['__typename'] !== 'string') {
                        throw new Error(`should contain a '__typename' because ${nullableFieldType.name} an abstract type`);
                    }
                    joinedTypeName = value['__typename'];
                }
            }
            else {
                joinedTypeName = nullableFieldType.name;
            }
            return onInsertType(joinedTypeName, (0, types_js_1.isRef)(currentValue) ? { ...currentValue, ...value } : value);
        }
        if ((0, graphql_1.isListType)(nullableFieldType)) {
            if (!Array.isArray(value))
                throw new Error(`should be an array or null or undefined. Received ${value}`);
            return value.map((v, index) => {
                return this.normalizeValueToStore(nullableFieldType.ofType, v, typeof currentValue === 'object' && currentValue != null && currentValue[index] ? currentValue : undefined, onInsertType);
            });
        }
        return value;
    }
    insert(typeName, values, noOverride) {
        const keyFieldName = this.getKeyFieldName(typeName);
        let key;
        // when we generate a key for the type, we might produce
        // other associated values with it
        // We keep track of them and we'll insert them, with propririty
        // for the ones that we areasked to insert
        const otherValues = {};
        if ((0, types_js_1.isRef)(values)) {
            key = values.$ref.key;
        }
        else if (keyFieldName && keyFieldName in values) {
            key = values[keyFieldName];
        }
        else {
            key = this.generateKeyForType(typeName, (otherFieldName, otherFieldValue) => {
                otherValues[otherFieldName] = otherFieldValue;
            });
        }
        const toInsert = { ...otherValues, ...values };
        for (const fieldName in toInsert) {
            if (fieldName === '$ref')
                continue;
            if (fieldName === '__typename')
                continue;
            this.set({
                typeName,
                key,
                fieldName,
                value: toInsert[fieldName],
                noOverride,
            });
        }
        if (this.store[typeName] === undefined) {
            this.store[typeName] = {};
        }
        if (this.store[typeName][key] === undefined) {
            this.store[typeName][key] = {};
        }
        return (0, utils_js_1.makeRef)(typeName, key);
    }
    generateFieldValue(typeName, fieldName, onOtherFieldsGenerated) {
        const mockedValue = this.generateFieldValueFromMocks(typeName, fieldName, onOtherFieldsGenerated);
        if (mockedValue !== undefined)
            return mockedValue;
        const fieldType = this.getFieldType(typeName, fieldName);
        return this.generateValueFromType(fieldType);
    }
    generateFieldValueFromMocks(typeName, fieldName, onOtherFieldsGenerated) {
        let value;
        const mock = this.mocks ? this.mocks[typeName] : undefined;
        if (mock) {
            if (typeof mock === 'function') {
                const values = mock();
                if (typeof values !== 'object' || values == null) {
                    throw new Error(`Value returned by the mock for ${typeName} is not an object`);
                }
                for (const otherFieldName in values) {
                    if (otherFieldName === fieldName)
                        continue;
                    if (typeof values[otherFieldName] === 'function')
                        continue;
                    onOtherFieldsGenerated && onOtherFieldsGenerated(otherFieldName, values[otherFieldName]);
                }
                value = values[fieldName];
                if (typeof value === 'function')
                    value = value();
            }
            else if (typeof mock === 'object' && mock != null && typeof mock[fieldName] === 'function') {
                value = mock[fieldName]();
            }
        }
        if (value !== undefined)
            return value;
        const type = this.getType(typeName);
        // GraphQL 14 Compatibility
        const interfaces = 'getInterfaces' in type ? type.getInterfaces() : [];
        if (interfaces.length > 0) {
            for (const interface_ of interfaces) {
                if (value)
                    break;
                value = this.generateFieldValueFromMocks(interface_.name, fieldName, onOtherFieldsGenerated);
            }
        }
        return value;
    }
    generateKeyForType(typeName, onOtherFieldsGenerated) {
        const keyFieldName = this.getKeyFieldName(typeName);
        if (!keyFieldName)
            return (0, utils_js_1.uuidv4)();
        return this.generateFieldValue(typeName, keyFieldName, onOtherFieldsGenerated);
    }
    generateValueFromType(fieldType) {
        const nullableType = (0, graphql_1.getNullableType)(fieldType);
        if ((0, graphql_1.isScalarType)(nullableType)) {
            const mockFn = this.mocks[nullableType.name];
            if (typeof mockFn !== 'function')
                throw new Error(`No mock defined for type "${nullableType.name}"`);
            return mockFn();
        }
        else if ((0, graphql_1.isEnumType)(nullableType)) {
            const mockFn = this.mocks[nullableType.name];
            if (typeof mockFn === 'function')
                return mockFn();
            const values = nullableType.getValues().map(v => v.value);
            return (0, utils_js_1.takeRandom)(values);
        }
        else if ((0, graphql_1.isObjectType)(nullableType)) {
            // this will create a new random ref
            return this.insert(nullableType.name, {});
        }
        else if ((0, graphql_1.isListType)(nullableType)) {
            return [...new Array((0, utils_js_1.randomListLength)())].map(() => this.generateValueFromType(nullableType.ofType));
        }
        else if ((0, graphql_1.isAbstractType)(nullableType)) {
            const mock = this.mocks[nullableType.name];
            let typeName;
            let values = {};
            if (!mock) {
                typeName = (0, utils_js_1.takeRandom)(this.schema.getPossibleTypes(nullableType).map(t => t.name));
            }
            else if (typeof mock === 'function') {
                const mockRes = mock();
                if (mockRes === null)
                    return null;
                if (!(0, types_js_1.isRecord)(mockRes)) {
                    throw new Error(`Value returned by the mock for ${nullableType.name} is not an object or null`);
                }
                values = mockRes;
                if (typeof values['__typename'] !== 'string') {
                    throw new Error(`Please return a __typename in "${nullableType.name}"`);
                }
                typeName = values['__typename'];
            }
            else if (typeof mock === 'object' && mock != null && typeof mock['__typename'] === 'function') {
                const mockRes = mock['__typename']();
                if (typeof mockRes !== 'string')
                    throw new Error(`'__typename' returned by the mock for abstract type ${nullableType.name} is not a string`);
                typeName = mockRes;
            }
            else {
                throw new Error(`Please return a __typename in "${nullableType.name}"`);
            }
            const toInsert = {};
            for (const fieldName in values) {
                if (fieldName === '__typename')
                    continue;
                const fieldValue = values[fieldName];
                toInsert[fieldName] = typeof fieldValue === 'function' ? fieldValue() : fieldValue;
            }
            return this.insert(typeName, toInsert);
        }
        else {
            throw new Error(`${nullableType} not implemented`);
        }
    }
    getFieldType(typeName, fieldName) {
        if (fieldName === '__typename') {
            return graphql_1.GraphQLString;
        }
        const type = this.getType(typeName);
        const field = type.getFields()[fieldName];
        if (!field) {
            throw new Error(`${fieldName} does not exist on type ${typeName}`);
        }
        return field.type;
    }
    getType(typeName) {
        const type = this.schema.getType(typeName);
        if (!type || !((0, graphql_1.isObjectType)(type) || (0, graphql_1.isInterfaceType)(type))) {
            throw new Error(`${typeName} does not exist on schema or is not an object or interface`);
        }
        return type;
    }
    isKeyField(typeName, fieldName) {
        return this.getKeyFieldName(typeName) === fieldName;
    }
    getKeyFieldName(typeName) {
        var _a;
        const typePolicyKeyField = (_a = this.typePolicies[typeName]) === null || _a === void 0 ? void 0 : _a.keyFieldName;
        if (typePolicyKeyField !== undefined) {
            if (typePolicyKeyField === false)
                return null;
            return typePolicyKeyField;
        }
        // How about common key field names?
        const gqlType = this.getType(typeName);
        for (const fieldName in gqlType.getFields()) {
            if (defaultKeyFieldNames.includes(fieldName)) {
                return fieldName;
            }
        }
        return null;
    }
}
exports.MockStore = MockStore;
const getFieldNameInStore = (fieldName, fieldArgs) => {
    if (!fieldArgs)
        return fieldName;
    if (typeof fieldArgs === 'string') {
        return `${fieldName}:${fieldArgs}`;
    }
    // empty args
    if (Object.keys(fieldArgs).length === 0) {
        return fieldName;
    }
    return `${fieldName}:${(0, fast_json_stable_stringify_1.default)(fieldArgs)}`;
};
function assertIsDefined(value, message) {
    if (value !== undefined && value !== null) {
        return;
    }
    throw new Error(process.env['NODE_ENV'] === 'production' ? 'Invariant failed:' : `Invariant failed: ${message || ''}`);
}
/**
 * Will create `MockStore` for the given `schema`.
 *
 * A `MockStore` will generate mock values for the given schem when queried.
 *
 * It will stores generated mocks, so that, provided with same arguments
 * the returned values will be the same.
 *
 * Its API also allows to modify the stored values.
 *
 * Basic example:
 * ```ts
 * store.get('User', 1, 'name');
 * // > "Hello World"
 * store.set('User', 1, 'name', 'Alexandre');
 * store.get('User', 1, 'name');
 * // > "Alexandre"
 * ```
 *
 * The storage key will correspond to the "key field"
 * of the type. Field with name `id` or `_id` will be
 * by default considered as the key field for the type.
 * However, use `typePolicies` to precise the field to use
 * as key.
 */
function createMockStore(options) {
    return new MockStore(options);
}
exports.createMockStore = createMockStore;
