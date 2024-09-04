"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TransformObjectFields_js_1 = tslib_1.__importDefault(require("./TransformObjectFields.js"));
class TransformRootFields {
    constructor(rootFieldTransformer, fieldNodeTransformer) {
        this.rootFieldTransformer = rootFieldTransformer;
        this.fieldNodeTransformer = fieldNodeTransformer;
    }
    _getTransformer() {
        const transformer = this.transformer;
        if (transformer === undefined) {
            throw new Error(`The TransformRootFields transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return transformer;
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        const rootToObjectFieldTransformer = (typeName, fieldName, fieldConfig) => {
            var _a, _b, _c;
            if (typeName === ((_a = originalWrappingSchema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name)) {
                return this.rootFieldTransformer('Query', fieldName, fieldConfig);
            }
            if (typeName === ((_b = originalWrappingSchema.getMutationType()) === null || _b === void 0 ? void 0 : _b.name)) {
                return this.rootFieldTransformer('Mutation', fieldName, fieldConfig);
            }
            if (typeName === ((_c = originalWrappingSchema.getSubscriptionType()) === null || _c === void 0 ? void 0 : _c.name)) {
                return this.rootFieldTransformer('Subscription', fieldName, fieldConfig);
            }
            return undefined;
        };
        this.transformer = new TransformObjectFields_js_1.default(rootToObjectFieldTransformer, this.fieldNodeTransformer);
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this._getTransformer().transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this._getTransformer().transformResult(originalResult, delegationContext, transformationContext);
    }
}
exports.default = TransformRootFields;
