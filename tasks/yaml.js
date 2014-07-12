/*
 * grunt-yaml
 * https://github.com/shiwano/grunt-yaml
 *
 * Copyright (c) 2012 Shogo Iwano
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    yaml = require('js-yaml'),
    _ = require('lodash');

module.exports = function(grunt) {
  var yamlSchema = null;
  var strictOption = false;

  function loadYaml(filepath, options) {
    var data = grunt.file.read(filepath, options);

    try {
      return yaml.safeLoad(data, {
        schema: yamlSchema,
        filename: filepath,
        strict: strictOption
      });
    } catch (e) {
      grunt.warn(e);
      return null;
    }
  }

  function createYamlSchema(customTypes) {
    var yamlTypes = [];

    _.each(customTypes, function(resolver, tagAndKindString) {
      var tagAndKind = tagAndKindString.split(/\s+/);

      var yamlType = new yaml.Type(tagAndKind[0], {
        loadKind: tagAndKind[1],
        loadResolver: function(state) {
          var result = resolver.call(this, state.result, loadYaml);

          if (_.isUndefined(result) || _.isFunction(result)) {
            return false;
          } else {
            state.result = result;
            return true;
          }
        }
      });

      yamlTypes.push(yamlType);
    });

    return yaml.Schema.create(yamlTypes);
  }

  grunt.registerMultiTask('yaml', 'Compile YAML to JSON', function() {
    var options = this.options({
      customTypes: {},
      ignored: null,
      space: 2,
      middleware: function() {},
      disableDest: false,
      strict: false,
      readEncoding: grunt.file.defaultEncoding,
      writeEncoding: grunt.file.defaultEncoding
    });
    var readOptions = {
      encoding: options.readEncoding
    };
    var writeOptions = {
      encoding: options.writeEncoding
    };

    yamlSchema = createYamlSchema(options.customTypes);
    strictOption = options.strict;

    _.each(this.files, function(filePair) {
      filePair.src.forEach(function(src) {
        if (grunt.file.isDir(src) || (options.ignored && path.basename(src).match(options.ignored))) {
          return;
        }

        var dest = filePair.dest.replace(/\.ya?ml$/, '.json');
        var result = loadYaml(src, readOptions);
        var json = JSON.stringify(result, null, options.space);

        if (_.isFunction(options.middleware)) {
          options.middleware(result, json, src, dest);
        }

        if (!options.disableDest) {
          grunt.file.write(dest, json, writeOptions);
          grunt.log.writeln('Compiled ' + src.cyan + ' -> ' + dest.cyan);
        }
      });
    });
  });
};
