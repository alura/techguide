# CORS middleware for Micro

### Summary

Simple [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) middleware for Zeit's [Micro](https://github.com/zeit/micro)

[![CircleCI](https://circleci.com/gh/possibilities/micro-cors.svg?style=svg)](https://circleci.com/gh/possibilities/micro-cors)

### Install

```
yarn add micro-cors
```

### Usage

Basic

```js
const cors = require('micro-cors')()
const handler = (req, res) => send(res, 200, 'ok!')

module.exports = cors(handler)
```

With options

```js
const microCors = require('micro-cors')
const cors = microCors({ allowMethods: ['PUT', 'POST'] })
const handler = (req, res) => send(res, 200, 'ok!')

module.exports = cors(handler)
```

#### Options

##### `allowMethods`

default: `['POST','GET','PUT','PATCH','DELETE','OPTIONS']`

##### `allowHeaders`

default: `['X-Requested-With','Access-Control-Allow-Origin','X-HTTP-Method-Override','Content-Type','Authorization','Accept']`

##### `allowCredentials`

default: `true`

##### `exposeHeaders`

default: `[]`

##### `maxAge`

default: `86400`

##### `origin`

default: `*`
