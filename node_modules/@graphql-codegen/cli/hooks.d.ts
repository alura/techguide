import { Types } from '@graphql-codegen/plugin-helpers';
export declare const lifecycleHooks: (_hooks?: Partial<Types.LifecycleHooksDefinition>) => {
    afterStart: () => Promise<void>;
    onWatchTriggered: (event: string, path: string) => Promise<void>;
    onError: (error: string) => Promise<void>;
    afterOneFileWrite: (path: string) => Promise<void>;
    afterAllFileWrite: (paths: string[]) => Promise<void>;
    beforeOneFileWrite: (path: string) => Promise<void>;
    beforeAllFileWrite: (paths: string[]) => Promise<void>;
    beforeDone: () => Promise<void>;
};
