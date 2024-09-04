/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {Global} from '@jest/types';

export declare function bind<EachCallback extends Global.TestCallback>(
  cb: GlobalCallback,
  supportsDone?: boolean,
): (
  table: Global.EachTable,
  ...taggedTemplateData: Global.TemplateData
) => (
  title: Global.BlockNameLike,
  test: Global.EachTestFn<EachCallback>,
  timeout?: number,
) => void;

declare const each: {
  (table: Global.EachTable, ...data: Global.TemplateData): ReturnType<
    typeof install
  >;
  withGlobal(g: Global): (
    table: Global.EachTable,
    ...data: Global.TemplateData
  ) => {
    describe: {
      (
        title: string,
        suite: Global.EachTestFn<Global.BlockFn>,
        timeout?: number,
      ): void;
      skip: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
      only: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
    };
    fdescribe: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    fit: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    it: {
      (
        title: string,
        test: Global.EachTestFn<Global.TestFn>,
        timeout?: number,
      ): void;
      skip: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
      only: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
      concurrent: {
        (
          title: string,
          test: Global.EachTestFn<Global.TestFn>,
          timeout?: number,
        ): void;
        only: (
          title: Global.BlockNameLike,
          test: Global.EachTestFn<Global.TestCallback>,
          timeout?: number | undefined,
        ) => void;
        skip: (
          title: Global.BlockNameLike,
          test: Global.EachTestFn<Global.TestCallback>,
          timeout?: number | undefined,
        ) => void;
      };
    };
    test: {
      (
        title: string,
        test: Global.EachTestFn<Global.TestFn>,
        timeout?: number,
      ): void;
      skip: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
      only: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
      concurrent: {
        (
          title: string,
          test: Global.EachTestFn<Global.TestFn>,
          timeout?: number,
        ): void;
        only: (
          title: Global.BlockNameLike,
          test: Global.EachTestFn<Global.TestCallback>,
          timeout?: number | undefined,
        ) => void;
        skip: (
          title: Global.BlockNameLike,
          test: Global.EachTestFn<Global.TestCallback>,
          timeout?: number | undefined,
        ) => void;
      };
    };
    xdescribe: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    xit: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    xtest: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
  };
};
export default each;

declare type GlobalCallback = (
  testName: string,
  fn: Global.ConcurrentTestFn,
  timeout?: number,
) => void;

declare const install: (
  g: Global,
  table: Global.EachTable,
  ...data: Global.TemplateData
) => {
  describe: {
    (
      title: string,
      suite: Global.EachTestFn<Global.BlockFn>,
      timeout?: number,
    ): void;
    skip: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    only: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
  };
  fdescribe: (
    title: Global.BlockNameLike,
    test: Global.EachTestFn<Global.TestCallback>,
    timeout?: number | undefined,
  ) => void;
  fit: (
    title: Global.BlockNameLike,
    test: Global.EachTestFn<Global.TestCallback>,
    timeout?: number | undefined,
  ) => void;
  it: {
    (
      title: string,
      test: Global.EachTestFn<Global.TestFn>,
      timeout?: number,
    ): void;
    skip: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    only: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    concurrent: {
      (
        title: string,
        test: Global.EachTestFn<Global.TestFn>,
        timeout?: number,
      ): void;
      only: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
      skip: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
    };
  };
  test: {
    (
      title: string,
      test: Global.EachTestFn<Global.TestFn>,
      timeout?: number,
    ): void;
    skip: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    only: (
      title: Global.BlockNameLike,
      test: Global.EachTestFn<Global.TestCallback>,
      timeout?: number | undefined,
    ) => void;
    concurrent: {
      (
        title: string,
        test: Global.EachTestFn<Global.TestFn>,
        timeout?: number,
      ): void;
      only: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
      skip: (
        title: Global.BlockNameLike,
        test: Global.EachTestFn<Global.TestCallback>,
        timeout?: number | undefined,
      ) => void;
    };
  };
  xdescribe: (
    title: Global.BlockNameLike,
    test: Global.EachTestFn<Global.TestCallback>,
    timeout?: number | undefined,
  ) => void;
  xit: (
    title: Global.BlockNameLike,
    test: Global.EachTestFn<Global.TestCallback>,
    timeout?: number | undefined,
  ) => void;
  xtest: (
    title: Global.BlockNameLike,
    test: Global.EachTestFn<Global.TestCallback>,
    timeout?: number | undefined,
  ) => void;
};

export {};
