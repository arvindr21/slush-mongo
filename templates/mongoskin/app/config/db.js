'use strict';
var mongo = require('mongoskin');

var config = {
  "db": "<%= dbName %>",  
  "host": "<%= dbHost %>",  
  "user": "<%= dbUser %>",
  "pw": "<%= dbPassword %>",
  "port": <%= dbPort %>
};

var port = (config.port.length > 0) ? ":" + config.port : '';
var login = (config.user.length > 0) ? config.user + ":" + config.pw + "@" : '';
var uristring = <% if(useHeroku){ %> process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || <% } %> "mongodb://" + login + config.host + port + "/" + config.db;

// Connect to Database
var db = mongo.db(uristring, {native_parser:true});
db.bind('posts');

// validate the connection - no easy way! :(
db.posts.findOne(function (err, res) {
  if(err){
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  }else{
    console.log('Successfully connected to: ' + uristring);
  }
});

module.exports = db;