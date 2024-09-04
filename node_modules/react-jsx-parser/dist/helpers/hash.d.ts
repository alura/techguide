/**
 * Hashes a value
 * @param value the value to hash
 * @param radix the base-n to hash into (default 16)
 */
export declare const hash: (value?: string, radix?: number) => string;
/**
 * Hashes a Math.random() value, returning it in base16
 */
export declare const randomHash: () => string;
