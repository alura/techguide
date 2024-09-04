// @ts-check

if (0) {
  // Trick cjs-module-lexer into adding named exports for all React exports.
  // (if imported with `import()`, they will appear in `.default` as well.)
  // This way, cjs-module-lexer will let all of react's (named) exports through unchanged.
  module.exports = require("react");
}

// missing functions
module.exports.createContext = polyfillMissingFn("createContext");
// @ts-ignore
module.exports.createFactory = polyfillMissingFn("createFactory");
module.exports.act = polyfillMissingFn("act");
// @ts-ignore
module.exports.unstable_act = polyfillMissingFn("unstable_act");
module.exports.unstable_useCacheRefresh = polyfillMissingFn("unstable_useCacheRefresh");
module.exports.useContext = polyfillMissingFn("useContext");
module.exports.useDeferredValue = polyfillMissingFn("useDeferredValue");
module.exports.useEffect = polyfillMissingFn("useEffect");
module.exports.useImperativeHandle = polyfillMissingFn("useImperativeHandle");
module.exports.useInsertionEffect = polyfillMissingFn("useInsertionEffect");
module.exports.useLayoutEffect = polyfillMissingFn("useLayoutEffect");
module.exports.useReducer = polyfillMissingFn("useReducer");
module.exports.useRef = polyfillMissingFn("useRef");
module.exports.useState = polyfillMissingFn("useState");
module.exports.useSyncExternalStore = polyfillMissingFn("useSyncExternalStore");
module.exports.useTransition = polyfillMissingFn("useTransition");
module.exports.useOptimistic = polyfillMissingFn("useOptimistic");
// We don't want bundlers to error when they encounter usage of any of these exports.
// It's up to the package author to ensure that if they access React internals,
// they do so in a safe way that won't break if React changes how they use these internals.
// (e.g. only access them in development, and only in an optional way that won't
// break if internals are not there or do not have the expected structure)
// @ts-ignore
module.exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = undefined;
// @ts-ignore
module.exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = undefined;
// @ts-ignore
module.exports.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = undefined;

// missing classes
module.exports.Component = polyfillMissingClass("Component");
module.exports.PureComponent = polyfillMissingClass("PureComponent");

module.exports.createContext = function unsupportedCreateContext() {
  return {
    Provider: function throwNoContext() {
      throw new Error("Context is not available in this environment.");
    },
    Consumer: function throwNoContext() {
      throw new Error("Context is not available in this environment.");
    },
  };
};
// @ts-ignore
module.exports.createFactory = function unsupportedCreateFactory() {
  return function throwNoCreateFactory() {
    throw new Error("createFactory is not available in this environment.");
  };
};

// Here we actually pull in the React library and add everything
// it exports to our own `module.exports`.
// If React suddenly were to add one of the above "polyfilled" exports,
// the React version would overwrite our version, so this should be
// future-proof.
Object.assign(module.exports, require("react"));

function polyfillMissingFn(exportName) {
  const name = "nonExistingExport__" + exportName;
  return /** @type {any} */ (
    {
      [name]() {
        throw new Error(`React functionality '${exportName}' is not available in this environment.`);
      },
    }[name]
  );
}

function polyfillMissingClass(exportName) {
  return /** @type {any} */ (
    class NonExistentClass {
      constructor() {
        throw new Error(`React class '${exportName}' is not available in this environment.`);
      }
    }
  );
}
