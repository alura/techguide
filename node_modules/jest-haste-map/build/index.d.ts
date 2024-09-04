/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />

import type {Config} from '@jest/types';
import {EventEmitter} from 'events';
import type {Stats} from 'graceful-fs';

export declare type ChangeEvent = {
  eventsQueue: EventsQueue;
  hasteFS: FS;
  moduleMap: ModuleMap;
};

export declare class DuplicateError extends Error {
  mockPath1: string;
  mockPath2: string;
  constructor(mockPath1: string, mockPath2: string);
}

declare class DuplicateHasteCandidatesError extends Error {
  hasteName: string;
  platform: string | null;
  supportsNativePlatform: boolean;
  duplicatesSet: DuplicatesSet;
  constructor(
    name: string,
    platform: string,
    supportsNativePlatform: boolean,
    duplicatesSet: DuplicatesSet,
  );
}

declare type DuplicatesIndex = Map<string, Map<string, DuplicatesSet>>;

declare type DuplicatesSet = Map<string, /* type */ number>;

declare type EventsQueue = Array<{
  filePath: string;
  stat: Stats | undefined;
  type: string;
}>;

declare type FileData = Map<string, FileMetaData>;

declare type FileMetaData = [
  id: string,
  mtime: number,
  size: number,
  visited: 0 | 1,
  dependencies: string,
  sha1: string | null | undefined,
];

export declare class FS {
  private readonly _rootDir;
  private readonly _files;
  constructor({rootDir, files}: {rootDir: string; files: FileData});
  getModuleName(file: string): string | null;
  getSize(file: string): number | null;
  getDependencies(file: string): Array<string> | null;
  getSha1(file: string): string | null;
  exists(file: string): boolean;
  getAllFiles(): Array<string>;
  getFileIterator(): Iterable<string>;
  getAbsoluteFileIterator(): Iterable<string>;
  matchFiles(pattern: RegExp | string): Array<string>;
  matchFilesWithGlob(globs: Array<string>, root: string | null): Set<string>;
  private _getFileData;
}

/**
 * HasteMap is a JavaScript implementation of Facebook's haste module system.
 *
 * This implementation is inspired by https://github.com/facebook/node-haste
 * and was built with for high-performance in large code repositories with
 * hundreds of thousands of files. This implementation is scalable and provides
 * predictable performance.
 *
 * Because the haste map creation and synchronization is critical to startup
 * performance and most tasks are blocked by I/O this class makes heavy use of
 * synchronous operations. It uses worker processes for parallelizing file
 * access and metadata extraction.
 *
 * The data structures created by `jest-haste-map` can be used directly from the
 * cache without further processing. The metadata objects in the `files` and
 * `map` objects contain cross-references: a metadata object from one can look
 * up the corresponding metadata object in the other map. Note that in most
 * projects, the number of files will be greater than the number of haste
 * modules one module can refer to many files based on platform extensions.
 *
 * type HasteMap = {
 *   clocks: WatchmanClocks,
 *   files: {[filepath: string]: FileMetaData},
 *   map: {[id: string]: ModuleMapItem},
 *   mocks: {[id: string]: string},
 * }
 *
 * // Watchman clocks are used for query synchronization and file system deltas.
 * type WatchmanClocks = {[filepath: string]: string};
 *
 * type FileMetaData = {
 *   id: ?string, // used to look up module metadata objects in `map`.
 *   mtime: number, // check for outdated files.
 *   size: number, // size of the file in bytes.
 *   visited: boolean, // whether the file has been parsed or not.
 *   dependencies: Array<string>, // all relative dependencies of this file.
 *   sha1: ?string, // SHA-1 of the file, if requested via options.
 * };
 *
 * // Modules can be targeted to a specific platform based on the file name.
 * // Example: platform.ios.js and Platform.android.js will both map to the same
 * // `Platform` module. The platform should be specified during resolution.
 * type ModuleMapItem = {[platform: string]: ModuleMetaData};
 *
 * //
 * type ModuleMetaData = {
 *   path: string, // the path to look up the file object in `files`.
 *   type: string, // the module type (either `package` or `module`).
 * };
 *
 * Note that the data structures described above are conceptual only. The actual
 * implementation uses arrays and constant keys for metadata storage. Instead of
 * `{id: 'flatMap', mtime: 3421, size: 42, visited: true, dependencies: []}` the real
 * representation is similar to `['flatMap', 3421, 42, 1, []]` to save storage space
 * and reduce parse and write time of a big JSON blob.
 *
 * The HasteMap is created as follows:
 *  1. read data from the cache or create an empty structure.
 *
 *  2. crawl the file system.
 *     * empty cache: crawl the entire file system.
 *     * cache available:
 *       * if watchman is available: get file system delta changes.
 *       * if watchman is unavailable: crawl the entire file system.
 *     * build metadata objects for every file. This builds the `files` part of
 *       the `HasteMap`.
 *
 *  3. parse and extract metadata from changed files.
 *     * this is done in parallel over worker processes to improve performance.
 *     * the worst case is to parse all files.
 *     * the best case is no file system access and retrieving all data from
 *       the cache.
 *     * the average case is a small number of changed files.
 *
 *  4. serialize the new `HasteMap` in a cache file.
 *     Worker processes can directly access the cache through `HasteMap.read()`.
 *
 */
