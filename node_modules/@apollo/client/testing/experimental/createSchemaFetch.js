import { __awaiter, __generator } from "tslib";
import { execute, validate } from "graphql";
import { ApolloError, gql } from "../../core/index.js";
import { withCleanup } from "../internal/index.js";
import { wait } from "../core/wait.js";
/**
 * A function that accepts a static `schema` and a `mockFetchOpts` object and
 * returns a disposable object with `mock` and `restore` functions.
 *
 * The `mock` function is a mock fetch function that is set on the global
 * `window` object. This function intercepts any fetch requests and
 * returns a response by executing the operation against the provided schema.
 *
 * The `restore` function is a cleanup function that will restore the previous
 * `fetch`. It is automatically called if the function's return value is
 * declared with `using`. If your environment does not support the language
 * feature `using`, you should manually invoke the `restore` function.
 *
 * @param schema - A `GraphQLSchema`.
 * @param mockFetchOpts - Configuration options.
 * @returns An object with both `mock` and `restore` functions.
 *
 * @example
 * ```js
 * using _fetch = createSchemaFetch(schema); // automatically restores fetch after exiting the block
 *
 * const { restore } = createSchemaFetch(schema);
 * restore(); // manually restore fetch if `using` is not supported
 * ```
 * @since 3.10.0
 * @alpha
 */
var createSchemaFetch = function (schema, mockFetchOpts) {
    var _a, _b, _c, _d;
    if (mockFetchOpts === void 0) { mockFetchOpts = { validate: true }; }
    var prevFetch = window.fetch;
    var delayMin = (_b = (_a = mockFetchOpts.delay) === null || _a === void 0 ? void 0 : _a.min) !== null && _b !== void 0 ? _b : 3;
    var delayMax = (_d = (_c = mockFetchOpts.delay) === null || _c === void 0 ? void 0 : _c.max) !== null && _d !== void 0 ? _d : delayMin + 2;
    if (delayMin > delayMax) {
        throw new Error("Please configure a minimum delay that is less than the maximum delay. The default minimum delay is 3ms.");
    }
    var mockFetch = function (_uri, options) { return __awaiter(void 0, void 0, void 0, function () {
        var randomDelay, body, document, validationErrors, result, stringifiedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(delayMin > 0)) return [3 /*break*/, 2];
                    randomDelay = Math.random() * (delayMax - delayMin) + delayMin;
                    return [4 /*yield*/, wait(randomDelay)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    body = JSON.parse(options.body);
                    document = gql(body.query);
                    if (mockFetchOpts.validate) {
                        validationErrors = [];
                        try {
                            validationErrors = validate(schema, document);
                        }
                        catch (e) {
                            validationErrors = [
                                new ApolloError({ graphQLErrors: [e] }),
                            ];
                        }
                        if ((validationErrors === null || validationErrors === void 0 ? void 0 : validationErrors.length) > 0) {
                            return [2 /*return*/, new Response(JSON.stringify({ errors: validationErrors }))];
                        }
                    }
                    return [4 /*yield*/, execute({
                            schema: schema,
                            document: document,
                            variableValues: body.variables,
                            operationName: body.operationName,
                        })];
                case 3:
                    result = _a.sent();
                    stringifiedResult = JSON.stringify(result);
                    return [2 /*return*/, new Response(stringifiedResult)];
            }
        });
    }); };
    function mockGlobal() {
        window.fetch = mockFetch;
        var restore = function () {
            if (window.fetch === mockFetch) {
                window.fetch = prevFetch;
            }
        };
        return withCleanup({ restore: restore }, restore);
    }
    return Object.assign(mockFetch, {
        mockGlobal: mockGlobal,
        // if https://github.com/rbuckton/proposal-using-enforcement lands
        // [Symbol.enter]: mockGlobal
    });
};
export { createSchemaFetch };
//# sourceMappingURL=createSchemaFetch.js.map