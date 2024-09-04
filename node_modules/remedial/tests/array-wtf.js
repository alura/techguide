// Firefox was tested using persevere's global-es5 for es5 emulation
(function () {
  require('../lib/remedial');

  a = [];
  a[2] = 27;
  console.log(a);
  // Expected: [undefined, undefined, 27];
  // Node/V8: [ 27 ];
  // FF3: [undefined, undefined, 27];
  console.log(a.length);
  // 3
  console.log(typeOf(a));
  // array
  


  b = Object.create([]);
  b[2] = 27;
  console.log(b);
  // Expected: [undefined, undefined, 27];
  // Node/V8: [ 27 ]
  console.log(b.length);
  // Expected: 3
  // Node/V8/FF: 0
  console.log(typeOf(b));
  // Expected: Object (with Flanagan / Miller device or jQuery's type)
  // Node/V8/FF: array (with Crockford's original)


  c = Object.create([]);
  c.push();
  c.push();
  c.push(27);
  console.log(c);
  // Expected: [undefined, undefined, 27]
  // Node: [ 27, length: 1 ]
  // FF: []
  console.log(c.length);
  // Expected: 3
  // Node/V8/FF: 1
  console.log(typeOf(c));
  // Expected: object
  // Node/V8/FF: object


  d = Object.create(Array);
  // FF: Error: typeof prototype[function] != 'object'
  d[2] = 27;
  console.log(d);
  // Expected: [undefined, undefined, 27];
  // Node/V8: { '2': 27 }
  console.log(d.length);
  // Expected: 3
  // Node/V8/FF: 1
  console.log(typeOf(d));
  // Expected: object
  // Node/V8: object
}());

/*
  Exact Node Output:
  [ 27 ]
  3
  array
  [ 27 ]
  0
  array
  [ 27, length: 1 ]
  1
  object

  Exact FF (firebug) Output (expanded):
  [undefined, undefined, 27]
    >   2         27
  3
  array
  []
    >   2         27
  0
  array
  [27]
    >   0         27
        length    1
  1
  object
*/
