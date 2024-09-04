"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionMissingError = exports.LoaderNoResultError = exports.LoadersMissingError = exports.ProjectNotFoundError = exports.ConfigInvalidError = exports.ConfigEmptyError = exports.ConfigNotFoundError = exports.composeMessage = void 0;
// eslint-disable-next-line @typescript-eslint/ban-types -- TODO: fix lint error
function ExtendableBuiltin(cls) {
    function ExtendableBuiltin(...args) {
        cls.apply(this, args);
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype);
    Object.setPrototypeOf(ExtendableBuiltin, cls);
    return ExtendableBuiltin;
}
function composeMessage(...lines) {
    return lines.join('\n');
}
exports.composeMessage = composeMessage;
class ConfigNotFoundError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.ConfigNotFoundError = ConfigNotFoundError;
class ConfigEmptyError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.ConfigEmptyError = ConfigEmptyError;
// TODO: remove in v5
class ConfigInvalidError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.ConfigInvalidError = ConfigInvalidError;
class ProjectNotFoundError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.ProjectNotFoundError = ProjectNotFoundError;
// TODO: remove in v5
class LoadersMissingError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.LoadersMissingError = LoadersMissingError;
// TODO: remove in v5
class LoaderNoResultError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.LoaderNoResultError = LoaderNoResultError;
class ExtensionMissingError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.ExtensionMissingError = ExtensionMissingError;
