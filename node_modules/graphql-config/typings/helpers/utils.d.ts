import type { IGraphQLConfig, IGraphQLProject, IGraphQLProjects, IGraphQLProjectLegacy } from '../types.js';
export declare function isMultipleProjectConfig(config: IGraphQLConfig): config is IGraphQLProjects;
export declare function isSingleProjectConfig(config: IGraphQLConfig): config is IGraphQLProject;
export declare function isLegacyProjectConfig(config: IGraphQLConfig): config is IGraphQLProjectLegacy;
export type MiddlewareFn<T> = (input: T) => T;
export declare function useMiddleware<T>(fns: Array<MiddlewareFn<T>>): (input: T) => T;
//# sourceMappingURL=utils.d.ts.map