import type { Body } from "./selectHttpOptionsAndBody.js";
export declare function rewriteURIForGET(chosenURI: string, body: Body): {
    parseError: unknown;
    newURI?: undefined;
} | {
    newURI: string;
    parseError?: undefined;
};
//# sourceMappingURL=rewriteURIForGET.d.ts.map