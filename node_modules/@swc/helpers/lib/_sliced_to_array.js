"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _slicedToArray;
var _arrayWithHolesMjs = _interopRequireDefault(require("./_array_with_holes.js"));
var _iterableToArrayMjs = _interopRequireDefault(require("./_iterable_to_array.js"));
var _nonIterableRestMjs = _interopRequireDefault(require("./_non_iterable_rest.js"));
var _unsupportedIterableToArrayMjs = _interopRequireDefault(require("./_unsupported_iterable_to_array.js"));
function _slicedToArray(arr, i) {
    return (0, _arrayWithHolesMjs).default(arr) || (0, _iterableToArrayMjs).default(arr, i) || (0, _unsupportedIterableToArrayMjs).default(arr, i) || (0, _nonIterableRestMjs).default();
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
