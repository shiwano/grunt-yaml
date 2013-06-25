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

module.exports = function(grunt) {
  grunt.registerMultiTask('yaml', 'Compile YAML to JSON', function() {
    var options = this.options({
      constructors: {},
      ignored: null,
      space: 2,
      middleware: function(){},
      disableDest: false
    });
    var taskDone = this.async();

    Object.keys(options.constructors).forEach(function(tag) {
      var constructor = options.constructors[tag];

      yaml.addConstructor(tag, function(node) {
        return constructor.call(this, node, yaml);
      });
    });

    async.forEach(this.files, function(filePair, done) {
      filePair.src.forEach(function(src) {
        if (grunt.file.isDir(src) || (options.ignored && path.basename(src).match(options.ignored))) {
          return done();
        }

        var dest = filePair.dest.replace(/\.ya?ml$/, '.json');
        var data = grunt.file.read(src);

        yaml.loadAll(data, function(result) {
          var json = JSON.stringify(result, null, options.space);
          if(typeof options.middleware === 'function'){
            options.middleware(result, json);
          }
          if(!options.disableDest){
            grunt.file.write(dest, json);
            grunt.log.writeln('Compiled ' + src.cyan + ' -> ' + dest.cyan);
          }
          done();
        });
      });
    }, function(err) {
      if (err) {
        grunt.log.error(err);
        return taskDone(false);
      }

      taskDone();
    });
  });
};
