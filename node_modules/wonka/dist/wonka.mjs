function l(a, b) {
  b.tag = a;
  return b;
}

function m() {}

function p(a) {
  return function (b) {
    var c = a.length;
    let d = !1,
      e = !1,
      f = !1,
      g = 0;
    b(
      l(0, [
        function (h) {
          if (h) {
            d = !0;
          } else if (e) {
            f = !0;
          } else {
            for (e = f = !0; f && !d; ) {
              g < c ? ((h = a[g]), (g = (g + 1) | 0), (f = !1), b(l(1, [h]))) : ((d = !0), b(0));
            }
            e = !1;
          }
        },
      ])
    );
  };
}

function r() {}

function t(a) {
  a(0);
}

function u(a) {
  let b = !1;
  a(
    l(0, [
      function (c) {
        c ? (b = !0) : b || a(0);
      },
    ])
  );
}

function w(a) {
  if (void 0 === a) {
    return ((a = [v, 0]).tag = 256), a;
  }
  if (null === a || a[0] !== v) {
    return a;
  }
  (a = [v, (a[1] + 1) | 0]).tag = 256;
  return a;
}

function x(a) {
  if (null === a || a[0] !== v) {
    return a;
  }
  if (0 !== (a = a[1])) {
    return [v, (a - 1) | 0];
  }
}

function z(a) {
  return function (b) {
    return function (c) {
      function d(b) {
        'number' == typeof b
          ? k &&
            ((k = !1),
            void 0 !== (b = e.shift())
              ? ((b = a(x(b))), (k = !0), b(d))
              : q
              ? c(0)
              : g || ((g = !0), f(0)))
          : b.tag
          ? k && (c(b), n ? (n = !1) : h(0))
          : ((h = b = b[0]), (n = !1), b(0));
      }
      let e = [],
        f = m,
        g = !1,
        h = m,
        k = !1,
        n = !1,
        q = !1;
      b(function (b) {
        'number' == typeof b
          ? q || ((q = !0), k || 0 !== e.length || c(0))
          : b.tag
          ? q || ((b = b[0]), (g = !1), k ? e.push(b) : ((b = a(b)), (k = !0), b(d)))
          : (f = b[0]);
      });
      c(
        l(0, [
          function (c) {
            if (c) {
              if ((q || ((q = !0), f(1)), k)) {
                return (k = !1), h(1);
              }
            } else {
              q || g || ((g = !0), f(0)), k && !n && ((n = !0), h(0));
            }
          },
        ])
      );
    };
  };
}

function A(a) {
  return a;
}

function B(a) {
  return a;
}

function C(a) {
  return a(0);
}

function D(a) {
  return function (b) {
    return function (c) {
      let e = m,
        f = !1,
        g = [],
        h = !1;
      b(function (b) {
        'number' == typeof b
          ? h || ((h = !0), 0 === g.length && c(0))
          : b.tag
          ? h ||
            ((f = !1),
            (function (a) {
              function b(a) {
                'number' == typeof a
                  ? 0 !== g.length &&
                    ((g = g.filter(d)),
                    (a = 0 === g.length),
                    h && a ? c(0) : !f && a && ((f = !0), e(0)))
                  : a.tag
                  ? 0 !== g.length && (c(l(1, [a[0]])), k(0))
                  : ((k = a = a[0]), (g = g.concat(a)), a(0));
              }
              function d(a) {
                return a !== k;
              }
              let k = m;
              1 === a.length ? a(b) : a.bind(null, b);
            })(a(b[0])),
            f || ((f = !0), e(0)))
          : (e = b[0]);
      });
      c(
        l(0, [
          function (a) {
            a
              ? (h || ((h = !0), e(a)),
                g.forEach(function (c) {
                  return c(a);
                }),
                (g = []))
              : (f || h ? (f = !1) : ((f = !0), e(0)), g.forEach(C));
          },
        ])
      );
    };
  };
}

function E(a) {
  return a;
}

function F(a) {
  return a;
}

function G(a) {
  return D(F)(a);
}

