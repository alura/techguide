"use strict";
if (0) {
  // Trick cjs-module-lexer into adding named exports for all React exports.
  // (if imported with `import()`, they will appear in `.default` as well.)
  // This way, cjs-module-lexer will let all of react's (named) exports through unchanged.
  module.exports = require("react");
}
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
// Here we actually pull in the React library and add everything
// it exports to our own `module.exports`.
// If React suddenly were to add one of the above "polyfilled" exports,
// the React version would overwrite our version, so this should be
// future-proof.
Object.assign(module.exports, require("react"));
