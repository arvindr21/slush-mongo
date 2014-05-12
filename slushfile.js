/*
 * slush-mongo
 * https://github.com/arvindr21/slush-mongo
 *
 * Copyright (c) 2014, Arvind Ravulavaru
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
  request = require('request'),
  gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  rename = require('gulp-rename'),
  _ = require('underscore.string'),
  inquirer = require('inquirer');

gulp.task('default', function (done) {
  var prompts = [{
    type: 'list',
    name: 'genName',
    message: 'Which MongoDB project would you like to generate?',
    choices: [{
        name: "Mongoose/Express | Schema",
        value: "mongoose"
      }, {
        name: "Mongojs/Express",
        value: "mongojs"
      }, {
        name: "Mongoskin/Express",
        value: "mongoskin"
      }, {
        name: "Monk/Koa",
        value: "monk"
      }

    ],
    default: 'mongoose'
  }];
  //Ask
  inquirer.prompt(prompts,
    function (answers) {
      if (!answers.genName) {
        return done();
      }
      answers.appNameSlug = _.slugify(answers.genName);
      if (answers.genName == 'mongoose') {

        var goosePrompts = [{
          type: 'list',
          name: 'mongooseType',
          message: 'Mongoose/Express or Mongoose Schema generation?',
          choices: [{
              name: "Mongoose/Express",
              value: "mongooseExpress"
            }, {
              name: "Mongoose Schema",
              value: "mongooseSchema"
          }],
          default: 'mongooseExpress'
        }];

        inquirer.prompt(goosePrompts,
          function (gooseAnswers) {
            if (!gooseAnswers.mongooseType) {
              return done();
            }            
            if(gooseAnswers.mongooseType == 'mongooseSchema'){
              gulp.start('mongoose-schema')
            }else{
              gulp.start('mongoose');
            }
        });    
      } else if (answers.genName == 'mongojs') {
        gulp.start('mongojs');
      } else if (answers.genName == 'mongoskin') {
        gulp.start('mongoskin');
      } else if (answers.genName == 'monk') {
        gulp.start('monk');
      }
    });
});

gulp.task('mongoose', function (done) {
  var prompts = [{
    type: 'input',
    name: 'appname',
    message: 'What is the name of your app?',
    default: path.basename(process.cwd())
  }, {
    name: 'dbName',
    message: 'Database Name',
    type: 'input',
    default: 'myDb'
  }, {
    name: 'dbHost',
    message: 'Database Host',
    type: 'input',
    default: 'localhost'
  }, {
    name: 'dbUser',
    message: 'Database User',
    type: 'input',
    default: ''
  }, {
    name: 'dbPassword',
    message: 'Database Password',
    type: 'password',
    default: ''
  }, {
    name: 'dbPort',
    message: 'Database Port',
    type: 'input',
    default: 27017
  }, {
    name: 'useHeroku',
    message: 'Will you be using heroku?',
    type: 'confirm',
    default: true
  }];
  //Ask
  inquirer.prompt(prompts,
    function (answers) {

      answers.nameDashed = _.slugify(answers.appname);
      answers.modulename = _.camelize(answers.appname);

      gulp.src(__dirname + '/templates/mongoose/static/views/index.html')
        .pipe(conflict('./views'))
        .pipe(gulp.dest('./views'));

      gulp.src(__dirname + '/templates/mongoose/app/**')
        .pipe(template(answers))
        .pipe(rename(function (file) {
          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function () {
          done();
        });
    });
});

gulp.task('mongoose-schema', function (done) {
  var prompts = [{
    type: 'input',
    name: 'schemaName',
    message: 'What is the of the schema?',
    default: 'article'
  }, {
    name: 'properties',
    message: 'comma delimited list of schema properties, ex: property:type, property:type',
    type: 'input',
    default: 'title:String,excerpt:String,content:String,published:Boolean,created:Date'
  }];
  //Ask
  inquirer.prompt(prompts,
    function (answers) {

        answers.schemaSlug = _.slugify(answers.schemaName);
        answers.schemaCamelized = _.camelize(answers.schemaName);

        var fields = answers.properties.split(',');
        
        answers.schemaFields = fields;
        answers.mockData = "{}";


        console.log("Your creating a schema for " + answers.schemaCamelized);
        console.log("With the fields: " + answers.schemaFields); 

        var props = {};

        answers.schemaFields.forEach(function(field, index) {
          var fld = field.split(":")[0];
          var type = field.split(":")[1];
          props[fld] = {};
          switch(type){
            case 'ObjectId':
              props[fld].type = type.toLowerCase();
              props[fld].ipsum = 'id';
            break;      
            case 'Date':
              props[fld].type = 'string';
              props[fld].format = 'date-time';
            break;
            case 'Array':
              props[fld].type = type.toLowerCase();
              props[fld].items = { "type": "string" };
            break;      
            case 'Number':
              props[fld].type = type.toLowerCase();
            break;
            case 'Boolean':
              props[fld].type = type.toLowerCase();
            break;
            case 'String':
              props[fld].type = type.toLowerCase();
              props[fld].ipsum = "sentence"
            break;
            case 'Buffer':
            case 'Mixed':
            break;      
          }
        });

        var options = {
          uri: 'http://schematic-ipsum.herokuapp.com',
          method: 'POST',
          json: {
            "type": "object",
            "properties": props
          }
        };

        request(options, function(error, response, body) {
          console.log("starting request to schematic for test mock data...");
          if (!error && response.statusCode == 200) {
            answers.mockData = JSON.stringify(body);
          }else{
            console.log("There was an issue reaching http://schematic-ipsum.herokuapp.com.");
            console.log("providing mock data for tests has failed, update you test file manually.");
          }


          gulp.src(__dirname + '/templates/mongoose/schema/**')
            .pipe(template(answers))
            .pipe(rename(function (file) {
              if(file.extname === '.js'){
                switch (file.basename) {
                  case 'route':
                    file.basename = answers.schemaSlug;
                    break;
                  case 'schema':
                    file.basename = answers.schemaSlug;
                    break;
                  case 'test-schema':
                    file.basename = 'test-' + answers.schemaSlug;
                    break;
                }
              }
            }))        
            .pipe(conflict('./'))
            .pipe(gulp.dest('./'))
            .on('end', function () {
              done();
            }); 


        });
  });
});

gulp.task('mongoskin', function (done) {
  var prompts = [{
    type: 'confirm',
    name: 'moveon',
    message: 'Scaffold a mongoskin project?'
  }];
  //Ask
  inquirer.prompt(prompts,
    function (answers) {
      if (!answers.moveon) {
        return done();
      }
      answers.appNameSlug = _.slugify(answers.appName);
      gulp.src(__dirname + '/templates/mongoskin/**')
        .pipe(template(answers))
        .pipe(rename(function (file) {
          if (file.basename[0] === '_') {
            file.basename = '' + file.basename.slice(1);
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function () {
          done();
        });
    });
});

gulp.task('mongojs', function (done) {
  var prompts = [{
    type: 'input',
    name: 'appname',
    message: 'What is the name of your app?',
    default: path.basename(process.cwd())
  }, {
    name: 'dbName',
    message: 'Database Name',
    type: 'input',
    default: 'myDb'
  }, {
    name: 'dbHost',
    message: 'Database Host',
    type: 'input',
    default: 'localhost'
  }, {
    name: 'dbUser',
    message: 'Database User',
    type: 'input',
    default: ''
  }, {
    name: 'dbPassword',
    message: 'Database Password',
    type: 'password',
    default: ''
  }, {
    name: 'dbPort',
    message: 'Database Port',
    type: 'input',
    default: 27017
  }, {
    name: 'useHeroku',
    message: 'Will you be using heroku?',
    type: 'confirm',
    default: true
  }];
  //Ask
  inquirer.prompt(prompts,
    function (answers) {

      answers.nameDashed = _.slugify(answers.appname);
      answers.modulename = _.camelize(answers.appname);

      gulp.src(__dirname + '/templates/mongojs/static/views/index.html')
        .pipe(conflict('./views'))
        .pipe(gulp.dest('./views'));

      gulp.src(__dirname + '/templates/mongojs/app/**')
        .pipe(template(answers))
        .pipe(rename(function (file) {
          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function () {
          done();
        });
    });
});

gulp.task('monk', function (done) {
  var prompts = [{
    type: 'input',
    name: 'appname',
    message: 'What is the name of your app?',
    default: path.basename(process.cwd())
  }, {
    name: 'dbName',
    message: 'Database Name',
    type: 'input',
    default: 'myDb'
  }, {
    name: 'dbHost',
    message: 'Database Host',
    type: 'input',
    default: 'localhost'
  }, {
    name: 'dbUser',
    message: 'Database User',
    type: 'input',
    default: ''
  }, {
    name: 'dbPassword',
    message: 'Database Password',
    type: 'password',
    default: ''
  }, {
    name: 'dbPort',
    message: 'Database Port',
    type: 'input',
    default: 27017
  }, {
    name: 'useHeroku',
    message: 'Will you be using heroku?',
    type: 'confirm',
    default: true
  }];
  //Ask
  inquirer.prompt(prompts,
    function (answers) {

      answers.nameDashed = _.slugify(answers.appname);
      answers.modulename = _.camelize(answers.appname);

      gulp.src(__dirname + '/templates/monk/static/views/index.html')
        .pipe(conflict('./views'))
        .pipe(gulp.dest('./views'));

      gulp.src(__dirname + '/templates/monk/app/**')
        .pipe(template(answers))
        .pipe(rename(function (file) {
          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function () {
          done();
        });
    });
});