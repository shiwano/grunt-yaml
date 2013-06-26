/*
 * grunt-yaml
 * https://github.com/shiwano/grunt-yaml
 *
 * Copyright (c) 2012 Shogo Iwano
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    yaml: {
      default_options: {
        options: {
          constructors: {
            '!include': function () {} // For avoid tag missing error.
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/', src: ['**/*.yml'], dest: 'tmp/default_options/'}
        ]
      },
      custom_options: {
        options: {
          ignored: /^_/,
          space: 2,
          constructors: {
            '!include': function (node, yaml) {
              var data = grunt.file.read(node.value, 'utf-8');
              return yaml.load(data);
            }
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/', src: ['**/*.yml'], dest: 'tmp/custom_options/'}
        ]
      },
      middleware_options: {
        options: {
          disableDest: true,
          middleware: function(response, json){
            var fs = require('fs');
            grunt.file.write('tmp/middleware_options/response.json', JSON.stringify(response));
            grunt.file.write('tmp/middleware_options/json.json', json);
          }
        },
        files: {
          'tmp/middleware_options/middleware.json': ['test/fixtures/middleware.yml']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'yaml', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
