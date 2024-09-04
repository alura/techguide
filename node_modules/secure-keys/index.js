'use strict';

var crypto = require('crypto');

var json = {
  stringify: function (obj, replacer, spacing) {
    return JSON.stringify(obj, replacer || null, spacing || 2)
  },
  parse: JSON.parse
};

module.exports = Secure;
/**
 * @constructor
 * Simple Object used to serialize and deserialize
 */
function Secure(opts) {
  opts = opts || {};
  this.secret = typeof opts !== 'string'
    ? opts.secret
    : opts;

  this.format = opts.format || json;
  this.alg = opts.alg || 'aes-256-ctr';

  if (!this.secret) throw new Error('Secret is a required option');
}

Secure.prototype.encrypt = function encrypt(data, callback) {
  var self = this;

  return Object.keys(data).reduce(function (acc, key) {
    var value = self.format.stringify(data[key]);
    acc[key] = {
      alg: self.alg,
      value: cipherConvert(value, {
        alg: self.alg,
        secret: self.secret,
        encs: { input: 'utf8', output: 'hex' }
      })
    };

    return acc;
  }, {});

 };

Secure.prototype.decrypt = function decrypt(data, callback) {
  var self = this;

  return Object.keys(data).reduce(function (acc, key) {
    var decrypted = cipherConvert(data[key].value, {
      alg: data[key].alg || self.alg,
      secret: self.secret,
      encs: { input: 'hex', output: 'utf8' }
    });

    acc[key] = self.format.parse(decrypted);
    return acc;
  }, {});

 };

//
// ### function cipherConvert (contents, opts)
// Returns the result of the cipher operation
// on the contents contents.
//
function cipherConvert(contents, opts) {
  var encs = opts.encs;
  var cipher = crypto.createCipher(opts.alg, opts.secret);
  return cipher.update(contents, encs.input, encs.output)
    + cipher.final(encs.output);
}
