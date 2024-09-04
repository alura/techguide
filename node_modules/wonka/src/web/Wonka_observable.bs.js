

import * as Block from "bs-platform/lib/es6/block.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Wonka_helpers from "../helpers/Wonka_helpers.bs.js";

var observableSymbol = (typeof Symbol === 'function'
    ? Symbol.observable || (Symbol.observable = Symbol('observable'))
    : '@@observable');

function fromObservable(input) {
  var match = input[observableSymbol];
  var observable = match !== undefined ? input[observableSymbol]() : input;
  return (function (sink) {
      var observer = {
        next: (function (value) {
            return sink(/* Push */Block.__(1, [value]));
          }),
        complete: (function () {
            return sink(/* End */0);
          }),
        error: (function (param) {
            
          })
      };
      var subscription = observable.subscribe(observer);
      return sink(/* Start */Block.__(0, [(function (signal) {
                        if (signal) {
                          return subscription.unsubscribe();
                        }
                        
                      })]));
    });
}

function toObservable(source) {
  var observable = {
    subscribe: (function (_observer) {
        var next = ((typeof _observer === 'object' ? _observer.next.bind(_observer) : _observer) || function () {});
        var complete = ((typeof _observer === 'object' ? _observer.complete.bind(_observer) : arguments[2]) || function () {});
        var state = {
          talkback: Wonka_helpers.talkbackPlaceholder,
          ended: false
        };
        Curry._1(source, (function (signal) {
                if (typeof signal === "number") {
                  state.ended = true;
                  return complete();
                }
                if (signal.tag) {
                  if (!state.ended) {
                    next(signal[0]);
                    return state.talkback(/* Pull */0);
                  } else {
                    return ;
                  }
                }
                var x = signal[0];
                state.talkback = x;
                return x(/* Pull */0);
              }));
        var subscription = {
          unsubscribe: (function () {
              var self = this ;
              if (!state.ended) {
                self["closed"] = false;
                state.ended = true;
                return state.talkback(/* Close */1);
              }
              
            })
        };
        subscription["closed"] = false;
        return subscription;
      })
  };
  observable[observableSymbol] = (function (param) {
      return observable;
    });
  return observable;
}

export {
  observableSymbol ,
  fromObservable ,
  toObservable ,
  
}
/* observableSymbol Not a pure module */