function H(a) {
  return function (b) {
    return function (c) {
      let d = !1;
      return b(function (e) {
        if ('number' == typeof e) {
          d || ((d = !0), c(e));
        } else if (e.tag) {
          d || (a(e[0]), c(e));
        } else {
          var g = e[0];
          c(
            l(0, [
              function (a) {
                if (!d) {
                  return a && (d = !0), g(a);
                }
              },
            ])
          );
        }
      });
    };
  };
}

function J(a) {
  a(0);
}

function K(a) {
  return function (b) {
    return function (c) {
      function d(a) {
        h &&
          ('number' == typeof a
            ? ((h = !1), n ? c(a) : f || ((f = !0), e(0)))
            : a.tag
            ? (c(a), k ? (k = !1) : g(0))
            : ((g = a = a[0]), (k = !1), a(0)));
      }
      let e = m,
        f = !1,
        g = m,
        h = !1,
        k = !1,
        n = !1;
      b(function (b) {
        'number' == typeof b
          ? n || ((n = !0), h || c(0))
          : b.tag
          ? n ||
            (h && (g(1), (g = m)), f ? (f = !1) : ((f = !0), e(0)), (b = a(b[0])), (h = !0), b(d))
          : (e = b[0]);
      });
      c(
        l(0, [
          function (a) {
            if (a) {
              if ((n || ((n = !0), e(1)), h)) {
                return (h = !1), g(1);
              }
            } else {
              n || f || ((f = !0), e(0)), h && !k && ((k = !0), g(0));
            }
          },
        ])
      );
    };
  };
}

function L(a) {
  return a;
}

function M(a) {
  return function (b) {
    return function (c) {
      let d = [],
        e = m;
      return b(function (b) {
        'number' == typeof b
          ? p(d)(c)
          : b.tag
          ? (d.length >= a && 0 < a && d.shift(), d.push(b[0]), e(0))
          : ((b = b[0]), 0 >= a ? (b(1), u(c)) : ((e = b), b(0)));
      });
    };
  };
}

function N(a) {
  return function (b) {
    let c = m,
      d = !1;
    b(function (e) {
      'number' == typeof e ? (d = !0) : e.tag ? d || (a(e[0]), c(0)) : ((c = e = e[0]), e(0));
    });
    return {
      unsubscribe: function () {
        if (!d) {
          return (d = !0), c(1);
        }
      },
    };
  };
}

function O() {}

function Q() {}

function R() {}

function S() {}

function buffer$1(a) {
  return function (b) {
    return function (c) {
      function d(a) {
        'number' == typeof a
          ? k || ((k = !0), f(1), 0 < e.length && c(l(1, [e])), c(0))
          : a.tag
          ? !k && 0 < e.length && ((a = e), (e = []), c(l(1, [a])))
          : (g = a[0]);
      }
      let e = [],
        f = m,
        g = m,
        h = !1,
        k = !1;
      b(function (b) {
        'number' == typeof b
          ? k || ((k = !0), g(1), 0 < e.length && c(l(1, [e])), c(0))
          : b.tag
          ? k || (e.push(b[0]), h ? (h = !1) : ((h = !0), f(0), g(0)))
          : ((f = b[0]), a(d));
      });
      c(
        l(0, [
          function (a) {
            if (!k) {
              if (a) {
                return (k = !0), f(1), g(1);
              }
              if (!h) {
                return (h = !0), f(0), g(0);
              }
            }
          },
        ])
      );
    };
  };
}

function combine$1(a, b) {
  return (function (a, b) {
    return function (c) {
      let d = m,
        e = m,
        f = void 0,
        g = void 0,
        h = !1,
        k = 0,
        n = !1;
      a(function (a) {
        var b = g;
        'number' == typeof a
          ? 1 > k
            ? (k = (k + 1) | 0)
            : n || ((n = !0), c(0))
          : a.tag
          ? ((a = a[0]),
            void 0 !== b
              ? n || ((f = w(a)), (h = !1), c(l(1, [[a, x(b)]])))
              : ((f = w(a)), h ? (h = !1) : e(0)))
          : (d = a[0]);
      });
      b(function (a) {
        var b = f;
        'number' == typeof a
          ? 1 > k
            ? (k = (k + 1) | 0)
            : n || ((n = !0), c(0))
          : a.tag
          ? ((a = a[0]),
            void 0 !== b
              ? n || ((g = w(a)), (h = !1), c(l(1, [[x(b), a]])))
              : ((g = w(a)), h ? (h = !1) : d(0)))
          : (e = a[0]);
      });
      c(
        l(0, [
          function (c) {
            if (!n) {
              if (c) {
                return (n = !0), d(1), e(1);
              }
              if (!h) {
                return (h = !0), d(c), e(c);
              }
            }
          },
        ])
      );
    };
  })(a, b);
}

