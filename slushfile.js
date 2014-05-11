/*
 * slush-mongo
 * https://github.com/arvindr21/slush-mongo
 *
 * Copyright (c) 2014, Arvind Ravulavaru
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
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
        choices: [
        {
          name: "Mongoose/Express",
          value: "mongoose"
        },
        {
          name: "Mongojs/Express",
          value: "mongojs"
        },
        {
          name: "Mongoskin/Express",
          value: "mongoskin"
        },
        {
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
            if(answers.genName == 'mongoose')
            {
              gulp.start('mongoose');
            }  
            else if(answers.genName == 'mongojs')
            {
              gulp.start('mongojs');
            } 
            else if(answers.genName == 'mongoskin')
            {
              gulp.start('mongoskin');
            } 
            else if(answers.genName == 'monk')
            {
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
    },{
      name: 'dbName',
      message: 'Database Name',
      type: 'input',
      default: 'myDb'
    },
    {
      name: 'dbHost',
      message: 'Database Host',
      type: 'input',
      default: 'localhost'
    },
    {
      name: 'dbUser',
      message: 'Database User',
      type: 'input',
      default: ''
    },
    {
      name: 'dbPassword',
      message: 'Database Password',
      type: 'password',
      default: ''
    },
    {
      name: 'dbPort',
      message: 'Database Port',
      type: 'input',
      default: 27017
    },
    {
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
        type: 'confirm',
        name: 'moveon',
        message: 'Scaffold a mongojs project?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/templates/mongojs/**')
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

gulp.task('monk', function (done) {
    var prompts = [{
        type: 'confirm',
        name: 'moveon',
        message: 'Scaffold a monk project?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/templates/monk/**')
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