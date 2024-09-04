declare type Style = string | Partial<CSSStyleDeclaration>;
/**
 * Converts a CSS Style string
 * @param {string | Partial<CSSStyleDeclaration>} style A string to convert, or object to return
 * @returns {Partial<CSSStyleDeclaration>} a partial CSSStyleDeclaration
 */
export declare const parseStyle: (style: Style) => Partial<CSSStyleDeclaration> | undefined;
export {};
