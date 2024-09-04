Remedial JavaScript
====

Adaptation of Douglas Crockford's [`remedial.js`](https://web.archive.org/web/20110218164006/http://javascript.crockford.com/remedial.html) with a thin wrap for SSJS

This works in both the Browser and SSJS.

    npm install remedial

    require('remedial');

Notes
----

`typeOf` is taken from `jQuery.type`, which is more accurate than Crockford's original and even simpler
than the ["Flanagan / Miller device"](http://groups.google.com/group/nodejs/msg/0670a986a2906aeb).

There is [a more specific typeof()](http://rolandog.com/archives/2007/01/18/typeof-a-more-specific-typeof/) implementation also worthy of consideration.

Globals
====

typeOf(o)
----

Since JavaScript is a loosely-typed language, it is sometimes necessary to examine a value to determine its type. (This is sometimes necessary in strongly typed languages as well.) JavaScript provides a typeof  operator to facilitate this, but typeof has problems.

               typeof               typeOf
    Object     'object'             'object'
    Array      'object'             'array'
    Function   'function'           'function'
    String     'string'             'string'
    Number     'number'             'number'
    Boolean    'boolean'            'boolean'
    null       'object'             'null'
    undefined  'undefined'          'undefined'

typeof [] produces 'object' instead of 'array'. That isn't totally wrong since arrays in JavaScript inherit from objects, but it isn't very useful. typeof null produces 'object'  instead of 'null'. That is totally wrong.

We can correct this by defining our own typeOf function, which we can use in place of the defective typeof operator.

isEmpty(v)
----

isEmpty(v) returns true if v is an object containing no enumerable members.

String Methods
====

JavaScript provides some useful methods for strings, but leaves out some important ones. Fortunately, JavaScript allows us to add new methods to the basic types.

entityify()
----

entityify() produces a string in which '<', '>', and '&' are replaced with their HTML entity equivalents. This is essential for placing arbitrary strings into HTML texts. So,

    "if (a < b && b > c) {".entityify()

produces

    "if (a &lt; b &amp;&amp; b &gt; c) {"

quote()
----

quote() produces a quoted string. This method returns a string that is like the original string except that it is wrapped in quotes and all quote and backslash characters are preceded with backslash.

supplant(object)
----

supplant() does variable substitution on the string. It scans through the string looking for expressions enclosed in { } braces. If an expression is found, use it as a key on the object, and if the key has a string value or number value, it is substituted for the bracket expression and it repeats. This is useful for automatically fixing URLs. So

param = {domain: 'valvion.com', media: 'http://media.valvion.com/'};
url = "{media}logo.gif".supplant(param);

produces a url containing "http://media.valvion.com/logo.gif".

trim()
----

The trim() method removes whitespace characters from the beginning and end of the string.
