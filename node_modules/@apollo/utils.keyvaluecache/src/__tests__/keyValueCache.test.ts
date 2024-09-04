import { expectType } from "ts-expect";
import type { KeyValueCache } from "..";

describe("KeyValueCache", () => {
  const minimalCompatibleCache = {
    get: async (_key: string) => undefined,
    set: async (_key: string, _value: string, _options?: { ttl?: number }) =>
      undefined,
    delete: async (_key: string) => undefined,
  };

  it("minimum implementation type-checks", () => {
    expectType<KeyValueCache<string>>(minimalCompatibleCache);
  });

  describe("type-check failures", () => {
    it("get", () => {
      const { get, ...cacheNoGet } = minimalCompatibleCache;

      // @ts-expect-error
      expectType<KeyValueCache<string>>(cacheNoGet);

      {
        const cacheBadGet = {
          ...minimalCompatibleCache,
          // no async
          get: (_key: string) => undefined,
        };

        // @ts-expect-error
        expectType<KeyValueCache<string>>(cacheBadGet);
      }
      {
        const cacheBadGet = {
          ...minimalCompatibleCache,
          // incompatible type
          get: async (_key: number) => undefined,
        };

        // @ts-expect-error
        expectType<KeyValueCache<string>>(cacheBadGet);
      }
    });

    it("set", () => {
      const { set, ...cacheNoSet } = minimalCompatibleCache;

      // @ts-expect-error
      expectType<KeyValueCache<string>>(cacheNoSet);

      {
        const cacheBadSet = {
          ...minimalCompatibleCache,
          // no async
          set: (_key: string) => undefined,
        };

        // @ts-expect-error
        expectType<KeyValueCache<string>>(cacheBadSet);
      }
      {
        const cacheBadSet = {
          ...minimalCompatibleCache,
          // incompatible type
          set: async (_key: number) => undefined,
        };

        // @ts-expect-error
        expectType<KeyValueCache<string>>(cacheBadSet);
      }
    });

    it("delete", () => {
      const { delete: _delete, ...cacheNoDelete } = minimalCompatibleCache;

      // @ts-expect-error
      expectType<KeyValueCache<string>>(cacheNoDelete);

      {
        const cacheBadDelete = {
          ...minimalCompatibleCache,
          // no async
          delete: (_key: string) => undefined,
        };

        // @ts-expect-error
        expectType<KeyValueCache<string>>(cacheBadDelete);
      }
      {
        const cacheBadDelete = {
          ...minimalCompatibleCache,
          // incompatible type
          delete: async (_key: number) => undefined,
        };

        // @ts-expect-error
        expectType<KeyValueCache<string>>(cacheBadDelete);
      }
    });
  });
});
