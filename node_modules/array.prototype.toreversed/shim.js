'use strict';

var define = require('define-properties');
var shimUnscopables = require('es-shim-unscopables');

var getPolyfill = require('./polyfill');

module.exports = function shim() {
	var polyfill = getPolyfill();

	define(
		Array.prototype,
		{ toReversed: polyfill },
		{ toReversed: function () { return Array.prototype.toReversed !== polyfill; } }
	);

	shimUnscopables('toReversed');

	return polyfill;
};
