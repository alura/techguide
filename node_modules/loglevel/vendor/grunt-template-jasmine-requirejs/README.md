# FORK OF grunt-template-jasmine-requirejs

This is a local fork of the grunt-template-jasmine-requirejs package, which is no longer maintained. It is based on commit 0d5f278c19b997a19bd894d354078b64b0453698 from https://github.com/cloudchen/grunt-template-jasmine-requirejs.

This copy includes slight tweaks in order to maintain compatibility with the versions of Grunt and other tools in use by loglevel. All changes are marked by `LOGLEVEL-FORK:` and `END LOGLEVEL-FORK` comments, e.g:

```js
// LOGLEVEL-FORK: Work with current versions of lodash.
return _.template("xyz")({ data: "ok" });
// END LOGLEVEL-FORK
```

---

RequireJS template for Jasmine unit tests [![Build Status](https://travis-ci.org/cloudchen/grunt-template-jasmine-requirejs.png?branch=master)](https://travis-ci.org/cloudchen/grunt-template-jasmine-requirejs)
-----------------------------------------

## Installation
By default, this template works with Jasmine 2.x
```
npm install grunt-template-jasmine-requirejs --save-dev
```

## Support for both Jasmine 1.x and 2.x
You'd install `~0.1` version of this template if your test specs are based on Jasmine 1.x
```
npm install grunt-template-jasmine-requirejs@~0.1 --save-dev
```

## Options

### vendor
Type: `String|Array`

Works same as original. But they are loaded **before** require.js script file

### helpers
Type: `String|Array`

Works same as original. But they are loaded **after** require.js script file

## Template Options

### templateOptions.version
Type: `String`
Options: `2.0.0` to `2.1.10` or path to a local file system version(relative to Gruntfile.js). Absolute path is allowed as well. Default: latest requirejs version included

The version of requirejs to use.

### templateOptions.requireConfigFile
Type `String` or `Array`

This can be a single path to a require config file or an array of paths to multiple require config files. The configuration is extracted from the require.config({}) call(s) in the file, and is passed into the require.config({}) call in the template.

Files are loaded from left to right (using a deep merge). This is so you can have a main config and then override specific settings in additional config files (like a test config) without having to duplicate entire requireJS configs.

If `requireConfig` is also specified then it will be deep-merged onto the settings specified by this directive.

### templateOptions.requireConfig
Type: `Object`

This object is `JSON.stringify()`-ed ( **support serialize Function object** ) into the template and passed into `var require` variable

If `requireConfigFile` is specified then it will be loaded first and the settings specified by this directive will be deep-merged onto those.


## Sample usage

```js
// Example configuration using a single requireJS config file
grunt.initConfig({
  connect: {
    test : {
      port : 8000
    }
  },
  jasmine: {
    taskName: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/*Spec.js',
        helpers: 'spec/*Helper.js',
        host: 'http://127.0.0.1:8000/',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: 'src/main.js'
        }
      }
    }
  }
});
```

```js
// Example configuration using an inline requireJS config
grunt.initConfig({
  connect: {
    test : {
      port : 8000
    }
  },
  jasmine: {
    taskName: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/*Spec.js',
        helpers: 'spec/*Helper.js',
        host: 'http://127.0.0.1:8000/',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfig: {
            baseUrl: 'src/',
            paths: {
              "jquery": "path/to/jquery"
            },
            shim: {
              'foo': {
                deps: ['bar'],
                exports: 'Foo',
                init: function (bar) {
                  return this.Foo.noConflict();
                }
              }
            },
            deps: ['jquery'],
            callback: function($) {
              // do initialization stuff
              /*

              */
            }
          }
        }
      }
    }
  }
});
```



```js
// Example using a base requireJS config file and specifying
// overrides with an inline requireConfig file.
grunt.initConfig({
  connect: {
    test : {
      port : 8000
    }
  },
  jasmine: {
    taskName: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/*Spec.js',
        helpers: 'spec/*Helper.js',
        host: 'http://127.0.0.1:8000/',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: 'src/main.js',
          requireConfig: {
            baseUrl: 'overridden/baseUrl',
            shim: {
              // foo will override the 'foo' shim in main.js
              'foo': {
                deps: ['bar'],
                exports: 'Foo'
              }
            }
          }
        }
      }
    }
  }
});
```

```js
// Example using a multiple requireJS config files. Useful for
// testing.
grunt.initConfig({
  connect: {
    test : {
      port : 8000
    }
  },
  jasmine: {
    taskName: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/*Spec.js',
        helpers: 'spec/*Helper.js',
        host: 'http://127.0.0.1:8000/',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: ['src/config.js', 'spec/config.js']
          requireConfig: {
            baseUrl: 'overridden/baseUrl'
          }
        }
      }
    }
  }
});
```


*Note* the usage of the 'connect' task configuration. You will need to use a task like
[grunt-contrib-connect][] if you need to test your tasks on a running server.

[grunt-contrib-connect]: https://github.com/gruntjs/grunt-contrib-connect

## RequireJS notes

If you end up using this template, it's worth looking at the
[source]() in order to familiarize yourself with how it loads your files. The load process
consists of a series of nested `require` blocks, incrementally loading your source and specs:

```js
require([*YOUR SOURCE*], function() {
  require([*YOUR SPECS*], function() {
    require([*GRUNT-CONTRIB-JASMINE FILES*], function() {
      // at this point your tests are already running.
    }
  }
}
```

If "callback" function is defined in requireConfig, above code will be injected to the end of body of "callback" definition
```js
templateOptions: {
  callback: function() {
    // suppose we define a module here
    define("config", {
      "endpoint": "/path/to/endpoint"
    })
  }
}
```
Generated runner page with require configuration looks like:
```js
var require = {
  ...
  callback: function() {
    // suppose we define a module here
    define("config", {
      "endpoint": "/path/to/endpoint"
    })

    require([*YOUR SOURCE*], function() {
      require([*YOUR SPECS*], function() {
        require([*GRUNT-CONTRIB-JASMINE FILES*], function() {
          // at this point your tests are already running.
        }
      }
    }
  }
  ...
}
```
This automation can help to avoid unexpected dependency order issue

## Change Log
* v0.2.3 Fixed path issues [#77](https://github.com/cloudchen/grunt-template-jasmine-requirejs/pull/77)
* v0.2.2 Fixed regression which casued by [#65](https://github.com/cloudchen/grunt-template-jasmine-requirejs/pull/65)
* v0.2.1 Fixed [#65](https://github.com/cloudchen/grunt-template-jasmine-requirejs/pull/65)
* v0.2.0 Added Jasmine 2 support
* v0.1.10 03.14.14, Fixed [#53](https://github.com/cloudchen/grunt-template-jasmine-requirejs/pull/53), [#52](https://github.com/cloudchen/grunt-template-jasmine-requirejs/issues/52), [#46](https://github.com/cloudchen/grunt-template-jasmine-requirejs/issues/46), [#36](https://github.com/cloudchen/grunt-template-jasmine-requirejs/issues/36) wrong path error when runner outfile is specified at elsewhere
* v0.1.9, 02.04.14, [#57](https://github.com/cloudchen/grunt-template-jasmine-requirejs/issues/57) prevents conflict with `grunt-contrib-jasmine` 0.6.x, added requirejs 2.1.9 & 2.1.10

### Authors / Maintainers

- Jarrod Overson (@jsoverson)
- Cloud Chen (@cloudchen)
