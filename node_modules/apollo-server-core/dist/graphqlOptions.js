"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGraphqlOptions = void 0;
async function resolveGraphqlOptions(options, ...args) {
    if (typeof options === 'function') {
        return await options(...args);
    }
    else {
        return options;
    }
}
exports.resolveGraphqlOptions = resolveGraphqlOptions;
//# sourceMappingURL=graphqlOptions.js.map