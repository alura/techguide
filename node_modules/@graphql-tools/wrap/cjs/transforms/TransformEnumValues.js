"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const MapLeafValues_js_1 = tslib_1.__importDefault(require("./MapLeafValues.js"));
class TransformEnumValues {
    constructor(enumValueTransformer, inputValueTransformer, outputValueTransformer) {
        this.noTransformation = true;
        this.enumValueTransformer = enumValueTransformer;
        this.mapping = Object.create(null);
        this.reverseMapping = Object.create(null);
        this.transformer = new MapLeafValues_js_1.default(generateValueTransformer(inputValueTransformer, this.reverseMapping), generateValueTransformer(outputValueTransformer, this.mapping));
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        const mappingSchema = this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
        this.transformedSchema = (0, utils_1.mapSchema)(mappingSchema, {
            [utils_1.MapperKind.ENUM_VALUE]: (valueConfig, typeName, _schema, externalValue) => this.transformEnumValue(typeName, externalValue, valueConfig),
            [utils_1.MapperKind.ARGUMENT]: argConfig => {
                if (argConfig.defaultValue != null) {
                    const newValue = (0, utils_1.transformInputValue)(argConfig.type, argConfig.defaultValue, (type, value) => {
                        var _a, _b;
                        return (_b = (_a = this.mapping[type.name]) === null || _a === void 0 ? void 0 : _a[value]) !== null && _b !== void 0 ? _b : value;
                    });
                    return {
                        ...argConfig,
                        defaultValue: newValue,
                    };
                }
            },
        });
        return this.transformedSchema;
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        if (this.noTransformation) {
            return originalRequest;
        }
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        if (this.noTransformation) {
            return originalResult;
        }
        return this.transformer.transformResult(originalResult, delegationContext, transformationContext);
    }
    transformEnumValue(typeName, externalValue, enumValueConfig) {
        const transformedEnumValue = this.enumValueTransformer(typeName, externalValue, enumValueConfig);
        if (Array.isArray(transformedEnumValue)) {
            const newExternalValue = transformedEnumValue[0];
            if (newExternalValue !== externalValue) {
                if (!(typeName in this.mapping)) {
                    this.mapping[typeName] = Object.create(null);
                    this.reverseMapping[typeName] = Object.create(null);
                }
                this.mapping[typeName][externalValue] = newExternalValue;
                this.reverseMapping[typeName][newExternalValue] = externalValue;
                this.noTransformation = false;
            }
            return [
                newExternalValue,
                {
                    ...transformedEnumValue[1],
                    value: undefined,
                },
            ];
        }
        return {
            ...transformedEnumValue,
            value: undefined,
        };
    }
}
exports.default = TransformEnumValues;
function mapEnumValues(typeName, value, mapping) {
    var _a;
    const newExternalValue = (_a = mapping[typeName]) === null || _a === void 0 ? void 0 : _a[value];
    return newExternalValue != null ? newExternalValue : value;
}
function generateValueTransformer(valueTransformer, mapping) {
    if (valueTransformer == null) {
        return (typeName, value) => mapEnumValues(typeName, value, mapping);
    }
    else {
        return (typeName, value) => mapEnumValues(typeName, valueTransformer(typeName, value), mapping);
    }
}
