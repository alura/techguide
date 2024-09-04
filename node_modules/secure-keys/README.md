# secure-keys

[![build
status](https://travis-ci.org/jcrugzz/secure-keys.svg?branch=master)](http://travis-ci.org/jcrugzz/secure-keys)

A simple module that encrypts/decrypts the keys of a given object

## install
```sh
npm i secure-keys --save
```

## usage

```js

var SecK = require('secure-keys');

var sec = new SecK({
  secret: 'BEGIN RSA', // Text of key used for encrypting/decrypting
  format: JSON, // optional (defaults to JSON): An object with `stringify` and `parse` methods
  alg: 'aes-256-ctr' //optional (this is default) Algorithm to use for encrypt/decrypt
});

var encryptedObj = sec.encrypt({
  myConfig: 'values',
  needTo: 'be safe'
});

var decryptedObj = sec.decrypt(encryptedObj);
```

## LICENSE
MIT

---------------

This code was yanked out of work by
[@indexzero](https://github.com/indexzero) for
[`nconf`](https://github.com/indexzero/nconf)
