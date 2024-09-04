'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _path() {
  const data = require('path');

  _path = function () {
    return data;
  };

  return data;
}

function _jestPnpResolver() {
  const data = _interopRequireDefault(require('jest-pnp-resolver'));

  _jestPnpResolver = function () {
    return data;
  };

  return data;
}

function _resolve() {
  const data = require('resolve');

  _resolve = function () {
    return data;
  };

  return data;
}

var _resolve2 = require('resolve.exports');

var _fileWalkers = require('./fileWalkers');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const defaultResolver = (path, options) => {
  // Yarn 2 adds support to `resolve` automatically so the pnpResolver is only
  // needed for Yarn 1 which implements version 1 of the pnp spec
  if (process.versions.pnp === '1') {
    return (0, _jestPnpResolver().default)(path, options);
  }

  const resolveOptions = {
    ...options,
    isDirectory: _fileWalkers.isDirectory,
    isFile: _fileWalkers.isFile,
    preserveSymlinks: false,
    readPackageSync,
    realpathSync: _fileWalkers.realpathSync
  };
  const pathToResolve = getPathInModule(path, resolveOptions);
  const result = // if `getPathInModule` doesn't change the path, attempt to resolve it
    pathToResolve === path
      ? (0, _resolve().sync)(pathToResolve, resolveOptions)
      : pathToResolve; // Dereference symlinks to ensure we don't create a separate
  // module instance depending on how it was referenced.

  return (0, _fileWalkers.realpathSync)(result);
};

var _default = defaultResolver;
/*
 * helper functions
 */

exports.default = _default;

function readPackageSync(_, file) {
  return (0, _fileWalkers.readPackageCached)(file);
}

function getPathInModule(path, options) {
  if (shouldIgnoreRequestForExports(path)) {
    return path;
  }

  const segments = path.split('/');
  let moduleName = segments.shift();

  if (moduleName) {
    // TODO: handle `#` here: https://github.com/facebook/jest/issues/12270
    if (moduleName.startsWith('@')) {
      moduleName = `${moduleName}/${segments.shift()}`;
    } // self-reference

    const closestPackageJson = (0, _fileWalkers.findClosestPackageJson)(
      options.basedir
    );

    if (closestPackageJson) {
      const pkg = (0, _fileWalkers.readPackageCached)(closestPackageJson);

      if (pkg.name === moduleName && pkg.exports) {
        const subpath = segments.join('/') || '.';
        const resolved = (0, _resolve2.resolve)(
          pkg,
          subpath,
          createResolveOptions(options.conditions)
        );

        if (!resolved) {
          throw new Error(
            '`exports` exists, but no results - this is a bug in Jest. Please report an issue'
          );
        }

        return (0, _path().resolve)(
          (0, _path().dirname)(closestPackageJson),
          resolved
        );
      }
    }

    let packageJsonPath = '';

    try {
      packageJsonPath = (0, _resolve().sync)(
        `${moduleName}/package.json`,
        options
      );
    } catch {
      // ignore if package.json cannot be found
    }

    if (packageJsonPath && (0, _fileWalkers.isFile)(packageJsonPath)) {
      const pkg = (0, _fileWalkers.readPackageCached)(packageJsonPath);

      if (pkg.exports) {
        const subpath = segments.join('/') || '.';
        const resolved = (0, _resolve2.resolve)(
          pkg,
          subpath,
          createResolveOptions(options.conditions)
        );

        if (!resolved) {
          throw new Error(
            '`exports` exists, but no results - this is a bug in Jest. Please report an issue'
          );
        }

        return (0, _path().resolve)(
          (0, _path().dirname)(packageJsonPath),
          resolved
        );
      }
    }
  }

  return path;
}

function createResolveOptions(conditions) {
  return conditions
    ? {
        conditions,
        unsafe: true
      } // no conditions were passed - let's assume this is Jest internal and it should be `require`
    : {
        browser: false,
        require: true
      };
} // if it's a relative import or an absolute path, exports are ignored

const shouldIgnoreRequestForExports = path =>
  path.startsWith('.') || (0, _path().isAbsolute)(path);
