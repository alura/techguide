"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsAreMissesCache = void 0;
class ErrorsAreMissesCache {
    constructor(cache, logger) {
        this.cache = cache;
        this.logger = logger;
    }
    async get(key) {
        try {
            return await this.cache.get(key);
        }
        catch (e) {
            if (this.logger) {
                if (e instanceof Error) {
                    this.logger.error(e.message);
                }
                else {
                    this.logger.error(e);
                }
            }
            return undefined;
        }
    }
    async set(key, value, opts) {
        return this.cache.set(key, value, opts);
    }
    async delete(key) {
        return this.cache.delete(key);
    }
}
exports.ErrorsAreMissesCache = ErrorsAreMissesCache;
//# sourceMappingURL=ErrorsAreMissesCache.js.map