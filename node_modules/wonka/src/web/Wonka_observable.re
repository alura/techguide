open Wonka_types;
open Wonka_helpers;

let observableSymbol: string = [%raw
  {|
  typeof Symbol === 'function'
    ? Symbol.observable || (Symbol.observable = Symbol('observable'))
    : '@@observable'
|}
];

[@genType.import "../shims/Js.shim"]
type observableSubscriptionT = {. [@bs.meth] "unsubscribe": unit => unit};

[@bs.set_index]
external subscription_set: (observableSubscriptionT, string, bool) => unit;

[@genType.import "../shims/Js.shim"]
type observableObserverT('a) = {
  .
  [@bs.meth] "next": 'a => unit,
  [@bs.meth] "error": Js.Exn.t => unit,
  [@bs.meth] "complete": unit => unit,
};

[@genType.import "../shims/Js.shim"]
type observableT('a) = {
  .
  [@bs.meth] "subscribe": observableObserverT('a) => observableSubscriptionT,
};

type observableFactoryT('a) = (. unit) => observableT('a);

[@bs.get_index]
external observable_get:
  (observableT('a), string) => option(observableFactoryT('a));
[@bs.get_index]
external observable_unsafe_get:
  (observableT('a), string) => observableFactoryT('a);
[@bs.set_index]
external observable_set:
  (observableT('a), string, unit => observableT('a)) => unit;

[@genType]
let fromObservable = (input: observableT('a)): sourceT('a) => {
  let observable =
    switch (input->observable_get(observableSymbol)) {
    | Some(_) => (input->observable_unsafe_get(observableSymbol))(.)
    | None => input
    };

  curry(sink => {
    let observer: observableObserverT('a) =
      [@bs]
      {
        as _;
        pub next = value => sink(. Push(value));
        pub complete = () => sink(. End);
        pub error = _ => ()
      };

    let subscription = observable##subscribe(observer);

    sink(.
      Start(
        (. signal) =>
          switch (signal) {
          | Close => subscription##unsubscribe()
          | _ => ()
          },
      ),
    );
  });
};

type observableStateT = {
  mutable talkback: (. talkbackT) => unit,
  mutable ended: bool,
};

[@genType]
let toObservable = (source: sourceT('a)): observableT('a) => {
  let observable: observableT('a) =
    [@bs]
    {
      as _;
      pub subscribe =
          (_observer: observableObserverT('a)): observableSubscriptionT => {
        let next: (. 'a) => unit = [%raw
          {|
          (typeof _observer === 'object' ? _observer.next.bind(_observer) : _observer) || function () {}
        |}
        ];

        let complete: (. unit) => unit = [%raw
          {|
          (typeof _observer === 'object' ? _observer.complete.bind(_observer) : arguments[2]) || function () {}
        |}
        ];

        let state: observableStateT = {
          talkback: talkbackPlaceholder,
          ended: false,
        };

        source((. signal) =>
          switch (signal) {
          | Start(x) =>
            state.talkback = x;
            x(. Pull);
          | Push(x) when !state.ended =>
            next(. x);
            state.talkback(. Pull);
          | Push(_) => ()
          | End =>
            state.ended = true;
            complete(.);
          }
        );

        let subscription =
          [@bs]
          {
            as self;
            pub unsubscribe = () =>
              if (!state.ended) {
                self->subscription_set("closed", false);
                state.ended = true;
                state.talkback(. Close);
              }
          };

        subscription->subscription_set("closed", false);
        subscription;
      }
    };

  observable->observable_set(observableSymbol, () => observable);
  observable;
};
