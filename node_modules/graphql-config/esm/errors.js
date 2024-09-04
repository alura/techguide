// eslint-disable-next-line @typescript-eslint/ban-types -- TODO: fix lint error
function ExtendableBuiltin(cls) {
    function ExtendableBuiltin(...args) {
        cls.apply(this, args);
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype);
    Object.setPrototypeOf(ExtendableBuiltin, cls);
    return ExtendableBuiltin;
}
export function composeMessage(...lines) {
    return lines.join('\n');
}
export class ConfigNotFoundError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
export class ConfigEmptyError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
// TODO: remove in v5
export class ConfigInvalidError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
export class ProjectNotFoundError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
// TODO: remove in v5
export class LoadersMissingError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
// TODO: remove in v5
export class LoaderNoResultError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
export class ExtensionMissingError extends ExtendableBuiltin(Error) {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}