function concat$1(a) {
  return z(B)(p(a));
}

function concatAll$1(a) {
  return z(A)(a);
}

function debounce$1(a) {
  return function (b) {
    return function (c) {
      function d() {
        var a = e;
        void 0 !== a && ((e = void 0), clearTimeout(x(a)));
      }
      let e = void 0,
        f = !1,
        g = !1;
      return b(function (b) {
        if ('number' == typeof b) {
          g || ((g = !0), void 0 !== e ? (f = !0) : c(0));
        } else if (b.tag) {
          g ||
            (d(),
            (e = w(
              setTimeout(function () {
                e = void 0;
                c(b);
                f && c(0);
              }, a(b[0]))
            )));
        } else {
          var n = b[0];
          c(
            l(0, [
              function (a) {
                if (!g) {
                  return a ? ((g = !0), (f = !1), d(), n(1)) : n(0);
                }
              },
            ])
          );
        }
      });
    };
  };
}

function delay$1(a) {
  return function (b) {
    return function (c) {
      let d = 0;
      return b(function (b) {
        'number' == typeof b || b.tag
          ? ((d = (d + 1) | 0),
            setTimeout(function () {
              0 !== d && ((d = (d - 1) | 0), c(b));
            }, a))
          : c(b);
      });
    };
  };
}

function filter$1(a) {
  return function (b) {
    return function (c) {
      let d = m;
      return b(function (b) {
        'number' == typeof b ? c(b) : b.tag ? (a(b[0]) ? c(b) : d(0)) : ((d = b[0]), c(b));
      });
    };
  };
}

function forEach$1(a) {
  return function (b) {
    N(a)(b);
  };
}

function fromCallbag$2(a) {
  return function (b) {
    function c(a, c) {
      switch (a) {
        case 0:
          b(
            l(0, [
              function (a) {
                return a ? c(2) : c(1);
              },
            ])
          );
          break;

        case 1:
          b(l(1, [c]));
          break;

        case 2:
          b(0);
      }
    }
    return 2 === a.length ? a(0, c) : a.bind(null, 0, c);
  };
}

function fromDomEvent$1(a, b) {
  return (function (a, b) {
    return function (c) {
      function d(a) {
        c(l(1, [a]));
      }
      c(
        l(0, [
          function (c) {
            c && a.removeEventListener(b, d);
          },
        ])
      );
      a.addEventListener(b, d);
    };
  })(a, b);
}

function fromList$1(a) {
  return function (b) {
    let c = !1,
      d = !1,
      e = !1,
      f = a;
    b(
      l(0, [
        function (a) {
          if (a) {
            c = !0;
          } else if (d) {
            e = !0;
          } else {
            for (d = e = !0; e && !c; ) {
              (a = f) ? ((f = a[1]), (e = !1), b(l(1, [a[0]]))) : ((c = !0), b(0));
            }
            d = !1;
          }
        },
      ])
    );
  };
}

function fromObservable$2(a) {
  var b = void 0 !== a[P] ? a[P]() : a;
  return function (a) {
    var c = b.subscribe({
      next: function (c) {
        a(l(1, [c]));
      },
      complete: function () {
        a(0);
      },
      error: Q,
    });
    a(
      l(0, [
        function (a) {
          if (a) {
            return c.unsubscribe();
          }
        },
      ])
    );
  };
}

function fromPromise$1(a) {
  return function (b) {
    let c = !1;
    a.then(function (a) {
      c || (b(l(1, [a])), b(0));
      return Promise.resolve(void 0);
    });
    b(
      l(0, [
        function (a) {
          a && (c = !0);
        },
      ])
    );
  };
}

