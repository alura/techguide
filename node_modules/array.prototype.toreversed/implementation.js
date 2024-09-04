'use strict';

var ArrayCreate = require('es-abstract/2023/ArrayCreate');
var CreateDataPropertyOrThrow = require('es-abstract/2023/CreateDataPropertyOrThrow');
var Get = require('es-abstract/2023/Get');
var LengthOfArrayLike = require('es-abstract/2023/LengthOfArrayLike');
var ToObject = require('es-abstract/2023/ToObject');
var ToString = require('es-abstract/2023/ToString');

module.exports = function toReversed() {
	var O = ToObject(this); // step 1
	var len = LengthOfArrayLike(O); // step 2
	var A = ArrayCreate(len); // step 3
	var k = 0; // step 4
	while (k < len) { // step 5
		var from = ToString(len - k - 1);
		var Pk = ToString(k);
		var fromValue = Get(O, from);
		CreateDataPropertyOrThrow(A, Pk, fromValue);
		k += 1;
	}
	return A; // step 6
};
