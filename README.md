# grunt-yaml [![Build Status](https://secure.travis-ci.org/shiwano/grunt-yaml.png?branch=master)](http://travis-ci.org/shiwano/grunt-yaml)

> Compiles YAML to JSON.

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-yaml --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-yaml');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## The "yaml" task

### Overview
In your project's Gruntfile, add a section named `yaml` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  yaml: {
    your_target: {
      options: {
        ignored: /^_/,
        space: 4,
        constructors: {
          '!include': function (node, yaml) {
            var data = grunt.file.read(node.value, 'utf-8');
            return yaml.load(data);
          }
        }
      },
      files: [
        {expand: true, cwd: 'yaml_directory/', src: ['**/*.yml'], dest: 'output_directory/'}
      ]
    },
  },
})
```
In a situation where you do not want to output a file, but want to manipulate the data on your own, you can provide a middleware function and disable the destination write process:

```js
grunt.initConfig({
  yaml: {
    your_target: {
      options: {
        disableDest: true,    // Grunt will not create a config.json as per the destination of the files object
        middleware: function(response, json){
          console.log(response);    // YAML data
          console.log(json);        // Stringified JSON
        },
        space: 4
      },
      files: {
        'config.json': ['config.yml']
      }
    },
  },
})
```

### Options

#### options.ignored
Type: `RegExp` or `String`
Default value: `null`

A value that specifies file pattern not to compile.

#### options.space
Type: `Number`
Default value: `2`

A value that is given to `JSON.stringify` for pretty-printing.

#### options.constructors
Type: `Object`
Default value: `{}`

A Object that defines custom constructors to [js-yaml](https://github.com/nodeca/js-yaml).

#### options.middleware
Type: 'function'
Default value: 'function(response, json){}'

A function which provides you an interface to manipulate the YAML before it becomes JSON, or manipulate the JSON after being stringified.

#### options.disableDest
Type: 'Boolean'
Default: 'false'

A boolean flag which will prevent grunt-yaml from creating an output file if you would like to just work with the middleware function.

### Usage Examples

See [my repository](https://github.com/shiwano/cw-schema).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## Release History
 * 2013-06-26   v0.2.1   Add `middleware` and `disableDest` options.
 * 2013-05-10   v0.2.0   Use `files` format.
 * 2013-04-14   v0.1.2   Support for grunt 0.4.0.
 * 2013-02-09   v0.1.1   Support for grunt 0.4.0rc7.
 * 2012-12-22   v0.1.0   First release.

## License
Copyright (c) 2012 Shogo Iwano
Licensed under the MIT license.
