import { getRootTypeNames } from '@graphql-tools/utils';
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line eqeqeq
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export const randomListLength = () => {
    // Mocking has always returned list of length 2 by default
    // return 1 + Math.round(Math.random() * 10)
    return 2;
};
export const takeRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
export function makeRef(typeName, key) {
    return { $ref: { key, typeName } };
}
export function isObject(thing) {
    return thing === Object(thing) && !Array.isArray(thing);
}
export function copyOwnPropsIfNotPresent(target, source) {
    for (const prop of Object.getOwnPropertyNames(source)) {
        if (!Object.getOwnPropertyDescriptor(target, prop)) {
            const propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop);
            Object.defineProperty(target, prop, propertyDescriptor == null ? {} : propertyDescriptor);
        }
    }
}
export function copyOwnProps(target, ...sources) {
    for (const source of sources) {
        let chain = source;
        while (chain != null) {
            copyOwnPropsIfNotPresent(target, chain);
            chain = Object.getPrototypeOf(chain);
        }
    }
    return target;
}
export const isRootType = (type, schema) => {
    const rootTypeNames = getRootTypeNames(schema);
    return rootTypeNames.has(type.name);
};
