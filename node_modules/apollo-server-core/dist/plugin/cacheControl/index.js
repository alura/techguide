"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginCacheControlDisabled = exports.ApolloServerPluginCacheControl = void 0;
const graphql_1 = require("graphql");
const cachePolicy_1 = require("../../cachePolicy");
const lru_cache_1 = __importDefault(require("lru-cache"));
function ApolloServerPluginCacheControl(options = Object.create(null)) {
    const typeAnnotationCache = new lru_cache_1.default();
    const fieldAnnotationCache = new lru_cache_1.default();
    function memoizedCacheAnnotationFromType(t) {
        const existing = typeAnnotationCache.get(t);
        if (existing) {
            return existing;
        }
        const annotation = cacheAnnotationFromType(t);
        typeAnnotationCache.set(t, annotation);
        return annotation;
    }
    function memoizedCacheAnnotationFromField(field) {
        const existing = fieldAnnotationCache.get(field);
        if (existing) {
            return existing;
        }
        const annotation = cacheAnnotationFromField(field);
        fieldAnnotationCache.set(field, annotation);
        return annotation;
    }
    return {
        __internal_plugin_id__() {
            return 'CacheControl';
        },
        async serverWillStart({ schema }) {
            typeAnnotationCache.max = Object.values(schema.getTypeMap()).filter(graphql_1.isCompositeType).length;
            fieldAnnotationCache.max =
                Object.values(schema.getTypeMap())
                    .filter(graphql_1.isObjectType)
                    .flatMap((t) => Object.values(t.getFields())).length +
                    Object.values(schema.getTypeMap())
                        .filter(graphql_1.isInterfaceType)
                        .flatMap((t) => Object.values(t.getFields())).length;
            return undefined;
        },
        async requestDidStart(requestContext) {
            var _a, _b;
            const defaultMaxAge = (_a = options.defaultMaxAge) !== null && _a !== void 0 ? _a : 0;
            const calculateHttpHeaders = (_b = options.calculateHttpHeaders) !== null && _b !== void 0 ? _b : true;
            const { __testing__cacheHints } = options;
            return {
                async executionDidStart() {
                    if (isRestricted(requestContext.overallCachePolicy)) {
                        const fakeFieldPolicy = (0, cachePolicy_1.newCachePolicy)();
                        return {
                            willResolveField({ info }) {
                                info.cacheControl = {
                                    setCacheHint: (dynamicHint) => {
                                        fakeFieldPolicy.replace(dynamicHint);
                                    },
                                    cacheHint: fakeFieldPolicy,
                                    cacheHintFromType: memoizedCacheAnnotationFromType,
                                };
                            },
                        };
                    }
                    return {
                        willResolveField({ info }) {
                            const fieldPolicy = (0, cachePolicy_1.newCachePolicy)();
                            let inheritMaxAge = false;
                            const targetType = (0, graphql_1.getNamedType)(info.returnType);
                            if ((0, graphql_1.isCompositeType)(targetType)) {
                                const typeAnnotation = memoizedCacheAnnotationFromType(targetType);
                                fieldPolicy.replace(typeAnnotation);
                                inheritMaxAge = !!typeAnnotation.inheritMaxAge;
                            }
                            const fieldAnnotation = memoizedCacheAnnotationFromField(info.parentType.getFields()[info.fieldName]);
                            if (fieldAnnotation.inheritMaxAge &&
                                fieldPolicy.maxAge === undefined) {
                                inheritMaxAge = true;
                                if (fieldAnnotation.scope) {
                                    fieldPolicy.replace({ scope: fieldAnnotation.scope });
                                }
                            }
                            else {
                                fieldPolicy.replace(fieldAnnotation);
                            }
                            info.cacheControl = {
                                setCacheHint: (dynamicHint) => {
                                    fieldPolicy.replace(dynamicHint);
                                },
                                cacheHint: fieldPolicy,
                                cacheHintFromType: memoizedCacheAnnotationFromType,
                            };
                            return () => {
                                if (fieldPolicy.maxAge === undefined &&
                                    (((0, graphql_1.isCompositeType)(targetType) && !inheritMaxAge) ||
                                        !info.path.prev)) {
                                    fieldPolicy.restrict({ maxAge: defaultMaxAge });
                                }
                                if (__testing__cacheHints && isRestricted(fieldPolicy)) {
                                    const path = (0, graphql_1.responsePathAsArray)(info.path).join('.');
                                    if (__testing__cacheHints.has(path)) {
                                        throw Error("shouldn't happen: addHint should only be called once per path");
                                    }
                                    __testing__cacheHints.set(path, {
                                        maxAge: fieldPolicy.maxAge,
                                        scope: fieldPolicy.scope,
                                    });
                                }
                                requestContext.overallCachePolicy.restrict(fieldPolicy);
                            };
                        },
                    };
                },
                async willSendResponse(requestContext) {
                    const { response, overallCachePolicy, requestIsBatched } = requestContext;
                    const policyIfCacheable = overallCachePolicy.policyIfCacheable();
                    if (calculateHttpHeaders &&
                        policyIfCacheable &&
                        !response.errors &&
                        response.http &&
                        !requestIsBatched) {
                        response.http.headers.set('Cache-Control', `max-age=${policyIfCacheable.maxAge}, ${policyIfCacheable.scope.toLowerCase()}`);
                    }
                },
            };
        },
    };
}
exports.ApolloServerPluginCacheControl = ApolloServerPluginCacheControl;
function cacheAnnotationFromDirectives(directives) {
    var _a, _b, _c;
    if (!directives)
        return undefined;
    const cacheControlDirective = directives.find((directive) => directive.name.value === 'cacheControl');
    if (!cacheControlDirective)
        return undefined;
    if (!cacheControlDirective.arguments)
        return undefined;
    const maxAgeArgument = cacheControlDirective.arguments.find((argument) => argument.name.value === 'maxAge');
    const scopeArgument = cacheControlDirective.arguments.find((argument) => argument.name.value === 'scope');
    const inheritMaxAgeArgument = cacheControlDirective.arguments.find((argument) => argument.name.value === 'inheritMaxAge');
    const scope = ((_a = scopeArgument === null || scopeArgument === void 0 ? void 0 : scopeArgument.value) === null || _a === void 0 ? void 0 : _a.kind) === 'EnumValue'
        ? scopeArgument.value.value
        : undefined;
    if (((_b = inheritMaxAgeArgument === null || inheritMaxAgeArgument === void 0 ? void 0 : inheritMaxAgeArgument.value) === null || _b === void 0 ? void 0 : _b.kind) === 'BooleanValue' &&
        inheritMaxAgeArgument.value.value) {
        return { inheritMaxAge: true, scope };
    }
    return {
        maxAge: ((_c = maxAgeArgument === null || maxAgeArgument === void 0 ? void 0 : maxAgeArgument.value) === null || _c === void 0 ? void 0 : _c.kind) === 'IntValue'
            ? parseInt(maxAgeArgument.value.value)
            : undefined,
        scope,
    };
}
function cacheAnnotationFromType(t) {
    if (t.astNode) {
        const hint = cacheAnnotationFromDirectives(t.astNode.directives);
        if (hint) {
            return hint;
        }
    }
    if (t.extensionASTNodes) {
        for (const node of t.extensionASTNodes) {
            const hint = cacheAnnotationFromDirectives(node.directives);
            if (hint) {
                return hint;
            }
        }
    }
    return {};
}
function cacheAnnotationFromField(field) {
    if (field.astNode) {
        const hint = cacheAnnotationFromDirectives(field.astNode.directives);
        if (hint) {
            return hint;
        }
    }
    return {};
}
function isRestricted(hint) {
    return hint.maxAge !== undefined || hint.scope !== undefined;
}
function ApolloServerPluginCacheControlDisabled() {
    return {
        __internal_plugin_id__() {
            return 'CacheControl';
        },
    };
}
exports.ApolloServerPluginCacheControlDisabled = ApolloServerPluginCacheControlDisabled;
//# sourceMappingURL=index.js.map