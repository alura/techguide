export interface Logger {
  debug(message?: any): void;
  info(message?: any): void;
  warn(message?: any): void;
  error(message?: any): void;
}