function fromValue$1(a) {
  return function (b) {
    let c = !1;
    b(
      l(0, [
        function (d) {
          d ? (c = !0) : c || ((c = !0), b(l(1, [a])), b(0));
        },
      ])
    );
  };
}

function interval$1(a) {
  return function (b) {
    let c = 0;
    var d = setInterval(function () {
      var a = c;
      c = (c + 1) | 0;
      b(l(1, [a]));
    }, a);
    b(
      l(0, [
        function (a) {
          a && clearInterval(d);
        },
      ])
    );
  };
}

function make$1(a) {
  return function (b) {
    let c = r,
      d = !1;
    c = a({
      next: function (a) {
        d || b(l(1, [a]));
      },
      complete: function () {
        d || ((d = !0), b(0));
      },
    });
    b(
      l(0, [
        function (a) {
          if (a && !d) {
            return (d = !0), c();
          }
        },
      ])
    );
  };
}

function makeSubject$1() {
  let a = [],
    b = !1;
  return {
    source: function (c) {
      function b(a) {
        return a !== c;
      }
      a = a.concat(c);
      c(
        l(0, [
          function (c) {
            c && (a = a.filter(b));
          },
        ])
      );
    },
    next: function (c) {
      b ||
        a.forEach(function (a) {
          a(l(1, [c]));
        });
    },
    complete: function () {
      b || ((b = !0), a.forEach(t));
    },
  };
}

function map$1(a) {
  return function (b) {
    return function (c) {
      return b(function (b) {
        b = 'number' == typeof b ? 0 : b.tag ? l(1, [a(b[0])]) : l(0, [b[0]]);
        c(b);
      });
    };
  };
}

function merge$1(a) {
  return D(E)(p(a));
}

function never$1(a) {
  a(l(0, [m]));
}

function onEnd$1(a) {
  return function (b) {
    return function (c) {
      let d = !1;
      return b(function (b) {
        if ('number' == typeof b) {
          if (d) {
            return;
          }
          d = !0;
          c(b);
          return a();
        }
        if (b.tag) {
          d || c(b);
        } else {
          var e = b[0];
          c(
            l(0, [
              function (c) {
                if (!d) {
                  return c ? ((d = !0), e(c), a()) : e(c);
                }
              },
            ])
          );
        }
      });
    };
  };
}

function onStart$1(a) {
  return function (b) {
    return function (c) {
      return b(function (b) {
        'number' == typeof b ? c(b) : b.tag ? c(b) : (c(b), a());
      });
    };
  };
}

function pipe() {
  for (var a = arguments, b = arguments[0], c = 1, d = arguments.length; c < d; c++) {
    b = a[c](b);
  }
  return b;
}

function publish$1(a) {
  return N(O)(a);
}

function sample$1(a) {
  return function (b) {
    return function (c) {
      let d = m,
        e = m,
        f = void 0,
        g = !1,
        h = !1;
      b(function (a) {
        'number' == typeof a
          ? h || ((h = !0), e(1), c(0))
          : a.tag
          ? ((f = w(a[0])), g ? (g = !1) : ((g = !0), e(0), d(0)))
          : (d = a[0]);
      });
      a(function (a) {
        var b = f;
        'number' == typeof a
          ? h || ((h = !0), d(1), c(0))
          : a.tag
          ? void 0 === b || h || ((f = void 0), c(l(1, [x(b)])))
          : (e = a[0]);
      });
      c(
        l(0, [
          function (a) {
            if (!h) {
              if (a) {
                return (h = !0), d(1), e(1);
              }
              if (!g) {
                return (g = !0), d(0), e(0);
              }
            }
          },
        ])
      );
    };
  };
}

function scan$1(a, b) {
  return (function (a, b) {
    return function (c) {
      return function (d) {
        let e = b;
        return c(function (c) {
          'number' == typeof c
            ? (c = 0)
            : c.tag
            ? ((e = a(e, c[0])), (c = l(1, [e])))
            : (c = l(0, [c[0]]));
          d(c);
        });
      };
    };
  })(a, b);
}

