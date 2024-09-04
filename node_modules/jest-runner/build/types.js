'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.EmittingTestRunner = exports.CallbackTestRunner = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class BaseTestRunner {
  isSerial;
  supportsEventEmitters;

  constructor(_globalConfig, _context) {
    this._globalConfig = _globalConfig;
    this._context = _context;
  }
}

class CallbackTestRunner extends BaseTestRunner {
  supportsEventEmitters = false;
}

exports.CallbackTestRunner = CallbackTestRunner;

class EmittingTestRunner extends BaseTestRunner {
  supportsEventEmitters = true;
}

exports.EmittingTestRunner = EmittingTestRunner;
