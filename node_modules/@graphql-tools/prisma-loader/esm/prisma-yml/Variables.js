import _ from 'lodash';
import { Output } from './Output.js';
export class Variables {
    constructor(fileName, options = {}, out = new Output(), envVars) {
        this.overwriteSyntax = /,/g;
        this.envRefSyntax = /^env:/g;
        this.selfRefSyntax = /^self:/g;
        this.stringRefSyntax = /('.*')|(".*")/g;
        this.optRefSyntax = /^opt:/g;
        // eslint-disable-next-line
        this.variableSyntax = new RegExp(
        // eslint-disable-next-line
        '\\${([ ~:a-zA-Z0-9._\'",\\-\\/\\(\\)]+?)}', 'g');
        this.out = out;
        this.fileName = fileName;
        this.options = options;
        this.envVars = envVars || process.env;
    }
    populateJson(json) {
        this.json = json;
        return this.populateObject(this.json).then(() => {
            return Promise.resolve(this.json);
        });
    }
    populateObject(objectToPopulate) {
        const populateAll = [];
        const deepMapValues = (object, callback, propertyPath) => {
            const deepMapValuesIteratee = (value, key) => deepMapValues(value, callback, propertyPath ? propertyPath.concat(key) : [key]);
            if (_.isArray(object)) {
                return _.map(object, deepMapValuesIteratee);
            }
            else if (_.isObject(object) && !_.isDate(object) && !_.isFunction(object)) {
                return _.extend({}, object, _.mapValues(object, deepMapValuesIteratee));
            }
            return callback(object, propertyPath);
        };
        deepMapValues(objectToPopulate, (property, propertyPath) => {
            if (typeof property === 'string') {
                const populateSingleProperty = this.populateProperty(property, true).then((newProperty) => _.set(objectToPopulate, propertyPath, newProperty));
                populateAll.push(populateSingleProperty);
            }
        });
        return Promise.all(populateAll).then(() => objectToPopulate);
    }
    populateProperty(propertyParam, populateInPlace) {
        let property = populateInPlace ? propertyParam : _.cloneDeep(propertyParam);
        const allValuesToPopulate = [];
        let warned = false;
        if (typeof property === 'string' && property.match(this.variableSyntax)) {
            const matchedStrings = property.match(this.variableSyntax);
            if (matchedStrings) {
                for (const matchedString of matchedStrings) {
                    const variableString = matchedString
                        .replace(this.variableSyntax, (_, varName) => varName.trim())
                        .replace(/\s/g, '');
                    let singleValueToPopulate = null;
                    if (variableString.match(this.overwriteSyntax)) {
                        singleValueToPopulate = this.overwrite(variableString);
                    }
                    else {
                        singleValueToPopulate = this.getValueFromSource(variableString).then((valueToPopulate) => {
                            if (typeof valueToPopulate === 'object') {
                                return this.populateObject(valueToPopulate);
                            }
                            return valueToPopulate;
                        });
                    }
                    singleValueToPopulate = singleValueToPopulate.then(valueToPopulate => {
                        if (this.warnIfNotFound(variableString, valueToPopulate)) {
                            warned = true;
                        }
                        return this.populateVariable(property, matchedString, valueToPopulate).then((newProperty) => {
                            property = newProperty;
                            return Promise.resolve(property);
                        });
                    });
                    allValuesToPopulate.push(singleValueToPopulate);
                }
            }
            return Promise.all(allValuesToPopulate).then(() => {
                if (property !== this.json && !warned) {
                    return this.populateProperty(property);
                }
                return Promise.resolve(property);
            });
        }
        return Promise.resolve(property);
    }
    populateVariable(propertyParam, matchedString, valueToPopulate) {
        let property = propertyParam;
        if (typeof valueToPopulate === 'string') {
            // TODO: Replace `split` and `join` with `replaceAll` once Node v14 is no longer supported
            property = property.split(matchedString).join(valueToPopulate);
        }
        else {
            if (property !== matchedString) {
                if (typeof valueToPopulate === 'number') {
                    // TODO: Replace `split` and `join` with `replaceAll` once Node v14 is no longer supported
                    property = property.split(matchedString).join(String(valueToPopulate));
                }
                else {
                    const errorMessage = [
                        'Trying to populate non string value into',
                        ` a string for variable ${matchedString}.`,
                        ' Please make sure the value of the property is a string.',
                    ].join('');
                    this.out.warn(this.out.getErrorPrefix(this.fileName, 'warning') + errorMessage);
                }
                return Promise.resolve(property);
            }
            property = valueToPopulate;
        }
        return Promise.resolve(property);
    }
    overwrite(variableStringsString) {
        let finalValue;
        const variableStringsArray = variableStringsString.split(',');
        const allValuesFromSource = variableStringsArray.map((variableString) => this.getValueFromSource(variableString));
        return Promise.all(allValuesFromSource).then((valuesFromSources) => {
            valuesFromSources.find((valueFromSource) => {
                finalValue = valueFromSource;
                return (finalValue !== null &&
                    typeof finalValue !== 'undefined' &&
                    !(typeof finalValue === 'object' && _.isEmpty(finalValue)));
            });
            return Promise.resolve(finalValue);
        });
    }
    getValueFromSource(variableString) {
        if (variableString.match(this.envRefSyntax)) {
            return this.getValueFromEnv(variableString);
        }
        else if (variableString.match(this.optRefSyntax)) {
            return this.getValueFromOptions(variableString);
        }
        else if (variableString.match(this.selfRefSyntax)) {
            return this.getValueFromSelf(variableString);
        }
        else if (variableString.match(this.stringRefSyntax)) {
            return this.getValueFromString(variableString);
        }
        const errorMessage = [
            `Invalid variable reference syntax for variable ${variableString}.`,
            ' You can only reference env vars, options, & files.',
            ' You can check our docs for more info.',
        ].join('');
        this.out.warn(this.out.getErrorPrefix(this.fileName, 'warning') + errorMessage);
        return Promise.resolve();
    }
    getValueFromEnv(variableString) {
        const requestedEnvVar = variableString.split(':')[1];
        const valueToPopulate = requestedEnvVar !== '' || '' in this.envVars ? this.envVars[requestedEnvVar] : this.envVars;
        return Promise.resolve(valueToPopulate);
    }
    getValueFromString(variableString) {
        const valueToPopulate = variableString.replace(/^['"]|['"]$/g, '');
        return Promise.resolve(valueToPopulate);
    }
    getValueFromOptions(variableString) {
        const requestedOption = variableString.split(':')[1];
        const valueToPopulate = requestedOption !== '' || '' in this.options ? this.options[requestedOption] : this.options;
        return Promise.resolve(valueToPopulate);
    }
    getValueFromSelf(variableString) {
        const valueToPopulate = this.json;
        const deepProperties = variableString.split(':')[1].split('.');
        return this.getDeepValue(deepProperties, valueToPopulate);
    }
    getDeepValue(deepProperties, valueToPopulate) {
        return promiseReduce(deepProperties, (computedValueToPopulateParam, subProperty) => {
            let computedValueToPopulate = computedValueToPopulateParam;
            if (typeof computedValueToPopulate === 'undefined') {
                computedValueToPopulate = {};
            }
            else if (subProperty !== '' || '' in computedValueToPopulate) {
                computedValueToPopulate = computedValueToPopulate[subProperty];
            }
            if (typeof computedValueToPopulate === 'string' && computedValueToPopulate.match(this.variableSyntax)) {
                return this.populateProperty(computedValueToPopulate);
            }
            return Promise.resolve(computedValueToPopulate);
        }, valueToPopulate);
    }
    warnIfNotFound(variableString, valueToPopulate) {
        if (valueToPopulate === null ||
            typeof valueToPopulate === 'undefined' ||
            (typeof valueToPopulate === 'object' && _.isEmpty(valueToPopulate))) {
            let varType;
            if (variableString.match(this.envRefSyntax)) {
                varType = 'environment variable';
            }
            else if (variableString.match(this.optRefSyntax)) {
                varType = 'option';
            }
            else if (variableString.match(this.selfRefSyntax)) {
                varType = 'self reference';
            }
            this.out.warn(this.out.getErrorPrefix(this.fileName, 'warning') +
                `A valid ${varType} to satisfy the declaration '${variableString}' could not be found.`);
            return true;
        }
        return false;
    }
}
function promiseReduce(values, callback, initialValue) {
    return values.reduce((previous, value) => isPromise(previous) ? previous.then(resolved => callback(resolved, value)) : callback(previous, value), initialValue);
}
function isPromise(value) {
    return typeof (value === null || value === void 0 ? void 0 : value.then) === 'function';
}
