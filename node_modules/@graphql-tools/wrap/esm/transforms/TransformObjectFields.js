import { isObjectType } from 'graphql';
import TransformCompositeFields from './TransformCompositeFields.js';
export default class TransformObjectFields {
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
            if (isObjectType(originalWrappingSchema.getType(typeName))) {
                return this.objectFieldTransformer(typeName, fieldName, fieldConfig);
            }
            return undefined;
        };
        this.transformer = new TransformCompositeFields(compositeToObjectFieldTransformer, this.fieldNodeTransformer);
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this._getTransformer().transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this._getTransformer().transformResult(originalResult, delegationContext, transformationContext);
    }
}
