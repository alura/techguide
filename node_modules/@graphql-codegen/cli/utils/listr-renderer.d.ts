import { ListrTask } from 'listr';
import { DetailedError } from '@graphql-codegen/plugin-helpers';
export declare class Renderer {
    private updateRenderer;
    constructor(tasks: ListrTask, options: any);
    render(): any;
    end(err: Error & {
        errors?: (Error | DetailedError)[];
        details?: string;
    }): void;
}
export declare class ErrorRenderer {
    private tasks;
    constructor(tasks: any, _options: any);
    render(): void;
    static get nonTTY(): boolean;
    end(): void;
}