declare class HasteMap extends EventEmitter {
  private _buildPromise;
  private _cachePath;
  private _changeInterval?;
  private _console;
  private _isWatchmanInstalledPromise;
  private _options;
  private _watchers;
  private _worker;
  static getStatic(config: Config.ProjectConfig): HasteMapStatic;
  static create(options: Options): Promise<HasteMap>;
  private constructor();
  private setupCachePath;
  static getCacheFilePath(
    tmpdir: string,
    id: string,
    ...extra: Array<string>
  ): string;
  static getModuleMapFromJSON(json: SerializableModuleMap): ModuleMap;
  getCacheFilePath(): string;
  build(): Promise<HasteMapObject>;
  /**
   * 1. read data from the cache or create an empty structure.
   */
  read(): InternalHasteMap;
  readModuleMap(): ModuleMap;
  /**
   * 2. crawl the file system.
   */
  private _buildFileMap;
  /**
   * 3. parse and extract metadata from changed files.
   */
  private _processFile;
  private _buildHasteMap;
  private _cleanup;
  /**
   * 4. serialize the new `HasteMap` in a cache file.
   */
  private _persist;
  /**
   * Creates workers or parses files and extracts metadata in-process.
   */
  private _getWorker;
  private _crawl;
  /**
   * Watch mode
   */
  private _watch;
  /**
   * This function should be called when the file under `filePath` is removed
   * or changed. When that happens, we want to figure out if that file was
   * part of a group of files that had the same ID. If it was, we want to
   * remove it from the group. Furthermore, if there is only one file
   * remaining in the group, then we want to restore that single file as the
   * correct resolution for its ID, and cleanup the duplicates index.
   */
  private _recoverDuplicates;
  end(): Promise<void>;
  /**
   * Helpers
   */
  private _ignore;
  private _shouldUseWatchman;
  private _createEmptyMap;
  static H: HType;
}
export default HasteMap;

export declare type HasteMapObject = {
  hasteFS: FS;
  moduleMap: ModuleMap;
  __hasteMapForTest?: InternalHasteMap | null;
};

declare type HasteMapStatic<S = SerializableModuleMap> = {
  getCacheFilePath(
    tmpdir: string,
    name: string,
    ...extra: Array<string>
  ): string;
  getModuleMapFromJSON(json: S): IModuleMap<S>;
};

declare type HasteRegExp = RegExp | ((str: string) => boolean);

declare type HType = {
  ID: 0;
  MTIME: 1;
  SIZE: 2;
  VISITED: 3;
  DEPENDENCIES: 4;
  SHA1: 5;
  PATH: 0;
  TYPE: 1;
  MODULE: 0;
  PACKAGE: 1;
  GENERIC_PLATFORM: 'g';
  NATIVE_PLATFORM: 'native';
  DEPENDENCY_DELIM: '\0';
};

