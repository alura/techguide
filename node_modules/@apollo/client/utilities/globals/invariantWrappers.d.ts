import { InvariantError } from "ts-invariant";
import type { ErrorCodes } from "../../invariantErrorCodes.js";
type LogFunction = {
    /**
     * Logs a `$level` message if the user used `ts-invariant`'s `setVerbosity` to set
     * a verbosity level of `$level` or lower. (defaults to `"log"`).
     *
     * The user will either be presented with a link to the documentation for the message,
     * or they can use the `loadDevMessages` to add the message strings to the bundle.
     * The documentation will display the message without argument substitution.
     * Instead, the arguments will be printed on the console after the link.
     *
     * `message` can only be a string, a concatenation of strings, or a ternary statement
     * that results in a string. This will be enforced on build, where the message will
     * be replaced with a message number.
     *
     * String substitutions like %s, %o, %d or %f are supported.
     */
    (message?: any, ...optionalParams: unknown[]): void;
};
type WrappedInvariant = {
    /**
     * Throws and InvariantError with the given message if the condition is false.
     *
     * `message` can only be a string, a concatenation of strings, or a ternary statement
     * that results in a string. This will be enforced on build, where the message will
     * be replaced with a message number.
     *
     * The user will either be presented with a link to the documentation for the message,
     * or they can use the `loadErrorMessages` to add the message strings to the bundle.
     * The documentation will display the message with the arguments substituted.
     *
     * String substitutions with %s are supported and will also return
     * pretty-stringified objects.
     * Excess `optionalParams` will be swallowed.
     */
    (condition: any, message?: string | number, ...optionalParams: unknown[]): asserts condition;
    debug: LogFunction;
    log: LogFunction;
    warn: LogFunction;
    error: LogFunction;
};
declare const invariant: WrappedInvariant;
/**
 * Returns an InvariantError.
 *
 * `message` can only be a string, a concatenation of strings, or a ternary statement
 * that results in a string. This will be enforced on build, where the message will
 * be replaced with a message number.
 * String substitutions with %s are supported and will also return
 * pretty-stringified objects.
 * Excess `optionalParams` will be swallowed.
 */
declare function newInvariantError(message?: string | number, ...optionalParams: unknown[]): InvariantError;
declare const ApolloErrorMessageHandler: unique symbol;
declare global {
    interface Window {
        [ApolloErrorMessageHandler]?: {
            (message: string | number, args: string[]): string | undefined;
        } & ErrorCodes;
    }
}
export { invariant, InvariantError, newInvariantError, ApolloErrorMessageHandler, };
//# sourceMappingURL=invariantWrappers.d.ts.map