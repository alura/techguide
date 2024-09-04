/**
 * Represents a generic logger that could be a simple console, bunyan etc.
 */
export interface Logger {
  trace(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  [x: string]: any;
}

/**
 * Dummy logger that does not do anything.
 *
 * Useful as a default for some library that the user might want to get logs out of.
 */
export const dummyLogger: Logger = {
  trace: (_message?: any, ..._optionalParams: any[]) => {},
  debug: (_message?: any, ..._optionalParams: any[]) => {},
  info: (_message?: any, ..._optionalParams: any[]) => {},
  warn: (_message?: any, ..._optionalParams: any[]) => {},
  error: (_message?: any, ..._optionalParams: any[]) => {},
};
