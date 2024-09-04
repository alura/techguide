"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatApolloErrors = exports.UserInputError = exports.PersistedQueryNotSupportedError = exports.PersistedQueryNotFoundError = exports.ForbiddenError = exports.AuthenticationError = exports.ValidationError = exports.SyntaxError = exports.fromGraphQLError = exports.toApolloError = exports.ApolloError = void 0;
const graphql_1 = require("graphql");
class ApolloError extends Error {
    constructor(message, code, extensions) {
        super(message);
        if (!this.name) {
            Object.defineProperty(this, 'name', { value: 'ApolloError' });
        }
        if (extensions === null || extensions === void 0 ? void 0 : extensions.extensions) {
            throw Error('Pass extensions directly as the third argument of the ApolloError constructor: `new ' +
                'ApolloError(message, code, {myExt: value})`, not `new ApolloError(message, code, ' +
                '{extensions: {myExt: value}})`');
        }
        this.extensions = { ...extensions, code };
    }
    toJSON() {
        return (0, graphql_1.formatError)(toGraphQLError(this));
    }
    toString() {
        return (0, graphql_1.printError)(toGraphQLError(this));
    }
    get [Symbol.toStringTag]() {
        return this.name;
    }
}
exports.ApolloError = ApolloError;
function toGraphQLError(error) {
    return new graphql_1.GraphQLError(error.message, error.nodes, error.source, error.positions, error.path, error.originalError, error.extensions);
}
function enrichError(error, debug = false) {
    var _a, _b, _c;
    const expanded = Object.create(Object.getPrototypeOf(error), {
        name: {
            value: error.name,
        },
        message: {
            value: error.message,
            enumerable: true,
            writable: true,
        },
        locations: {
            value: error.locations || undefined,
            enumerable: true,
        },
        path: {
            value: error.path || undefined,
            enumerable: true,
        },
        nodes: {
            value: error.nodes || undefined,
        },
        source: {
            value: error.source || undefined,
        },
        positions: {
            value: error.positions || undefined,
        },
        originalError: {
            value: error.originalError,
        },
    });
    expanded.extensions = {
        ...error.extensions,
        code: ((_a = error.extensions) === null || _a === void 0 ? void 0 : _a.code) || 'INTERNAL_SERVER_ERROR',
        exception: {
            ...(_b = error.extensions) === null || _b === void 0 ? void 0 : _b.exception,
            ...error.originalError,
        },
    };
    delete expanded.extensions.exception.extensions;
    if (debug && !expanded.extensions.exception.stacktrace) {
        const stack = ((_c = error.originalError) === null || _c === void 0 ? void 0 : _c.stack) || error.stack;
        expanded.extensions.exception.stacktrace = stack === null || stack === void 0 ? void 0 : stack.split('\n');
    }
    if (Object.keys(expanded.extensions.exception).length === 0) {
        delete expanded.extensions.exception;
    }
    return expanded;
}
function toApolloError(error, code = 'INTERNAL_SERVER_ERROR') {
    let err = error;
    if (err.extensions) {
        err.extensions.code = code;
    }
    else {
        err.extensions = { code };
    }
    return err;
}
exports.toApolloError = toApolloError;
function fromGraphQLError(error, options) {
    const copy = (options === null || options === void 0 ? void 0 : options.errorClass)
        ? new options.errorClass(error.message)
        : new ApolloError(error.message);
    Object.entries(error).forEach(([key, value]) => {
        if (key === 'extensions') {
            return;
        }
        copy[key] = value;
    });
    copy.extensions = {
        ...copy.extensions,
        ...error.extensions,
    };
    if (!copy.extensions.code) {
        copy.extensions.code = (options === null || options === void 0 ? void 0 : options.code) || 'INTERNAL_SERVER_ERROR';
    }
    Object.defineProperty(copy, 'originalError', { value: {} });
    Object.getOwnPropertyNames(error).forEach((key) => {
        Object.defineProperty(copy.originalError, key, {
            value: error[key],
        });
    });
    return copy;
}
exports.fromGraphQLError = fromGraphQLError;
class SyntaxError extends ApolloError {
    constructor(message) {
        super(message, 'GRAPHQL_PARSE_FAILED');
        Object.defineProperty(this, 'name', { value: 'SyntaxError' });
    }
}
exports.SyntaxError = SyntaxError;
class ValidationError extends ApolloError {
    constructor(message) {
        super(message, 'GRAPHQL_VALIDATION_FAILED');
        Object.defineProperty(this, 'name', { value: 'ValidationError' });
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends ApolloError {
    constructor(message, extensions) {
        super(message, 'UNAUTHENTICATED', extensions);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
}
exports.AuthenticationError = AuthenticationError;
class ForbiddenError extends ApolloError {
    constructor(message, extensions) {
        super(message, 'FORBIDDEN', extensions);
        Object.defineProperty(this, 'name', { value: 'ForbiddenError' });
    }
}
exports.ForbiddenError = ForbiddenError;
class PersistedQueryNotFoundError extends ApolloError {
    constructor() {
        super('PersistedQueryNotFound', 'PERSISTED_QUERY_NOT_FOUND');
        Object.defineProperty(this, 'name', {
            value: 'PersistedQueryNotFoundError',
        });
    }
}
exports.PersistedQueryNotFoundError = PersistedQueryNotFoundError;
class PersistedQueryNotSupportedError extends ApolloError {
    constructor() {
        super('PersistedQueryNotSupported', 'PERSISTED_QUERY_NOT_SUPPORTED');
        Object.defineProperty(this, 'name', {
            value: 'PersistedQueryNotSupportedError',
        });
    }
}
exports.PersistedQueryNotSupportedError = PersistedQueryNotSupportedError;
class UserInputError extends ApolloError {
    constructor(message, extensions) {
        super(message, 'BAD_USER_INPUT', extensions);
        Object.defineProperty(this, 'name', { value: 'UserInputError' });
    }
}
exports.UserInputError = UserInputError;
function formatApolloErrors(errors, options) {
    if (!options) {
        return errors.map((error) => enrichError(error));
    }
    const { formatter, debug } = options;
    const enrichedErrors = errors.map((error) => enrichError(error, debug));
    const makePrintable = (error) => {
        if (error instanceof Error) {
            const graphQLError = error;
            return {
                message: graphQLError.message,
                ...(graphQLError.locations && { locations: graphQLError.locations }),
                ...(graphQLError.path && { path: graphQLError.path }),
                ...(graphQLError.extensions && { extensions: graphQLError.extensions }),
            };
        }
        return error;
    };
    if (!formatter) {
        return enrichedErrors;
    }
    return enrichedErrors.map((error) => {
        try {
            return makePrintable(formatter(error));
        }
        catch (err) {
            if (debug) {
                return enrichError(err, debug);
            }
            else {
                const newError = fromGraphQLError(new graphql_1.GraphQLError('Internal server error'));
                return enrichError(newError, debug);
            }
        }
    });
}
exports.formatApolloErrors = formatApolloErrors;
//# sourceMappingURL=index.js.map