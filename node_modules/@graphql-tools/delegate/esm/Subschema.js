import { applySchemaTransforms } from './applySchemaTransforms.js';
export function isSubschema(value) {
    return Boolean(value.transformedSchema);
}
export class Subschema {
    constructor(config) {
        var _a;
        this.schema = config.schema;
        this.executor = config.executor;
        this.batch = config.batch;
        this.batchingOptions = config.batchingOptions;
        this.createProxyingResolver = config.createProxyingResolver;
        this.transforms = (_a = config.transforms) !== null && _a !== void 0 ? _a : [];
        this.merge = config.merge;
    }
    get transformedSchema() {
        var _a, _b;
        if (!this._transformedSchema) {
            if (((_b = (_a = globalThis.process) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b['DEBUG']) != null) {
                console.warn('Transformed schema is not set yet. Returning a dummy one.');
            }
            this._transformedSchema = applySchemaTransforms(this.schema, this);
        }
        return this._transformedSchema;
    }
    set transformedSchema(value) {
        this._transformedSchema = value;
    }
}
