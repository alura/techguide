import FastQuerystring from 'fast-querystring';
import FastUrl from 'fast-url-parser';
import { PonyfillURLSearchParams } from './URLSearchParams.js';
FastUrl.queryString = FastQuerystring;
export class PonyfillURL extends FastUrl {
    constructor(url, base) {
        super();
        if (url.startsWith('data:')) {
            this.protocol = 'data:';
            this.pathname = url.slice('data:'.length);
            return;
        }
        this.parse(url, false);
        if (base) {
            const baseParsed = typeof base === 'string' ? new PonyfillURL(base) : base;
            this.protocol = this.protocol || baseParsed.protocol;
            this.host = this.host || baseParsed.host;
            this.pathname = this.pathname || baseParsed.pathname;
        }
    }
    get origin() {
        return `${this.protocol}//${this.host}`;
    }
    get searchParams() {
        if (!this._searchParams) {
            this._searchParams = new PonyfillURLSearchParams(this.query);
        }
        return this._searchParams;
    }
    get username() {
        var _a;
        return ((_a = this.auth) === null || _a === void 0 ? void 0 : _a.split(':')[0]) || '';
    }
    set username(value) {
        this.auth = `${value}:${this.password}`;
    }
    get password() {
        var _a;
        return ((_a = this.auth) === null || _a === void 0 ? void 0 : _a.split(':')[1]) || '';
    }
    set password(value) {
        this.auth = `${this.username}:${value}`;
    }
    toString() {
        return this.format();
    }
    toJSON() {
        return this.toString();
    }
}
