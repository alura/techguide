function isHeadersLike(headers) {
    return headers && typeof headers.get === 'function';
}
export class PonyfillHeaders {
    constructor(headersInit) {
        this.headersInit = headersInit;
        this.map = new Map();
        this.mapIsBuilt = false;
        this.objectNormalizedKeysOfHeadersInit = [];
        this.objectOriginalKeysOfHeadersInit = [];
    }
    // perf: we don't need to build `this.map` for Requests, as we can access the headers directly
    _get(key) {
        // If the map is built, reuse it
        if (this.mapIsBuilt) {
            return this.map.get(key.toLowerCase()) || null;
        }
        // If the map is not built, try to get the value from the this.headersInit
        if (this.headersInit == null) {
            return null;
        }
        const normalized = key.toLowerCase();
        if (Array.isArray(this.headersInit)) {
            return this.headersInit.find(header => header[0] === normalized);
        }
        else if (isHeadersLike(this.headersInit)) {
            return this.headersInit.get(normalized);
        }
        else {
            const initValue = this.headersInit[key] || this.headersInit[normalized];
            if (initValue != null) {
                return initValue;
            }
            if (!this.objectNormalizedKeysOfHeadersInit.length) {
                Object.keys(this.headersInit).forEach(k => {
                    this.objectOriginalKeysOfHeadersInit.push(k);
                    this.objectNormalizedKeysOfHeadersInit.push(k.toLowerCase());
                });
            }
            const index = this.objectNormalizedKeysOfHeadersInit.indexOf(normalized);
            if (index === -1) {
                return null;
            }
            const originalKey = this.objectOriginalKeysOfHeadersInit[index];
            return this.headersInit[originalKey];
        }
    }
    // perf: Build the map of headers lazily, only when we need to access all headers or write to it.
    // I could do a getter here, but I'm too lazy to type `getter`.
    getMap() {
        if (this.mapIsBuilt) {
            return this.map;
        }
        if (this.headersInit != null) {
            if (Array.isArray(this.headersInit)) {
                this.map = new Map(this.headersInit);
            }
            else if (isHeadersLike(this.headersInit)) {
                this.headersInit.forEach((value, key) => {
                    this.map.set(key, value);
                });
            }
            else {
                for (const initKey in this.headersInit) {
                    const initValue = this.headersInit[initKey];
                    if (initValue != null) {
                        const normalizedValue = Array.isArray(initValue) ? initValue.join(', ') : initValue;
                        const normalizedKey = initKey.toLowerCase();
                        this.map.set(normalizedKey, normalizedValue);
                    }
                }
            }
        }
        this.mapIsBuilt = true;
        return this.map;
    }
    append(name, value) {
        const key = name.toLowerCase();
        const existingValue = this.getMap().get(key);
        const finalValue = existingValue ? `${existingValue}, ${value}` : value;
        this.getMap().set(key, finalValue);
    }
    get(name) {
        const key = name.toLowerCase();
        const value = this._get(key);
        if (value == null) {
            return null;
        }
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return value;
    }
    has(name) {
        const key = name.toLowerCase();
        return !!this._get(key); // we might need to check if header exists and not just check if it's not nullable
    }
    set(name, value) {
        const key = name.toLowerCase();
        this.getMap().set(key, value);
    }
    delete(name) {
        const key = name.toLowerCase();
        this.getMap().delete(key);
    }
    forEach(callback) {
        this.getMap().forEach((value, key) => {
            callback(value, key, this);
        });
    }
    keys() {
        return this.getMap().keys();
    }
    values() {
        return this.getMap().values();
    }
    entries() {
        return this.getMap().entries();
    }
    [Symbol.iterator]() {
        return this.getMap().entries();
    }
}