function share$1(a) {
  function b(a) {
    'number' == typeof a
      ? (c.forEach(J), (c = []))
      : a.tag
      ? ((e = !1),
        c.forEach(function (b) {
          b(a);
        }))
      : (d = a[0]);
  }
  let c = [],
    d = m,
    e = !1;
  return function (f) {
    function g(a) {
      return a !== f;
    }
    c = c.concat(f);
    1 === c.length && a(b);
    f(
      l(0, [
        function (a) {
          if (a) {
            if (((c = c.filter(g)), 0 === c.length)) {
              return d(1);
            }
          } else {
            e || ((e = !0), d(a));
          }
        },
      ])
    );
  };
}

function skip$1(a) {
  return function (b) {
    return function (c) {
      let d = m,
        e = a;
      return b(function (a) {
        'number' == typeof a
          ? c(a)
          : a.tag
          ? 0 < e
            ? ((e = (e - 1) | 0), d(0))
            : c(a)
          : ((d = a[0]), c(a));
      });
    };
  };
}

function skipUntil$1(a) {
  return function (b) {
    return function (c) {
      function d(a) {
        'number' == typeof a
          ? g && ((k = !0), e(1))
          : a.tag
          ? ((g = !1), f(1))
          : ((f = a = a[0]), a(0));
      }
      let e = m,
        f = m,
        g = !0,
        h = !1,
        k = !1;
      b(function (b) {
        'number' == typeof b
          ? (g && f(1), (k = !0), c(0))
          : b.tag
          ? g || k
            ? h
              ? (h = !1)
              : ((h = !0), e(0), f(0))
            : ((h = !1), c(b))
          : ((e = b[0]), a(d));
      });
      c(
        l(0, [
          function (a) {
            if (!k) {
              if (a) {
                if (((k = !0), e(1), g)) {
                  return f(1);
                }
              } else {
                h || ((h = !0), g && f(0), e(0));
              }
            }
          },
        ])
      );
    };
  };
}

function skipWhile$1(a) {
  return function (b) {
    return function (c) {
      let d = m,
        e = !0;
      return b(function (b) {
        'number' == typeof b
          ? c(b)
          : b.tag
          ? e
            ? a(b[0])
              ? d(0)
              : ((e = !1), c(b))
            : c(b)
          : ((d = b[0]), c(b));
      });
    };
  };
}

function switchAll$1(a) {
  return K(L)(a);
}

function take$1(a) {
  return function (b) {
    return function (c) {
      let d = !1,
        e = 0,
        f = m;
      b(function (b) {
        'number' == typeof b
          ? d || ((d = !0), c(0))
          : b.tag
          ? e < a && !d && ((e = (e + 1) | 0), c(b), !d && e >= a && ((d = !0), c(0), f(1)))
          : ((b = b[0]), 0 >= a ? ((d = !0), c(0), b(1)) : (f = b));
      });
      c(
        l(0, [
          function (b) {
            if (!d) {
              if (b) {
                return (d = !0), f(1);
              }
              if (e < a) {
                return f(0);
              }
            }
          },
        ])
      );
    };
  };
}

function takeUntil$1(a) {
  return function (b) {
    return function (c) {
      function d(a) {
        'number' != typeof a && (a.tag ? ((e = !0), f(1), c(0)) : ((g = a = a[0]), a(0)));
      }
      let e = !1,
        f = m,
        g = m;
      b(function (b) {
        'number' == typeof b ? e || ((e = !0), g(1), c(0)) : b.tag ? e || c(b) : ((f = b[0]), a(d));
      });
      c(
        l(0, [
          function (a) {
            if (!e) {
              return a ? ((e = !0), f(1), g(1)) : f(0);
            }
          },
        ])
      );
    };
  };
}

function takeWhile$1(a) {
  return function (b) {
    return function (c) {
      let d = m,
        e = !1;
      return b(function (b) {
        'number' == typeof b
          ? e || ((e = !0), c(0))
          : b.tag
          ? e || (a(b[0]) ? c(b) : ((e = !0), c(0), d(1)))
          : ((d = b[0]), c(b));
      });
    };
  };
}

