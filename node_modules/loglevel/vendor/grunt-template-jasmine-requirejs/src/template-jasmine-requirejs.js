"use strict";

// LOGLEVEL-FORK: Summary
//
// The changes here are mostly about working with current versions of lodash.
// Grunt used to include lodash as `grunt.util._` for plugins to use, but has
// since deprecated it can be dangerous -- each plugin should really declare
// a dependency on a given version of lodash in its `package.json` and then
// require lodash directly so that updates to Grunt don't break plugins.
//
// However, this plugin is pretty old and uses lodash throughout, so we've
// just updated the broken callsites. Future Grunt upgrades could potentially
// require other changes to `grunt.util._.<whatever>` calls here.
//
// END LOGLEVEL-FORK

var template = __dirname + '/templates/jasmine-requirejs.html',
    requirejs  = {
      '2.0.0' : __dirname + '/../vendor/require-2.0.0.js',
      '2.0.1' : __dirname + '/../vendor/require-2.0.1.js',
      '2.0.2' : __dirname + '/../vendor/require-2.0.2.js',
      '2.0.3' : __dirname + '/../vendor/require-2.0.3.js',
      '2.0.4' : __dirname + '/../vendor/require-2.0.4.js',
      '2.0.5' : __dirname + '/../vendor/require-2.0.5.js',
      '2.0.6' : __dirname + '/../vendor/require-2.0.6.js',
      '2.1.0' : __dirname + '/../vendor/require-2.1.0.js',
      '2.1.1' : __dirname + '/../vendor/require-2.1.1.js',
      '2.1.2' : __dirname + '/../vendor/require-2.1.2.js',
      '2.1.3' : __dirname + '/../vendor/require-2.1.3.js',
      '2.1.4' : __dirname + '/../vendor/require-2.1.4.js',
      '2.1.5' : __dirname + '/../vendor/require-2.1.5.js',
      '2.1.6' : __dirname + '/../vendor/require-2.1.6.js',
      '2.1.7' : __dirname + '/../vendor/require-2.1.7.js',
      '2.1.8' : __dirname + '/../vendor/require-2.1.8.js',
      '2.1.9' : __dirname + '/../vendor/require-2.1.9.js',
      '2.1.10' : __dirname + '/../vendor/require-2.1.10.js'
    },
    path = require('path'),
    parse = require('./lib/parse');

function filterGlobPatterns(scripts) {
  Object.keys(scripts).forEach(function (group) {
    if (Array.isArray(scripts[group])) {
      scripts[group] = scripts[group].filter(function(script) {
        return script.indexOf('*') === -1;
      });
    } else {
      scripts[group] = [];
    }
  });
}

function resolvePath(filepath) {
  filepath = filepath.trim();
  if (filepath.substr(0,1) === '~') {
    filepath = process.env.HOME + filepath.substr(1);
  }
  return path.resolve(filepath);
}

// LOGLEVEL-FORK: copying tempfiles now requires info from the `context` object.
function moveRequireJs(grunt, task, context, versionOrPath) {
  var pathToRequireJS,
      versionReg = /^(\d\.?)*$/;

  if (versionReg.test(versionOrPath)) { // is version
      if (versionOrPath in requirejs) {
        pathToRequireJS = requirejs[versionOrPath];
      } else {
        throw new Error('specified requirejs version [' + versionOrPath + '] is not defined');
      }
  } else { // is path
      pathToRequireJS = resolvePath(versionOrPath);
      if (!grunt.file.exists(pathToRequireJS)) {
        throw new Error('local file path of requirejs [' + versionOrPath + '] was not found');
      }
  }
  task.copyTempFile(pathToRequireJS, path.join(context.temp, 'require.js'));
}
// END LOGLEVEL-FORK


exports.process = function(grunt, task, context) {

  var version = context.options.version;

  // find the latest version if none given
  if (!version) {
    version = Object.keys(requirejs).sort().pop();
  }

  // Remove glob patterns from scripts (see https://github.com/gruntjs/grunt-contrib-jasmine/issues/42)
  filterGlobPatterns(context.scripts);

  // Extract config from main require config file
  if (context.options.requireConfigFile) {
    // Remove mainConfigFile from src files
    var requireConfigFiles = grunt.util._.flatten([context.options.requireConfigFile]);

    var normalizedPaths = grunt.util._.map(requireConfigFiles, function(configFile){
      return path.normalize(configFile);
    });
    context.scripts.src = grunt.util._.reject(context.scripts.src, function (script) {
      // LOGLEVEL-FORK: Work with current versions of lodash.
      return grunt.util._.includes(normalizedPaths, path.normalize(script));
      // END LOGLEVEL-FORK
    });

    var configFromFiles = {};
    grunt.util._.map(requireConfigFiles, function (configFile) {
      grunt.util._.merge(configFromFiles, parse.findConfig(grunt.file.read(configFile)).config);
    });

    context.options.requireConfig = grunt.util._.merge(configFromFiles, context.options.requireConfig);
  }


  /**
   * Find and resolve specified baseUrl.
   */
  function getBaseUrl() {
    var outDir = path.dirname(path.join(process.cwd(), context.outfile));
    var requireBaseUrl = context.options.requireConfig && context.options.requireConfig.baseUrl;

    if (requireBaseUrl && grunt.file.isDir(outDir, requireBaseUrl)) {
      return requireBaseUrl;
    } else {
      return outDir;
    }
  }
  var baseUrl = getBaseUrl();

  /**
   * Retrieves the module URL for a require call relative to the specified Base URL.
   */
  function getRelativeModuleUrl(src) {
    return path.relative(baseUrl, src).replace(/\.js$/, '');
  }

  // Remove baseUrl and .js from src files
  context.scripts.src = grunt.util._.map(context.scripts.src, getRelativeModuleUrl);


  // Prepend loaderPlugins to the appropriate files
  if (context.options.loaderPlugin) {
    Object.keys(context.options.loaderPlugin).forEach(function(type){
      if (context.scripts[type]) {
        context.scripts[type].forEach(function(file,i){
          context.scripts[type][i] = context.options.loaderPlugin[type] + '!' + file;
        });
      }
    });
  }

  // LOGLEVEL-FORK: this function now requires context info
  moveRequireJs(grunt, task, context, version);
  // END LOGLEVEL-FORK

  context.serializeRequireConfig = function(requireConfig) {
    var funcCounter = 0;
    var funcs = {};

    function isUnserializable(val) {
      var unserializables = [Function, RegExp];
      var typeTests = unserializables.map(function(unserializableType) {
        return val instanceof unserializableType;
      });
      return !!~typeTests.indexOf(true);
    }

    function generateFunctionId() {
      return '$template-jasmine-require_' + new Date().getTime() + '_' + (++funcCounter);
    }

    var jsonString = JSON.stringify(requireConfig, function(key, val) {
      var funcId;
      if (isUnserializable(val)) {
        funcId = generateFunctionId();
        funcs[funcId] = val;
        return funcId;
      }
      return val;
    }, 2);

    Object.keys(funcs).forEach(function(id) {
      jsonString = jsonString.replace('"' + id + '"', funcs[id].toString());
    });

    return jsonString;
  };

  // update relative path of .grunt folder to the location of spec runner
  context.temp = path.relative(path.dirname(context.outfile),
                               context.temp);

  var source = grunt.file.read(template);

  // LOGLEVEL-FORK: Work with current versions of lodash.
  return grunt.util._.template(source)(context);
  // END LOGLEVEL-FORK
};
