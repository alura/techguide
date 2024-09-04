"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecord = exports.assertIsRef = exports.isRef = void 0;
function isRef(maybeRef) {
    return !!(maybeRef && typeof maybeRef === 'object' && '$ref' in maybeRef);
}
exports.isRef = isRef;
function assertIsRef(maybeRef, message) {
    if (!isRef(maybeRef)) {
        throw new Error(message || `Expected ${maybeRef} to be a valid Ref.`);
    }
}
exports.assertIsRef = assertIsRef;
function isRecord(obj) {
    return typeof obj === 'object' && obj !== null;
}
exports.isRecord = isRecord;
