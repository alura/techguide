"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatcher = void 0;
class Dispatcher {
    constructor(targets) {
        this.targets = targets;
    }
    callTargets(methodName, ...args) {
        return this.targets.map((target) => {
            const method = target[methodName];
            if (typeof method === 'function') {
                return method.apply(target, args);
            }
        });
    }
    hasHook(methodName) {
        return this.targets.some((target) => typeof target[methodName] === 'function');
    }
    async invokeHook(methodName, ...args) {
        return Promise.all(this.callTargets(methodName, ...args));
    }
    async invokeHooksUntilNonNull(methodName, ...args) {
        for (const target of this.targets) {
            const method = target[methodName];
            if (typeof method !== 'function') {
                continue;
            }
            const value = await method.apply(target, args);
            if (value !== null) {
                return value;
            }
        }
        return null;
    }
    async invokeDidStartHook(methodName, ...args) {
        const hookReturnValues = await Promise.all(this.callTargets(methodName, ...args));
        const didEndHooks = hookReturnValues.filter((hook) => !!hook);
        didEndHooks.reverse();
        return async (...args) => {
            await Promise.all(didEndHooks.map((hook) => hook(...args)));
        };
    }
    invokeSyncDidStartHook(methodName, ...args) {
        const didEndHooks = [];
        for (const target of this.targets) {
            const method = target[methodName];
            if (typeof method === 'function') {
                const didEndHook = method.apply(target, args);
                if (didEndHook) {
                    didEndHooks.push(didEndHook);
                }
            }
        }
        didEndHooks.reverse();
        return (...args) => {
            for (const didEndHook of didEndHooks) {
                didEndHook(...args);
            }
        };
    }
}
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=dispatcher.js.map