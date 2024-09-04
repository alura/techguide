"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const TransformCompositeFields_js_1 = tslib_1.__importDefault(require("./TransformCompositeFields.js"));
class TransformObjectFields {
    constructor(objectFieldTransformer, fieldNodeTransformer) {
        this.objectFieldTransformer = objectFieldTransformer;
        this.fieldNodeTransformer = fieldNodeTransformer;
    }
    _getTransformer() {
        const transformer = this.transformer;
        if (transformer === undefined) {
            throw new Error(`The TransformObjectFields transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return transformer;
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        const compositeToObjectFieldTransformer = (typeName, fieldName, fieldConfig) => {
            if ((0, graphql_1.isObjectType)(originalWrappingSchema.getType(typeName))) {
                return this.objectFieldTransformer(typeName, fieldName, fieldConfig);
            }
            return undefined;
        };
        this.transformer = new TransformCompositeFields_js_1.default(compositeToObjectFieldTransformer, this.fieldNodeTransformer);
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this._getTransformer().transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this._getTransformer().transformResult(originalResult, delegationContext, transformationContext);
    }
}
exports.default = TransformObjectFields;
