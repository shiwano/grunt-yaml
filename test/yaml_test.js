'use strict';

var grunt = require('grunt');
var fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.test = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options/example_dir/example.json');
    var expected = grunt.file.read('test/expected/default_options/example_dir/example.json');
    test.equal(actual, expected, 'Compiled YAML to JSON.');

    test.done();
  },

  custom_options: function(test) {
    test.ok(fs.existsSync('tmp/custom_options/_partial.json') === false, 'Enabled ignored option.');

    var actual = grunt.file.read('tmp/custom_options/constructor_example.json');
    var expected = grunt.file.read('test/expected/custom_options/constructor_example.json');
    test.equal(actual, expected, 'Enabled constructors option.');

    test.done();
  },

  middleware_options: function(test) {
    test.ok(fs.existsSync('tmp/middleware_options/middleware.json') === false, 'Enabled disableDest option.');

    var actual = grunt.file.read('tmp/middleware_options/response.json');
    var expected = grunt.file.read('test/expected/middleware_options/response.json');
    test.equal(actual, expected, 'Enabled middleware option.');

    actual = grunt.file.read('tmp/middleware_options/json.json');
    expected = grunt.file.read('test/expected/middleware_options/json.json');
    test.equal(actual, expected, 'Enabled middleware option.');

    test.done();
  }
};

