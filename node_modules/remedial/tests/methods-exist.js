(function () {
  require('../lib/remedial');

  if ('undefined' === typeof isEmpty) {
    console.log('isEmpty fail');
  }
  if ('undefined' === typeof typeOf) {
    console.log('typeOf fail');
  }
  if ('undefined' === typeof String.prototype.entityify) {
    console.log('entityify fail');
  }
  if ('undefined' === typeof String.prototype.quote) {
    console.log('quote fail');
  }
  if ('undefined' === typeof String.prototype.supplant) {
    console.log('supplant fail');
  }

}());
