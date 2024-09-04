declare enum VALUE_RANGES {
    NEGATIVE = 0,
    NON_NEGATIVE = 1,
    POSITIVE = 2,
    NON_POSITIVE = 3
}
declare enum VALUE_TYPES {
    INT = 0,
    FLOAT = 1
}
declare const VALIDATIONS: {
    NonPositiveInt: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
    PositiveInt: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
    NonNegativeInt: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
    NegativeInt: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
    NonPositiveFloat: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
    PositiveFloat: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
    NonNegativeFloat: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
    NegativeFloat: {
        range: VALUE_RANGES;
        type: VALUE_TYPES;
    };
};
export declare function processValue(value: any, scalarName: keyof typeof VALIDATIONS): number;
/**
 * Check if the value is in decimal format.
 *
 * @param value - Value to check
 * @returns True if is decimal, false otherwise
 */
export declare function isDecimal(value: any): boolean;
/**
 * Check if the value is in sexagesimal format.
 *
 * @param value - Value to check
 * @returns True if sexagesimal, false otherwise
 */
export declare function isSexagesimal(value: any): boolean;
/**
 * Converts a sexagesimal coordinate to decimal format.
 *
 * @param value - Value to convert
 * @returns Decimal coordinate
 * @throws {TypeError} if the value is not in sexagesimal format
 */
export declare function sexagesimalToDecimal(value: any): number;
export declare function isObjectLike(value: unknown): value is {
    [key: string]: unknown;
};
export declare function serializeObject(outputValue: unknown): unknown;
export {};
