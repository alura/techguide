# [4.0.0](https://github.com/blesh/symbol-observable/compare/3.0.0...4.0.0) (2021-04-15)


### Bug Fixes

* If Symbol.for doesn't exist, just use Symbol ([ef81924](https://github.com/blesh/symbol-observable/commit/ef81924c506ba2fcc171a9b9b78a7a290fbff7b2)), closes [#53](https://github.com/blesh/symbol-observable/issues/53)


### Code Refactoring

* Revert to `symbol` from `unique symbol`, the latter caused compatibility issues and provided no real benefit. ([72ce7dc](https://github.com/blesh/symbol-observable/commit/72ce7dcc5d22f8a67ec928b61e879e1ded7a0869))


### BREAKING CHANGES

* Following the advice of the TypeScript team, the type for `Symbol.observable` is reverted back to `symbol` from `unique symbol`. This is to improve compatibility with other libraries using this module. Sincerely sorry for the trashing. Getting the types right for modules is hard. If this continues to cause issues for you, please file an issue with the [TypeScript project](https://github.com/microsoft/typescript).



# [3.0.0](https://github.com/blesh/symbol-observable/compare/2.0.3...3.0.0) (2020-11-02)


### Bug Fixes

* **TypeScript:** `Symbol.observable` is now `unique symbol`. ([2ef1476](https://github.com/blesh/symbol-observable/commit/2ef147644cf78538b28c3fd9e66a3b8d569a1978)), closes [#41](https://github.com/blesh/symbol-observable/issues/41)
* **TypeScript:** `Symbol[Symbol.observable]` is no longer incorrectly defined ([fe4301f](https://github.com/blesh/symbol-observable/commit/fe4301f37b54162e1a2db91e79c5b33d652496f1))


### BREAKING CHANGES

* **TypeScript:** Older versions of `@types/node` will clash with this, because `@types/node` incorrectly defined `Symbol.observable` has `symbol` and not `unique symbol`. Update to `@types/node@14.14.6` or higher.



## [2.0.3](https://github.com/blesh/symbol-observable/compare/2.0.2...2.0.3) (2020-09-30)

### Bug Fixes

- **package.json** ponyfill.d.ts added to package ([b25f5bf](https://github.com/blesh/symbol-observable/commit/b25f5bfe7425ad21f510428795de8b38aee70b2e))

## [2.0.2](https://github.com/blesh/symbol-observable/compare/2.0.1...2.0.2) (2020-09-29)

### Bug Fixes

- **TypeScript** ponyfill types added ([10d2ec8](https://github.com/blesh/symbol-observable/commit/10d2ec8f0809ac9134be91378fc45c3578f675d4))

## [2.0.1](https://github.com/blesh/symbol-observable/compare/2.0.0...2.0.1) (2020-09-04)

### Bug Fixes

- **package.json:** es/ponyfill.js no longer typoed ([ad2c079](https://github.com/blesh/symbol-observable/commit/ad2c079c71536eaf972101a25eb18f5bca94ab62))
- Resolve issues in environments with frozen Symbol ([2323882](https://github.com/blesh/symbol-observable/commit/23238827ea234188b11774f43afcb5c8deeb278e))

# [2.0.0](https://github.com/blesh/symbol-observable/compare/1.2.0...2.0.0) (2020-09-01)

### Bug Fixes

- Resolve issues in environments with frozen Symbol ([2323882](https://github.com/blesh/symbol-observable/commit/23238827ea234188b11774f43afcb5c8deeb278e))

**BREAKING CHANGE**: This moves to using `Symbol.for` to create the symbol instance. It's _possible_ that some runtimes that support `Symbol` do not support `Symbol.for`. Therefor, I'm marking this as a breaking change. If you find that you hit this issue, please report it. You can work around it by polyfilling `Symbol.for`.

<a name="1.2.0"></a>

# [1.2.0](https://github.com/blesh/symbol-observable/compare/1.1.0...v1.2.0) (2018-01-26)

### Bug Fixes

- **TypeScript:** Remove global Symbol declaration ([427c3d7](https://github.com/blesh/symbol-observable/commit/427c3d7))
- common js usage example (#30) ([42c2ffa](https://github.com/blesh/symbol-observable/commit/42c2ffa))

### Features

- **bundlers:** Add module and main entries in package.json (#33) ([97673e1](https://github.com/blesh/symbol-observable/commit/97673e1))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/blesh/symbol-observable/compare/1.0.4...v1.1.0) (2017-11-28)

### Bug Fixes

- **TypeScript:** update TS to 2.0, fix typings ([e08474e](https://github.com/blesh/symbol-observable/commit/e08474e)), closes [#27](https://github.com/blesh/symbol-observable/issues/27)

### Features

- **browser:** Fully qualified import for native esm browser support (#31) ([8ae5f8e](https://github.com/blesh/symbol-observable/commit/8ae5f8e))
- **index.d.ts:** add type info to Symbol.observable ([e4be157](https://github.com/blesh/symbol-observable/commit/e4be157))

<a name="1.0.4"></a>

## [1.0.4](https://github.com/blesh/symbol-observable/compare/1.0.3...v1.0.4) (2016-10-13)

### Bug Fixes

- **global:** global variable location no longer assumes `module` exists ([4f85ede](https://github.com/blesh/symbol-observable/commit/4f85ede)), closes [#24](https://github.com/blesh/symbol-observable/issues/24)

<a name="1.0.3"></a>

## [1.0.3](https://github.com/blesh/symbol-observable/compare/1.0.2...v1.0.3) (2016-10-11)

### Bug Fixes

- **mozilla addons support:** fix obtaining global object (#23) ([38da34d](https://github.com/blesh/symbol-observable/commit/38da34d)), closes [#23](https://github.com/blesh/symbol-observable/issues/23)

<a name="1.0.2"></a>

## [1.0.2](https://github.com/blesh/symbol-observable/compare/1.0.1...v1.0.2) (2016-08-09)

### Bug Fixes

- **ECMAScript 3**: ensure output is ES3 compatible ([3f37af3](https://github.com/blesh/symbol-observable/commit/3f37af3))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/blesh/symbol-observable/compare/1.0.0...v1.0.1) (2016-06-15)

### Bug Fixes

- **bundlers:** fix issue that caused some bundlers not to be able to locate `/lib` (#19) ([dd8fdfe](https://github.com/blesh/symbol-observable/commit/dd8fdfe)), closes [(#19](https://github.com/(/issues/19) [#17](https://github.com/blesh/symbol-observable/issues/17)

<a name="1.0.0"></a>

# [1.0.0](https://github.com/blesh/symbol-observable/compare/0.2.4...v1.0.0) (2016-06-13)

### Bug Fixes

- **index.js:** use typeof to check for global or window definitions (#8) ([5f4c2c6](https://github.com/blesh/symbol-observable/commit/5f4c2c6))
- **types:** use default syntax for typedef ([240e3a6](https://github.com/blesh/symbol-observable/commit/240e3a6))
- **TypeScript:** exported ponyfill now works with TypeScript ([c0b894e](https://github.com/blesh/symbol-observable/commit/c0b894e))

### Features

- **es2015:** add es2015 implementation to support rollup (#10) ([7a41de9](https://github.com/blesh/symbol-observable/commit/7a41de9))

### BREAKING CHANGES

- TypeScript: CJS users will now have to `require('symbol-observable').default` rather than just `require('symbol-observable')` this was done to better support ES6 module bundlers.

<a name="0.2.4"></a>

## [0.2.4](https://github.com/blesh/symbol-observable/compare/0.2.2...v0.2.4) (2016-04-25)

### Bug Fixes

- **IE8 support:** Ensure ES3 support so IE8 is happy ([9aaa7c3](https://github.com/blesh/symbol-observable/commit/9aaa7c3))
- **Symbol.observable:** should NOT equal `Symbol.for('observable')`. ([3b0fdee](https://github.com/blesh/symbol-observable/commit/3b0fdee)), closes [#7](https://github.com/blesh/symbol-observable/issues/7)

<a name="0.2.3"></a>

## [0.2.3](https://github.com/blesh/symbol-observable/compare/0.2.3...v0.2.3) (2016-04-24)

### Bug Fixes

- **IE8/ECMAScript 3**: Make sure legacy browsers don't choke on a property named `for`. ([9aaa7c](https://github.com/blesh/symbol-observable/9aaa7c))

<a name="0.2.2"></a>

## [0.2.2](https://github.com/sindresorhus/symbol-observable/compare/0.2.1...v0.2.2) (2016-04-19)

### Features

- **TypeScript:** add TypeScript typings file ([befd7a](https://github.com/sindresorhus/symbol-observable/commit/befd7a))

<a name="0.2.1"></a>

## [0.2.1](https://github.com/sindresorhus/symbol-observable/compare/0.2.0...v0.2.1) (2016-04-19)

### Bug Fixes

- **publish:** publish all required files ([5f26c3a](https://github.com/sindresorhus/symbol-observable/commit/5f26c3a))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/sindresorhus/symbol-observable/compare/v0.1.0...v0.2.0) (2016-04-19)

### Bug Fixes

- **Symbol.observable:** ensure Symbol.for(\'observable\') matches Symbol.observable ([ada343f](https://github.com/sindresorhus/symbol-observable/commit/ada343f)), closes [#1](https://github.com/sindresorhus/symbol-observable/issues/1) [#2](https://github.com/sindresorhus/symbol-observable/issues/2)
