# Logger interface

> ```
> interface Logger {
>   debug(message?: any): void;
>   info(message?: any): void;
>   warn(message?: any): void;
>   error(message?: any): void;
> }
> ```

This generic interface for loggers supports logging a string at one of four different levels (`debug`, `info`, `warn`, `error`). It's designed to be compatible with Node's `console` as well as commonly used logging packages and is tested against a few of them. Below are the logging libraries we test for compatibility against.

## bunyan

```
const logger = bunyan.createLogger();
```

## log4js

```
const logger = log4js.getLogger();
```

## loglevel

```
const logger = loglevel.getLogger();
```

## winston

```
const logger = winston.createLogger();
```
