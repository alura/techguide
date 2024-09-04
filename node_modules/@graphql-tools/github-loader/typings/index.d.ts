import { Loader, BaseLoaderOptions, Source } from '@graphql-tools/utils';
import { GraphQLTagPluckOptions } from '@graphql-tools/graphql-tag-pluck';
import { AsyncFetchFn, FetchFn, SyncFetchFn } from '@graphql-tools/executor-http';
/**
 * Additional options for loading from GitHub
 */
export interface GithubLoaderOptions extends BaseLoaderOptions {
    /**
     * A GitHub access token
     *
     * @default process.env.GITHUB_TOKEN
     */
    token?: string;
    /**
     * Additional options to pass to `graphql-tag-pluck`
     */
    pluckConfig?: GraphQLTagPluckOptions;
    customFetch?: FetchFn;
}
/**
 * This loader loads a file from GitHub.
 *
 * ```js
 * const typeDefs = await loadTypedefs('github:githubUser/githubRepo#branchName:path/to/file.ts', {
 *   loaders: [new GithubLoader()],
 *   token: YOUR_GITHUB_TOKEN,
 * })
 * ```
 */
export declare class GithubLoader implements Loader<GithubLoaderOptions> {
    canLoad(pointer: string): Promise<boolean>;
    canLoadSync(pointer: string): boolean;
    loadSyncOrAsync(pointer: string, options: GithubLoaderOptions, asyncFetchFn: AsyncFetchFn): Promise<Source[]>;
    loadSyncOrAsync(pointer: string, options: GithubLoaderOptions, syncFetchFn: SyncFetchFn): Source[];
    load(pointer: string, options: GithubLoaderOptions): Promise<Source[]>;
    loadSync(pointer: string, options: GithubLoaderOptions): Source[];
    handleResponse({ pointer, path, options, response, status, }: {
        pointer: string;
        path: string;
        options: any;
        response: any;
        status: number;
    }): Source[] | {
        location: string | undefined;
        document: import("graphql").DocumentNode;
    }[];
    prepareRequest({ owner, ref, path, name, options, }: {
        owner: string;
        ref: string;
        path: string;
        name: string;
        options: GithubLoaderOptions;
    }): RequestInit;
}
