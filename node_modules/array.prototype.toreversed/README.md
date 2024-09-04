# array.prototype.toreversed <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ESnext spec-compliant `Array.prototype.toReversed` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the proposed [spec](https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed).

Because `Array.prototype.toReversed` depends on a receiver (the `this` value), the main export takes the array to operate on as the first argument.

## Getting started

```sh
npm install --save array.prototype.toreversed
```

## Usage/Examples

```js
var toReversed = require('array.prototype.toreversed');
var assert = require('assert');

var arr = [0, 1, 2, 3, 4, 5];

var results = toReversed(arr);

assert.deepEqual(results, [5, 4, 3, 2, 1, 0]);
assert.deepEqual(arr, [0, 1, 2, 3, 4, 5]);
```

```js
var toReversed = require('array.prototype.toreversed');
var assert = require('assert');
/* when Array#toReversed is not present */
delete Array.prototype.toReversed;
var shimmed = toReversed.shim();

assert.equal(shimmed, toReversed.getPolyfill());
assert.deepEqual(arr.toReversed(), toReversed(arr));
```

```js
var toReversed = require('array.prototype.toreversed');
var assert = require('assert');
/* when Array#toReversed is present */
var shimmed = toReversed.shim();

assert.equal(shimmed, Array.prototype.toReversed);
assert.deepEqual(arr.toReversed(), toReversed(arr));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/array.prototype.toreversed
[npm-version-svg]: https://versionbadg.es/es-shims/Array.prototype.toReversed.svg
[deps-svg]: https://david-dm.org/es-shims/Array.prototype.toReversed.svg
[deps-url]: https://david-dm.org/es-shims/Array.prototype.toReversed
[dev-deps-svg]: https://david-dm.org/es-shims/Array.prototype.toReversed/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Array.prototype.toReversed#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/array.prototype.toreversed.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/array.prototype.toreversed.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/array.prototype.toreversed.svg
[downloads-url]: https://npm-stat.com/charts.html?package=array.prototype.toreversed
