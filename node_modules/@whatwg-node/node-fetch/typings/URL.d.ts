import FastUrl from 'fast-url-parser';
import { PonyfillURLSearchParams } from './URLSearchParams.js';
export declare class PonyfillURL extends FastUrl implements URL {
    constructor(url: string, base?: string | URL);
    get origin(): string;
    private _searchParams?;
    get searchParams(): PonyfillURLSearchParams;
    get username(): string;
    set username(value: string);
    get password(): string;
    set password(value: string);
    toString(): string;
    toJSON(): string;
}
