# YAML Lint

> A simple (CLI) tool to lint YAML files

[![Coverage Status](https://coveralls.io/repos/github/rasshofer/yaml-lint/badge.svg?branch=master)](https://coveralls.io/github/rasshofer/yaml-lint?branch=master)

## Usage

```sh
npm install --save-dev yaml-lint
```

```js
const yamlLint = require('yaml-lint');

yamlLint
  .lint('test: 123')
  .then(() => {
    console.log('Valid YAML file.');
  })
  .catch((error) => {
    console.error('Invalid YAML file.', error);
  });
```

## CLI

```sh
npm install -g yaml-lint
```

```sh
yamllint test.yaml
```

## Options

YAML Lint is configured using the following options via a configuration file, environment variables, and/or command-line arguments.

First of all, YAML Lint looks for a JSON file called `.yaml-lint.json` within the current working directory.

```json
{
  "schema": "CORE_SCHEMA",
  "ignore": "dir/*.yaml"
}
```

Afterwards, YAML Lint will take environment variables into account.

```sh
YAMLLINT_SCHEMA=CORE_SCHEMA YAMLLINT_IGNORE=dir/*.yaml yamllint
```

Concluding, YAML Lint will take command-line arguments into account.

```sh
yamllint --schema=CORE_SCHEMA --ignore=dir/*.yaml
```

(All options are merged into a single configuration using the hierarchy described above.)

### `schema` (string)

> Specifies a schema to use

- `DEFAULT_SCHEMA` All supported YAML types
- `FAILSAFE_SCHEMA` Only strings, arrays, and plain objects (<http://www.yaml.org/spec/1.2/spec.html#id2802346>)
- `JSON_SCHEMA` All JSON-supported types (<http://www.yaml.org/spec/1.2/spec.html#id2803231>)
- `CORE_SCHEMA` Same as `JSON_SCHEMA` (<http://www.yaml.org/spec/1.2/spec.html#id2804923>)

### `ignore` (string or array of strings)

> Specifies one or multiple glob patterns to ignore

```sh
yamllint **/*.(yaml|yml) --ignore=foobar.yml --ignore=dir/*.yaml
```

## Changelog

- 1.7.0
  - Fix glob pattern to enforce forward slashes to prevent Windows issues
  - Run tests on different operating systems in CI
- 1.6.0
  - Implement support for multi-document sources
- 1.5.0
  - Add tests for CLI
- 1.4.0
  - Display all failing files instead of only the first best one
- 1.3.0
  - Migrate to TypeScript and update dependencies
- 1.2.4
  - Fix paths for ignored patterns
- 1.2.3
  - Remove `nocase` rule to prevent problems on Windows
- 1.2.2
  - Fix CLI support relative paths
- 1.2.1
  - Fix README
- 1.2.0
  - Add documentation regarding how to specify options
  - Update dependencies
  - Support ignoring specific files
- 1.1.0
  - Update dependencies
  - Migrate syntax to ES2015+
- 1.0.0
  - Update dependencies
  - Enable tests for Node.js 8
  - Remove support for Node.js 0.x
- 0.0.4
  - Print file names when logging YAML errors while using the CLI
- 0.0.3
  - Implement check for empty file selections while using the CLI
- 0.0.2
  - Prettier error messages within CLI
  - Add shebang for CLI
- 0.0.1
  - Initial version

## License

Copyright (c) 2022 [Thomas Rasshofer](https://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.

## Contributors

- [@rasshofer](https://github.com/rasshofer)
- [@sapegin](https://github.com/sapegin)
- [@bendrucker](https://github.com/bendrucker)
- [@PeterDaveHello](https://github.com/PeterDaveHello)
- [@poppinlp](https://github.com/poppinlp)
- [@AndersDJohnson](https://github.com/AndersDJohnson)
