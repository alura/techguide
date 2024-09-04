(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.responseIterator = factory());
})(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
      if (key in obj) {
          Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true
          });
      } else {
          obj[key] = value;
      }
      return obj;
  }
  function asyncIterator(source) {
      var iterator = source[Symbol.asyncIterator]();
      return _defineProperty({
          next: function next() {
              return iterator.next();
          }
      }, Symbol.asyncIterator, function() {
          return this;
      });
  }

  var hasIterator$3 = typeof Symbol !== "undefined" && Symbol.asyncIterator;
  /* c8 ignore start */ function nodeStreamIterator(stream) {
      var onData = function onData(chunk) {
          if (error) return;
          if (waiting.length) return waiting.shift()[0]({
              value: chunk,
              done: false
          });
          data.push(chunk);
      };
      var onError = function onError(err) {
          error = err;
          var all = waiting.slice();
          all.forEach(function(pair) {
              pair[1](err);
          });
          !cleanup || cleanup();
      };
      var onEnd = function onEnd() {
          done = true;
          var all = waiting.slice();
          all.forEach(function(pair) {
              pair[0]({
                  value: undefined,
                  done: true
              });
          });
          !cleanup || cleanup();
      };
      var getNext = function getNext() {
          return new Promise(function(resolve, reject) {
              if (error) return reject(error);
              if (data.length) return resolve({
                  value: data.shift(),
                  done: false
              });
              if (done) return resolve({
                  value: undefined,
                  done: true
              });
              waiting.push([
                  resolve,
                  reject
              ]);
          });
      };
      var cleanup = null;
      var error = null;
      var done = false;
      var data = [];
      var waiting = [];
      cleanup = function() {
          cleanup = null;
          stream.removeListener("data", onData);
          stream.removeListener("error", onError);
          stream.removeListener("end", onEnd);
          stream.removeListener("finish", onEnd);
          stream.removeListener("close", onEnd);
      };
      stream.on("data", onData);
      stream.on("error", onError);
      stream.on("end", onEnd);
      stream.on("finish", onEnd);
      stream.on("close", onEnd);
      var iterator = {
          next: function next() {
              return getNext();
          }
      };
      if (hasIterator$3) {
          iterator[Symbol.asyncIterator] = function() {
              return this;
          };
      }
      return iterator;
  }

  var hasIterator$2 = typeof Symbol !== "undefined" && Symbol.asyncIterator;
  /* c8 ignore start */ function promiseIterator(promise) {
      var resolved = false;
      var iterator = {
          next: function next() {
              if (resolved) return Promise.resolve({
                  value: undefined,
                  done: true
              });
              resolved = true;
              return new Promise(function(resolve, reject) {
                  promise.then(function(value) {
                      resolve({
                          value: value,
                          done: false
                      });
                  }).catch(reject);
              });
          }
      };
      if (hasIterator$2) {
          iterator[Symbol.asyncIterator] = function() {
              return this;
          };
      }
      return iterator;
  }

  var hasIterator$1 = typeof Symbol !== "undefined" && Symbol.asyncIterator;
  /* c8 ignore start */ function readerIterator(reader) {
      var iterator = {
          next: function next() {
              return reader.read();
          }
      };
      if (hasIterator$1) {
          iterator[Symbol.asyncIterator] = function() {
              return this;
          };
      }
      return iterator;
  }

  // @ts-ignore
  var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
  /**
   * @param response A response. Supports fetch, node-fetch, and cross-fetch
   */ function responseIterator(response) {
      if (response === undefined) throw new Error("Missing response for responseIterator");
      // determine the body
      var body = response;
      if (response.body) body = response.body;
      else if (response.data) body = response.data;
      else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch
      /* c8 ignore stop */ // adapt the body
      if (hasIterator && body[Symbol.asyncIterator]) return asyncIterator(body);
      /* c8 ignore start */ if (body.getReader) return readerIterator(body.getReader());
      if (body.stream) return readerIterator(body.stream().getReader());
      if (body.arrayBuffer) return promiseIterator(body.arrayBuffer());
      if (body.pipe) return nodeStreamIterator(body);
      /* c8 ignore stop */ throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
  }

  return responseIterator;

}));
//# sourceMappingURL=response-iterator.js.map