declare type HTypeValue = HType[keyof HType];

export declare interface IModuleMap<S = SerializableModuleMap> {
  getModule(
    name: string,
    platform?: string | null,
    supportsNativePlatform?: boolean | null,
    type?: HTypeValue | null,
  ): string | null;
  getPackage(
    name: string,
    platform: string | null | undefined,
    _supportsNativePlatform: boolean | null,
  ): string | null;
  getMockModule(name: string): string | undefined;
  getRawModuleMap(): RawModuleMap;
  toJSON(): S;
}

declare type InternalHasteMap = {
  clocks: WatchmanClocks;
  duplicates: DuplicatesIndex;
  files: FileData;
  map: ModuleMapData;
  mocks: MockData;
};

declare type MockData = Map<string, string>;

export declare class ModuleMap implements IModuleMap<SerializableModuleMap> {
  static DuplicateHasteCandidatesError: typeof DuplicateHasteCandidatesError;
  private readonly _raw;
  private json;
  private static mapToArrayRecursive;
  private static mapFromArrayRecursive;
  constructor(raw: RawModuleMap);
  getModule(
    name: string,
    platform?: string | null,
    supportsNativePlatform?: boolean | null,
    type?: HTypeValue | null,
  ): string | null;
  getPackage(
    name: string,
    platform: string | null | undefined,
    _supportsNativePlatform: boolean | null,
  ): string | null;
  getMockModule(name: string): string | undefined;
  getRawModuleMap(): RawModuleMap;
  toJSON(): SerializableModuleMap;
  static fromJSON(serializableModuleMap: SerializableModuleMap): ModuleMap;
  /**
   * When looking up a module's data, we walk through each eligible platform for
   * the query. For each platform, we want to check if there are known
   * duplicates for that name+platform pair. The duplication logic normally
   * removes elements from the `map` object, but we want to check upfront to be
   * extra sure. If metadata exists both in the `duplicates` object and the
   * `map`, this would be a bug.
   */
  private _getModuleMetadata;
  private _assertNoDuplicates;
  static create(rootDir: string): ModuleMap;
}

declare type ModuleMapData = Map<string, ModuleMapItem>;

declare type ModuleMapItem = {
  [platform: string]: ModuleMetaData;
};

declare type ModuleMetaData = [path: string, type: number];

declare type Options = {
  cacheDirectory?: string;
  computeDependencies?: boolean;
  computeSha1?: boolean;
  console?: Console;
  dependencyExtractor?: string | null;
  enableSymlinks?: boolean;
  extensions: Array<string>;
  forceNodeFilesystemAPI?: boolean;
  hasteImplModulePath?: string;
  hasteMapModulePath?: string;
  id: string;
  ignorePattern?: HasteRegExp;
  maxWorkers: number;
  mocksPattern?: string;
  platforms: Array<string>;
  resetCache?: boolean;
  retainAllFiles: boolean;
  rootDir: string;
  roots: Array<string>;
  skipPackageJson?: boolean;
  throwOnModuleCollision?: boolean;
  useWatchman?: boolean;
  watch?: boolean;
};

declare type RawModuleMap = {
  rootDir: string;
  duplicates: DuplicatesIndex;
  map: ModuleMapData;
  mocks: MockData;
};

export declare type SerializableModuleMap = {
  duplicates: ReadonlyArray<[string, [string, [string, [string, number]]]]>;
  map: ReadonlyArray<[string, ValueType<ModuleMapData>]>;
  mocks: ReadonlyArray<[string, ValueType<MockData>]>;
  rootDir: string;
};

declare type ValueType<T> = T extends Map<string, infer V> ? V : never;

declare type WatchmanClocks = Map<string, WatchmanClockSpec>;

declare type WatchmanClockSpec =
  | string
  | {
      scm: {
        'mergebase-with': string;
      };
    };

export {};
