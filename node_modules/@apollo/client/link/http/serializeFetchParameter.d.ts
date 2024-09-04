import type { InvariantError } from "../../utilities/globals/index.js";
export type ClientParseError = InvariantError & {
    parseError: Error;
};
export declare const serializeFetchParameter: (p: any, label: string) => string;
//# sourceMappingURL=serializeFetchParameter.d.ts.map