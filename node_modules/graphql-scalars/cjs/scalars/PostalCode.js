"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLPostalCode = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
// We're going to start with a limited set as suggested here:
// http://www.pixelenvision.com/1708/zip-postal-code-validation-regex-php-code-for-12-countries/
// and here:
// https://stackoverflow.com/questions/578406/what-is-the-ultimate-postal-code-and-zip-regex
//
// Which gives us the following countries:
//
// US - United States
// UK - United Kingdom
// DE - Germany
// CA - Canada
// FR - France
// IT - Italy
// AU - Australia
// NL - Netherlands
// ES - Spain
// DK - Denmark
// SE - Sweden
// BE - Belgium
// IN - India
// AT - Austria
// PT - Portugal
// CH - Switzerland
// LU - Luxembourg
// IR - Iran
// JP - Japan
// UA - Ukraine
//
// This is really a practical decision of weight (of the package) vs. completeness.
//
// In the future we might expand this list and use the more comprehensive list found here:
// http://unicode.org/cldr/trac/browser/tags/release-26-0-1/common/supplemental/postalCodeData.xml
// prettier-ignore
const POSTAL_CODE_REGEXES = [
    /* US */ /*#__PURE__*/ /^\d{5}([-]?\d{4})?$/,
    /* UK */ /*#__PURE__*/ /^(GIR|[A-Z]\d[A-Z\d]??|[A-Z]{2}\d[A-Z\d]??)[ ]??(\d[A-Z]{2})$/,
    /* DE */ /*#__PURE__*/ /\b((?:0[1-46-9]\d{3})|(?:[1-357-9]\d{4})|(?:[4][0-24-9]\d{3})|(?:[6][013-9]\d{3}))\b/,
    /* CA */ /*#__PURE__*/ /^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]) {0,1}(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/,
    /* FR */ /*#__PURE__*/ /^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$/,
    /* IT */ /*#__PURE__*/ /^(V-|I-)?[0-9]{5}$/,
    /* AU */ /*#__PURE__*/ /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/,
    /* NL */ /*#__PURE__*/ /^[1-9][0-9]{3}\s?([a-zA-Z]{2})?$/,
    /* ES */ /*#__PURE__*/ /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/,
    /* DK */ /*#__PURE__*/ /^([D|d][K|k]( |-))?[1-9]{1}[0-9]{3}$/,
    /* SE */ /*#__PURE__*/ /^(s-|S-){0,1}[0-9]{3}\s?[0-9]{2}$/,
    /* BE */ /*#__PURE__*/ /^[1-9]{1}[0-9]{3}$/,
    /* IN */ /*#__PURE__*/ /^\d{6}$/,
    /* AT */ /*#__PURE__*/ /^\d{4}$/,
    /* PT */ /*#__PURE__*/ /^\d{4}([\-]\d{3})?$/,
    /* CH */ /*#__PURE__*/ /^\d{4}$/,
    /* LU */ /*#__PURE__*/ /^\d{4}$/,
    /* IR */ /*#__PURE__*/ /^[1,3-9]{10}$/,
    /* JP */ /*#__PURE__*/ /^\d{3}-\d{4}$/,
    /* UA */ /*#__PURE__*/ /^\d{5}$/,
];
function _testPostalCode(postalCode) {
    let result = false;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < POSTAL_CODE_REGEXES.length; i++) {
        const regex = POSTAL_CODE_REGEXES[i];
        if (regex.test(postalCode)) {
            result = true;
            break;
        }
    }
    return result;
}
exports.GraphQLPostalCode = new graphql_1.GraphQLScalarType({
    name: 'PostalCode',
    description: 'A field whose value conforms to the standard postal code formats for United States, United Kingdom, Germany, Canada, France, Italy, Australia, Netherlands, Spain, Denmark, Sweden, Belgium, India, Austria, Portugal, Switzerland or Luxembourg.',
    serialize(value) {
        if (typeof value !== 'string') {
            throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`);
        }
        if (!_testPostalCode(value)) {
            throw (0, error_js_1.createGraphQLError)(`Value is not a valid postal code: ${value}`);
        }
        return value;
    },
    parseValue(value) {
        if (typeof value !== 'string') {
            throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`);
        }
        if (!_testPostalCode(value)) {
            throw (0, error_js_1.createGraphQLError)(`Value is not a valid postal code: ${value}`);
        }
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as postal codes but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        if (!_testPostalCode(ast.value)) {
            throw (0, error_js_1.createGraphQLError)(`Value is not a valid postal code: ${ast.value}`, { nodes: ast });
        }
        return ast.value;
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'PostalCode',
            oneOf: POSTAL_CODE_REGEXES.map(regex => ({
                type: 'string',
                pattern: regex.source,
            })),
        },
    },
});
