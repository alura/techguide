import FastQuerystring from 'fast-querystring';
export class PonyfillURLSearchParams {
    constructor(init) {
        if (init) {
            if (typeof init === 'string') {
                this.params = FastQuerystring.parse(init);
            }
            else if (Array.isArray(init)) {
                this.params = {};
                for (const [key, value] of init) {
                    this.params[key] = value;
                }
            }
            else if ('entries' in init) {
                this.params = {};
                for (const [key, value] of init.entries()) {
                    this.params[key] = value;
                }
            }
            else {
                this.params = init;
            }
        }
        else {
            this.params = {};
        }
    }
    append(name, value) {
        const existingValue = this.params[name];
        const finalValue = existingValue ? `${existingValue},${value}` : value;
        this.params[name] = finalValue;
    }
    delete(name) {
        delete this.params[name];
    }
    get(name) {
        const value = this.params[name];
        if (Array.isArray(value)) {
            return value[0] || null;
        }
        return value || null;
    }
    getAll(name) {
        const value = this.params[name];
        if (!Array.isArray(value)) {
            return value ? [value] : [];
        }
        return value;
    }
    has(name) {
        return name in this.params;
    }
    set(name, value) {
        this.params[name] = value;
    }
    sort() {
        const sortedKeys = Object.keys(this.params).sort();
        const sortedParams = {};
        for (const key of sortedKeys) {
            sortedParams[key] = this.params[key];
        }
        this.params = sortedParams;
    }
    toString() {
        return FastQuerystring.stringify(this.params);
    }
    *keys() {
        for (const key in this.params) {
            yield key;
        }
    }
    *entries() {
        for (const key of this.keys()) {
            const value = this.params[key];
            if (Array.isArray(value)) {
                for (const item of value) {
                    yield [key, item];
                }
            }
            else {
                yield [key, value];
            }
        }
    }
    *values() {
        for (const [, value] of this) {
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    forEach(callback) {
        for (const [key, value] of this) {
            callback(value, key, this);
        }
    }
    get size() {
        return Object.keys(this.params).length;
    }
}
