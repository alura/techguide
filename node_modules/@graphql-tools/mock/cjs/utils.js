"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRootType = exports.copyOwnProps = exports.copyOwnPropsIfNotPresent = exports.isObject = exports.makeRef = exports.takeRandom = exports.randomListLength = exports.uuidv4 = void 0;
const utils_1 = require("@graphql-tools/utils");
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line eqeqeq
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.uuidv4 = uuidv4;
const randomListLength = () => {
    // Mocking has always returned list of length 2 by default
    // return 1 + Math.round(Math.random() * 10)
    return 2;
};
exports.randomListLength = randomListLength;
const takeRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
exports.takeRandom = takeRandom;
function makeRef(typeName, key) {
    return { $ref: { key, typeName } };
}
exports.makeRef = makeRef;
function isObject(thing) {
    return thing === Object(thing) && !Array.isArray(thing);
}
exports.isObject = isObject;
function copyOwnPropsIfNotPresent(target, source) {
    for (const prop of Object.getOwnPropertyNames(source)) {
        if (!Object.getOwnPropertyDescriptor(target, prop)) {
            const propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop);
            Object.defineProperty(target, prop, propertyDescriptor == null ? {} : propertyDescriptor);
        }
    }
}
exports.copyOwnPropsIfNotPresent = copyOwnPropsIfNotPresent;
function copyOwnProps(target, ...sources) {
    for (const source of sources) {
        let chain = source;
        while (chain != null) {
            copyOwnPropsIfNotPresent(target, chain);
            chain = Object.getPrototypeOf(chain);
        }
    }
    return target;
}
exports.copyOwnProps = copyOwnProps;
const isRootType = (type, schema) => {
    const rootTypeNames = (0, utils_1.getRootTypeNames)(schema);
    return rootTypeNames.has(type.name);
};
exports.isRootType = isRootType;
