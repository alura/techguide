"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeObject = exports.isObjectLike = exports.sexagesimalToDecimal = exports.isSexagesimal = exports.isDecimal = exports.processValue = void 0;
const error_js_1 = require("../error.js");
var VALUE_RANGES;
(function (VALUE_RANGES) {
    VALUE_RANGES[VALUE_RANGES["NEGATIVE"] = 0] = "NEGATIVE";
    VALUE_RANGES[VALUE_RANGES["NON_NEGATIVE"] = 1] = "NON_NEGATIVE";
    VALUE_RANGES[VALUE_RANGES["POSITIVE"] = 2] = "POSITIVE";
    VALUE_RANGES[VALUE_RANGES["NON_POSITIVE"] = 3] = "NON_POSITIVE";
})(VALUE_RANGES || (VALUE_RANGES = {}));
var VALUE_TYPES;
(function (VALUE_TYPES) {
    VALUE_TYPES[VALUE_TYPES["INT"] = 0] = "INT";
    VALUE_TYPES[VALUE_TYPES["FLOAT"] = 1] = "FLOAT";
})(VALUE_TYPES || (VALUE_TYPES = {}));
// More info about Sexagesimal: https://en.wikipedia.org/wiki/Sexagesimal
const SEXAGESIMAL_REGEX = /^([0-9]{1,3})°\s*([0-9]{1,3}(?:\.(?:[0-9]{1,}))?)['′]\s*(([0-9]{1,3}(\.([0-9]{1,}))?)["″]\s*)?([NEOSW]?)$/;
// TODO: Consider implementing coercion like this...
// See: https://github.com/graphql/graphql-js/blob/master/src/type/scalars.js#L13
// See: https://github.com/graphql/graphql-js/blob/master/src/type/scalars.js#L60
function _validateInt(value) {
    if (!Number.isFinite(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a finite number: ${value}`);
    }
    if (!Number.isInteger(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not an integer: ${value}`);
    }
    if (!Number.isSafeInteger(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a safe integer: ${value}`);
    }
}
function _validateFloat(value) {
    if (!Number.isFinite(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a finite number: ${value}`);
    }
}
const VALIDATIONS = {
    NonPositiveInt: {
        range: VALUE_RANGES.NON_POSITIVE,
        type: VALUE_TYPES.INT,
    },
    PositiveInt: {
        range: VALUE_RANGES.POSITIVE,
        type: VALUE_TYPES.INT,
    },
    NonNegativeInt: {
        range: VALUE_RANGES.NON_NEGATIVE,
        type: VALUE_TYPES.INT,
    },
    NegativeInt: {
        range: VALUE_RANGES.NEGATIVE,
        type: VALUE_TYPES.INT,
    },
    NonPositiveFloat: {
        range: VALUE_RANGES.NON_POSITIVE,
        type: VALUE_TYPES.FLOAT,
    },
    PositiveFloat: {
        range: VALUE_RANGES.POSITIVE,
        type: VALUE_TYPES.FLOAT,
    },
    NonNegativeFloat: {
        range: VALUE_RANGES.NON_NEGATIVE,
        type: VALUE_TYPES.FLOAT,
    },
    NegativeFloat: {
        range: VALUE_RANGES.NEGATIVE,
        type: VALUE_TYPES.FLOAT,
    },
};
function processValue(value, scalarName) {
    const { range, type } = VALIDATIONS[scalarName];
    /* eslint-disable no-restricted-globals */
    /* eslint-disable use-isnan */
    if (value === null ||
        typeof value === 'undefined' ||
        isNaN(value) ||
        Number.isNaN(value) ||
        value === Number.NaN) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a number: ${value}`);
    }
    /* eslint-enable */
    let parsedValue;
    switch (type) {
        case VALUE_TYPES.FLOAT:
            parsedValue = parseFloat(value);
            _validateFloat(parsedValue);
            break;
        case VALUE_TYPES.INT:
            parsedValue = parseInt(value, 10);
            _validateInt(parsedValue);
            break;
        default:
        // no -op, return undefined
    }
    if ((range === VALUE_RANGES.NEGATIVE && !(parsedValue < 0)) ||
        (range === VALUE_RANGES.NON_NEGATIVE && !(parsedValue >= 0)) ||
        (range === VALUE_RANGES.POSITIVE && !(parsedValue > 0)) ||
        (range === VALUE_RANGES.NON_POSITIVE && !(parsedValue <= 0))) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a ${VALUE_RANGES[range].toLowerCase().replace('_', '-')} number: ${value}`);
    }
    return parsedValue;
}
exports.processValue = processValue;
/**
 * Check if the value is in decimal format.
 *
 * @param value - Value to check
 * @returns True if is decimal, false otherwise
 */
function isDecimal(value) {
    const checkedValue = value.toString().trim();
    if (Number.isNaN(Number.parseFloat(checkedValue))) {
        return false;
    }
    return Number.parseFloat(checkedValue) === Number(checkedValue);
}
exports.isDecimal = isDecimal;
/**
 * Check if the value is in sexagesimal format.
 *
 * @param value - Value to check
 * @returns True if sexagesimal, false otherwise
 */
function isSexagesimal(value) {
    if (typeof value !== 'string')
        return false;
    return SEXAGESIMAL_REGEX.test(value.toString().trim());
}
exports.isSexagesimal = isSexagesimal;
/**
 * Converts a sexagesimal coordinate to decimal format.
 *
 * @param value - Value to convert
 * @returns Decimal coordinate
 * @throws {TypeError} if the value is not in sexagesimal format
 */
function sexagesimalToDecimal(value) {
    const data = SEXAGESIMAL_REGEX.exec(value);
    if (typeof data === 'undefined' || data === null) {
        throw (0, error_js_1.createGraphQLError)(`Value is not in sexagesimal format: ${value}`);
    }
    const min = Number(data[2]) / 60 || 0;
    const sec = Number(data[4]) / 3600 || 0;
    const decimal = Number.parseFloat(data[1]) + min + sec;
    // Southern and western coordinates must be negative decimals
    return ['S', 'W'].includes(data[7]) ? -decimal : decimal;
}
exports.sexagesimalToDecimal = sexagesimalToDecimal;
function isObjectLike(value) {
    return typeof value === 'object' && value !== null;
}
exports.isObjectLike = isObjectLike;
// Taken from https://github.com/graphql/graphql-js/blob/30b446938a9b5afeb25c642d8af1ea33f6c849f3/src/type/scalars.ts#L267
// Support serializing objects with custom valueOf() or toJSON() functions -
// a common way to represent a complex value which can be represented as
// a string (ex: MongoDB id objects).
function serializeObject(outputValue) {
    if (isObjectLike(outputValue)) {
        if (typeof outputValue.valueOf === 'function') {
            const valueOfResult = outputValue.valueOf();
            if (!isObjectLike(valueOfResult)) {
                return valueOfResult;
            }
        }
        if (typeof outputValue.toJSON === 'function') {
            return outputValue.toJSON();
        }
    }
    return outputValue;
}
exports.serializeObject = serializeObject;
