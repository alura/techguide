/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {Config} from '@jest/types';
import type {FS} from 'jest-haste-map';
import type {MatcherFunctionWithState} from 'expect';
import type {MatcherState} from 'expect';
import type {OptionsReceived} from 'pretty-format';
import {Plugin as Plugin_2} from 'pretty-format';
import {Plugins} from 'pretty-format';

export declare const addSerializer: (plugin: Plugin_2) => void;

export declare const buildSnapshotResolver: (
  config: Config.ProjectConfig,
  localRequire?: Promise<LocalRequire> | LocalRequire,
) => Promise<SnapshotResolver>;

export declare const cleanup: (
  hasteFS: FS,
  update: Config.SnapshotUpdateState,
  snapshotResolver: SnapshotResolver,
  testPathIgnorePatterns?: Config.ProjectConfig['testPathIgnorePatterns'],
) => {
  filesRemoved: number;
  filesRemovedList: Array<string>;
};

declare interface Context extends MatcherState {
  snapshotState: SnapshotState;
}

export declare const EXTENSION = 'snap';

export declare const getSerializers: () => Plugins;

export declare const isSnapshotPath: (path: string) => boolean;

declare type LocalRequire = (module: string) => unknown;

declare type SaveStatus = {
  deleted: boolean;
  saved: boolean;
};

export declare interface SnapshotMatchers<R extends void | Promise<void>, T> {
  /**
   * This ensures that a value matches the most recent snapshot with property matchers.
   * Check out [the Snapshot Testing guide](https://jestjs.io/docs/snapshot-testing) for more information.
   */
  toMatchSnapshot(hint?: string): R;
  /**
   * This ensures that a value matches the most recent snapshot.
   * Check out [the Snapshot Testing guide](https://jestjs.io/docs/snapshot-testing) for more information.
   */
  toMatchSnapshot<U extends Record<keyof T, unknown>>(
    propertyMatchers: Partial<U>,
    hint?: string,
  ): R;
  /**
   * This ensures that a value matches the most recent snapshot with property matchers.
   * Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
   * Check out [the Snapshot Testing guide](https://jestjs.io/docs/snapshot-testing) for more information.
   */
  toMatchInlineSnapshot(snapshot?: string): R;
  /**
   * This ensures that a value matches the most recent snapshot with property matchers.
   * Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
   * Check out [the Snapshot Testing guide](https://jestjs.io/docs/snapshot-testing) for more information.
   */
  toMatchInlineSnapshot<U extends Record<keyof T, unknown>>(
    propertyMatchers: Partial<U>,
    snapshot?: string,
  ): R;
  /**
   * Used to test that a function throws a error matching the most recent snapshot when it is called.
   */
  toThrowErrorMatchingSnapshot(hint?: string): R;
  /**
   * Used to test that a function throws a error matching the most recent snapshot when it is called.
   * Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
   */
  toThrowErrorMatchingInlineSnapshot(snapshot?: string): R;
}

declare type SnapshotMatchOptions = {
  testName: string;
  received: unknown;
  key?: string;
  inlineSnapshot?: string;
  isInline: boolean;
  error?: Error;
};

export declare type SnapshotResolver = {
  /** Resolves from `testPath` to snapshot path. */
  resolveSnapshotPath(testPath: string, snapshotExtension?: string): string;
  /** Resolves from `snapshotPath` to test path. */
  resolveTestPath(snapshotPath: string, snapshotExtension?: string): string;
  /** Example test path, used for preflight consistency check of the implementation above. */
  testPathForConsistencyCheck: string;
};

declare type SnapshotReturnOptions = {
  actual: string;
  count: number;
  expected?: string;
  key: string;
  pass: boolean;
};

export declare class SnapshotState {
  private _counters;
  private _dirty;
  private _index;
  private _updateSnapshot;
  private _snapshotData;
  private _initialData;
  private _snapshotPath;
  private _inlineSnapshots;
  private _uncheckedKeys;
  private _prettierPath;
  private _snapshotFormat;
  added: number;
  expand: boolean;
  matched: number;
  unmatched: number;
  updated: number;
  constructor(snapshotPath: string, options: SnapshotStateOptions);
  markSnapshotsAsCheckedForTest(testName: string): void;
  private _addSnapshot;
  clear(): void;
  save(): SaveStatus;
  getUncheckedCount(): number;
  getUncheckedKeys(): Array<string>;
  removeUncheckedKeys(): void;
  match({
    testName,
    received,
    key,
    inlineSnapshot,
    isInline,
    error,
  }: SnapshotMatchOptions): SnapshotReturnOptions;
  fail(testName: string, _received: unknown, key?: string): string;
}

declare type SnapshotStateOptions = {
  updateSnapshot: Config.SnapshotUpdateState;
  prettierPath: string;
  expand?: boolean;
  snapshotFormat: OptionsReceived;
};

export declare const toMatchInlineSnapshot: MatcherFunctionWithState<Context>;

export declare const toMatchSnapshot: MatcherFunctionWithState<Context>;

export declare const toThrowErrorMatchingInlineSnapshot: MatcherFunctionWithState<Context>;

export declare const toThrowErrorMatchingSnapshot: MatcherFunctionWithState<Context>;

export {};
