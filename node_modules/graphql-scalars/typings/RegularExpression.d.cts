import { GraphQLScalarType } from 'graphql';
export type RegularExpressionErrorMessageFn = (r: RegExp, v: any) => string;
export interface RegularExpressionOptions {
    errorMessage?: RegularExpressionErrorMessageFn;
    description?: string;
    stringOnly?: boolean;
}
export declare class RegularExpression extends GraphQLScalarType {
    constructor(name: string, regex: RegExp, options?: RegularExpressionOptions);
}
