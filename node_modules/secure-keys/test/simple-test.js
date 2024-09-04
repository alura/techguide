'use strict';

var fs = require('fs');
var path = require('path');
var assume = require('assume');
var Secure = require('..');

describe('secure-keys', function () {
  var sec = new Secure(fs.readFileSync(path.join(__dirname, 'test.secret.key'), 'utf8'));

  it('should encrypt and decrypt the values', function () {
    var test = {
      well: 'i am',
      some: 'object',
      that: 'is very sad'
    };

    var encrypted = sec.encrypt(test);
    Object.keys(test).forEach(function (key) {
      assume(encrypted[key]).exists();
      assume(encrypted[key]).is.an('object');
      assume(encrypted[key].value).is.a('string');
      assume(encrypted[key].alg).is.equal('aes-256-ctr');
    });

    var decrypted = sec.decrypt(encrypted);
    assume(decrypted).is.eql(test);
  });
});
