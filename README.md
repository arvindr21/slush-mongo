# slush-mongo [![Build Status](https://secure.travis-ci.org/arvindr21/slush-mongo.png?branch=master)](https://travis-ci.org/arvindr21/slush-mongo) [![NPM version](https://badge-me.herokuapp.com/api/npm/slush-mongo.png)](http://badges.enytc.com/for/npm/slush-mongo) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/arvindr21/slush-mongo/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[![NPM](https://nodei.co/npm/slush-mongo.png?downloads=true&stars=true)](https://nodei.co/npm/slush-mongo/)

> A powerful slush generator for MongoDB

## Getting Started

### Installation

Install `slush-mongo` globally:

```bash
$ npm install -g slush-mongo
```

Remember to install `slush` globally as well, if you haven't already:

```bash
$ npm install -g slush
```

### Usage

Create a new folder for your project:

```bash
$ mkdir my-slush-mongo
```

Run the generator from within the new folder:

```bash
$ cd my-slush-mongo && slush mongo
```

And the pick the generator you would like to use.


### Running the app

To run the app execute 

```Bash
$ gulp
```

If you are working with Koa/Monk app, make sure you have installed Node 0.11.12 version. Alternatively, you can execute the below commands to install node 0.11.12v

```Bash
$ npm install -g n
$ n 0.11.12
$ node --harmony-generators `which gulp`
```

## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/klei/slush).

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/arvindr21/slush-mongo/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/arvindr21/slush-mongo/issues).

## TODOS
- [x] add mongojs/express gen
- [x] add mongoose/express gen
- [x] add mongoose schema gen
- [x] add mongoskin/express gen
- [x] add monk/koa gen

## License 

The MIT License

Copyright (c) 2014, Arvind Ravulavaru

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.