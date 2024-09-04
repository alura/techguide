(function () {
  require('../lib/remedial');
  var n = null,
    u;

  if (
    'object' === typeOf(Object.create([])) &&
    'object' === typeOf(Object.create(function () {})) &&
    'array' === typeOf([]) &&
    'string' === typeOf('') &&
    'regexp' === typeOf(/ /) &&
    'number' === typeOf(0) &&
    'function' === typeOf(function () {}) &&
    'function' === typeOf((function () {
      var a = function () {}; 
      a.foo = 'bar';
      return a;
    }())) &&
    'boolean' === typeOf(true) &&
    'boolean' === typeOf(false) &&
    'date' === typeOf(new Date()) &&
    'undefined' === typeOf(u) &&
    'undefined' === typeOf(undefined) &&
    'null' === typeOf(n) &&
    'object' === typeOf({})
      ) {
    console.log('passed type detections')
  } else {
    console.log('failed type detections')
  }
}());