function throttle$1(a) {
  return function (b) {
    return function (c) {
      function d() {
        void 0 !== g && clearTimeout(x(g));
      }
      function e() {
        g = void 0;
        f = !1;
      }
      let f = !1,
        g = void 0;
      return b(function (b) {
        if ('number' == typeof b) {
          d(), c(0);
        } else if (b.tag) {
          f || ((f = !0), d(), (g = w(setTimeout(e, a(b[0])))), c(b));
        } else {
          var h = b[0];
          c(
            l(0, [
              function (a) {
                return a ? (d(), h(1)) : h(a);
              },
            ])
          );
        }
      });
    };
  };
}

function toArray$1(a) {
  let b = [],
    c = m,
    d = !1;
  a(function (a) {
    'number' == typeof a ? (d = !0) : a.tag ? (b.push(a[0]), c(0)) : ((c = a = a[0]), a(0));
  });
  d || c(1);
  return b;
}

function toCallbag$2(a) {
  return function (b, c) {
    if (0 === b) {
      return a(function (a) {
        function b(a) {
          switch (a) {
            case 1:
              d(0);
              break;

            case 2:
              d(1);
          }
        }
        if ('number' == typeof a) {
          return 2 === c.length ? c(2, void 0) : c.bind(null, 2, void 0);
        }
        if (a.tag) {
          return (a = a[0]), 2 === c.length ? c(1, a) : c.bind(null, 1, a);
        }
        var d = a[0];
        return 2 === c.length ? c(0, b) : c.bind(null, 0, b);
      });
    }
  };
}

function toObservable$2(a) {
  var b = {
    subscribe: function (b, d, e) {
      var c = ('object' == typeof b ? b.next.bind(b) : b) || R,
        g = ('object' == typeof b ? b.complete.bind(b) : e) || S;
      let h = m,
        k = !1;
      a(function (a) {
        if ('number' == typeof a) {
          return (k = !0), g();
        }
        if (a.tag) {
          if (k) {
            return;
          }
          c(a[0]);
          return h(0);
        }
        h = a = a[0];
        a(0);
      });
      return {
        unsubscribe: function () {
          if (!k) {
            return (this.closed = !1), (k = !0), h(1);
          }
        },
        closed: !1,
      };
    },
  };
  b[P] = function () {
    return b;
  };
  return b;
}

function toPromise$1(a) {
  return new Promise(function (b) {
    M(1)(a)(function (a) {
      if ('number' != typeof a) {
        if (a.tag) {
          b(a[0]);
        } else {
          a[0](0);
        }
      }
    });
  });
}

var v = [],
  P =
    'function' == typeof Symbol
      ? Symbol.observable || (Symbol.observable = Symbol('observable'))
      : '@@observable';

export {
  buffer$1 as buffer,
  combine$1 as combine,
  concat$1 as concat,
  concatAll$1 as concatAll,
  z as concatMap,
  debounce$1 as debounce,
  delay$1 as delay,
  u as empty,
  filter$1 as filter,
  G as flatten,
  forEach$1 as forEach,
  p as fromArray,
  fromCallbag$2 as fromCallbag,
  fromDomEvent$1 as fromDomEvent,
  fromList$1 as fromList,
  fromObservable$2 as fromObservable,
  fromPromise$1 as fromPromise,
  fromValue$1 as fromValue,
  interval$1 as interval,
  make$1 as make,
  makeSubject$1 as makeSubject,
  map$1 as map,
  merge$1 as merge,
  G as mergeAll,
  D as mergeMap,
  never$1 as never,
  onEnd$1 as onEnd,
  H as onPush,
  onStart$1 as onStart,
  pipe,
  publish$1 as publish,
  sample$1 as sample,
  scan$1 as scan,
  share$1 as share,
  skip$1 as skip,
  skipUntil$1 as skipUntil,
  skipWhile$1 as skipWhile,
  N as subscribe,
  switchAll$1 as switchAll,
  K as switchMap,
  take$1 as take,
  M as takeLast,
  takeUntil$1 as takeUntil,
  takeWhile$1 as takeWhile,
  H as tap,
  throttle$1 as throttle,
  toArray$1 as toArray,
  toCallbag$2 as toCallbag,
  toObservable$2 as toObservable,
  toPromise$1 as toPromise,
};
