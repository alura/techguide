'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _fakeTimers() {
  const data = require('@sinonjs/fake-timers');

  _fakeTimers = function () {
    return data;
  };

  return data;
}

function _jestMessageUtil() {
  const data = require('jest-message-util');

  _jestMessageUtil = function () {
    return data;
  };

  return data;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class FakeTimers {
  _clock;
  _config;
  _fakingTime;
  _global;
  _fakeTimers;

  constructor({global, config}) {
    this._global = global;
    this._config = config;
    this._fakingTime = false;
    this._fakeTimers = (0, _fakeTimers().withGlobal)(global);
  }

  clearAllTimers() {
    if (this._fakingTime) {
      this._clock.reset();
    }
  }

  dispose() {
    this.useRealTimers();
  }

  runAllTimers() {
    if (this._checkFakeTimers()) {
      this._clock.runAll();
    }
  }

  runOnlyPendingTimers() {
    if (this._checkFakeTimers()) {
      this._clock.runToLast();
    }
  }

  advanceTimersToNextTimer(steps = 1) {
    if (this._checkFakeTimers()) {
      for (let i = steps; i > 0; i--) {
        this._clock.next(); // Fire all timers at this point: https://github.com/sinonjs/fake-timers/issues/250

        this._clock.tick(0);

        if (this._clock.countTimers() === 0) {
          break;
        }
      }
    }
  }

  advanceTimersByTime(msToRun) {
    if (this._checkFakeTimers()) {
      this._clock.tick(msToRun);
    }
  }

  runAllTicks() {
    if (this._checkFakeTimers()) {
      // @ts-expect-error - doesn't exist?
      this._clock.runMicrotasks();
    }
  }

  useRealTimers() {
    if (this._fakingTime) {
      this._clock.uninstall();

      this._fakingTime = false;
    }
  }

  useFakeTimers(fakeTimersConfig) {
    if (this._fakingTime) {
      this._clock.uninstall();
    }

    this._clock = this._fakeTimers.install(
      this._toSinonFakeTimersConfig(fakeTimersConfig)
    );
    this._fakingTime = true;
  }

  reset() {
    if (this._checkFakeTimers()) {
      const {now} = this._clock;

      this._clock.reset();

      this._clock.setSystemTime(now);
    }
  }

  setSystemTime(now) {
    if (this._checkFakeTimers()) {
      this._clock.setSystemTime(now);
    }
  }

  getRealSystemTime() {
    return Date.now();
  }

  getTimerCount() {
    if (this._checkFakeTimers()) {
      return this._clock.countTimers();
    }

    return 0;
  }

  _checkFakeTimers() {
    if (!this._fakingTime) {
      this._global.console.warn(
        'A function to advance timers was called but the timers APIs are not replaced ' +
          'with fake timers. Call `jest.useFakeTimers()` in this test file or enable ' +
          "fake timers for all tests by setting 'fakeTimers': {'enableGlobally': true} " +
          `in Jest configuration file.\nStack Trace:\n${(0,
          _jestMessageUtil().formatStackTrace)(
            new Error().stack,
            this._config,
            {
              noStackTrace: false
            }
          )}`
      );
    }

    return this._fakingTime;
  }

  _toSinonFakeTimersConfig(fakeTimersConfig = {}) {
    var _fakeTimersConfig$doN, _fakeTimersConfig$now;

    fakeTimersConfig = {...this._config.fakeTimers, ...fakeTimersConfig};
    const advanceTimeDelta =
      typeof fakeTimersConfig.advanceTimers === 'number'
        ? fakeTimersConfig.advanceTimers
        : undefined;
    const toFake = new Set(Object.keys(this._fakeTimers.timers));
    (_fakeTimersConfig$doN = fakeTimersConfig.doNotFake) === null ||
    _fakeTimersConfig$doN === void 0
      ? void 0
      : _fakeTimersConfig$doN.forEach(nameOfFakeableAPI => {
          toFake.delete(nameOfFakeableAPI);
        });
    return {
      advanceTimeDelta,
      loopLimit: fakeTimersConfig.timerLimit || 100_000,
      now:
        (_fakeTimersConfig$now = fakeTimersConfig.now) !== null &&
        _fakeTimersConfig$now !== void 0
          ? _fakeTimersConfig$now
          : Date.now(),
      shouldAdvanceTime: Boolean(fakeTimersConfig.advanceTimers),
      shouldClearNativeTimers: true,
      toFake: Array.from(toFake)
    };
  }
}

exports.default = FakeTimers;
