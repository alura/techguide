/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {Circus} from '@jest/types';
import type {Global} from '@jest/types';

declare const afterAll_2: THook;
export {afterAll_2 as afterAll};

declare const afterEach_2: THook;
export {afterEach_2 as afterEach};

declare const beforeAll_2: THook;
export {beforeAll_2 as beforeAll};

declare const beforeEach_2: THook;
export {beforeEach_2 as beforeEach};

declare const _default: {
  afterAll: THook;
  afterEach: THook;
  beforeAll: THook;
  beforeEach: THook;
  describe: {
    (blockName: Global.BlockNameLike, blockFn: Global.BlockFn): void;
    each: (
      table: Global.EachTable,
      ...taggedTemplateData: Global.TemplateData
    ) => (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    only: {
      (blockName: Global.BlockNameLike, blockFn: Global.BlockFn): void;
      each: (
        table: Global.EachTable,
        ...taggedTemplateData: Global.TemplateData
      ) => (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
    };
    skip: {
      (blockName: Global.BlockNameLike, blockFn: Global.BlockFn): void;
      each: (
        table: Global.EachTable,
        ...taggedTemplateData: Global.TemplateData
      ) => (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
    };
  };
  it: Global.It;
  test: Global.It;
};
export default _default;

declare const describe_2: {
  (blockName: Circus.BlockNameLike, blockFn: Circus.BlockFn): void;
  each: (
    table: Global.EachTable,
    ...taggedTemplateData: Global.TemplateData
  ) => (
    title: Global.BlockNameLike,
    test: Global.EachTestFn<Global.TestCallback>,
    timeout?: number | undefined,
  ) => void;
  only: {
    (blockName: Circus.BlockNameLike, blockFn: Circus.BlockFn): void;
    each: (
      table: Global.EachTable,
      ...taggedTemplateData: Global.TemplateData
    ) => (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
  };
  skip: {
    (blockName: Circus.BlockNameLike, blockFn: Circus.BlockFn): void;
    each: (
      table: Global.EachTable,
      ...taggedTemplateData: Global.TemplateData
    ) => (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
  };
};
export {describe_2 as describe};

declare type Event_2 = Circus.Event;
export {Event_2 as Event};

export declare const getState: () => Circus.State;

declare const it_2: Global.It;
export {it_2 as it};

export declare const resetState: () => void;

export declare const run: () => Promise<Circus.RunResult>;

export declare const setState: (state: Circus.State) => Circus.State;

export declare type State = Circus.State;

declare const test_2: Global.It;
export {test_2 as test};

declare type THook = (fn: Circus.HookFn, timeout?: number) => void;

export {};
