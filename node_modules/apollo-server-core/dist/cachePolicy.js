"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCachePolicy = void 0;
const apollo_server_types_1 = require("apollo-server-types");
function newCachePolicy() {
    return {
        maxAge: undefined,
        scope: undefined,
        restrict(hint) {
            if (hint.maxAge !== undefined &&
                (this.maxAge === undefined || hint.maxAge < this.maxAge)) {
                this.maxAge = hint.maxAge;
            }
            if (hint.scope !== undefined && this.scope !== apollo_server_types_1.CacheScope.Private) {
                this.scope = hint.scope;
            }
        },
        replace(hint) {
            if (hint.maxAge !== undefined) {
                this.maxAge = hint.maxAge;
            }
            if (hint.scope !== undefined) {
                this.scope = hint.scope;
            }
        },
        policyIfCacheable() {
            var _a;
            if (this.maxAge === undefined || this.maxAge === 0) {
                return null;
            }
            return { maxAge: this.maxAge, scope: (_a = this.scope) !== null && _a !== void 0 ? _a : apollo_server_types_1.CacheScope.Public };
        },
    };
}
exports.newCachePolicy = newCachePolicy;
//# sourceMappingURL=cachePolicy.js.map