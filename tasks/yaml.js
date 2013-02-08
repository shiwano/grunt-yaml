/*
 * grunt-yaml
 * https://github.com/shiwano/grunt-yaml
 *
 * Copyright (c) 2012 Shogo Iwano
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var yaml = require('js-yaml');
var async = require('async');

module.exports = function (grunt) {
  grunt.registerMultiTask('yaml', 'Compile YAML to JSON', function() {
    var options = this.options({
      constructors: {},
      ignored: null,
      space: 2
    });
    var dest = this.data.dest;
    var filepaths = grunt.file.expand(this.data.src);
    var taskDone = this.async();

    Object.keys(options.constructors).forEach(function (tag) {
      var constructor = options.constructors[tag];

      yaml.addConstructor(tag, function (node) {
        return constructor.call(this, node, yaml);
      });
    });

    async.forEach(filepaths, function (filepath, done) {
      if (options.ignored && path.basename(filepath).match(options.ignored)) {
        return done();
      }

      var destpath = filepath.replace(path.dirname(filepath), dest)
        .replace(/\.ya?ml$/, '.json'); // For replace extension.
      var data = grunt.file.read(filepath);

      yaml.loadAll(data, function (result) {
        var json = JSON.stringify(result, null, options.space);
        grunt.file.write(destpath, json);
        grunt.log.writeln('File "' + destpath.cyan + '" compiled.');
        done();
      });
    }, function (err) {
      if (err) {
        grunt.log.error(err);
        return taskDone(false);
      }

      taskDone();
    });
  });
};
