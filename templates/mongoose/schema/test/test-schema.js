var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New <%= schemaCamelized %>', function(){
  it('creates new <%= schemaSlug %> and responds with json success message', function(done){
    request(app)
    .post('/api/<%= schemaSlug %>')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"<%= schemaSlug %>": <%= mockData %>})
    .expect(201)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      _id = res.body._id;
      done();
    });
  });
});

describe('GET List of <%= schemaCamelized %>s', function(){
  it('responds with a list of <%= schemaSlug %> items in JSON', function(done){
    request(app)
    .get('/api/<%= schemaSlug %>s')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET <%= schemaCamelized %> by ID', function(){
  it('responds with a single <%= schemaSlug %> item in JSON', function(done){
    request(app)
    .get('/api/<%= schemaSlug %>/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT <%= schemaCamelized %> by ID', function(){
  it('updates <%= schemaSlug %> item in return JSON', function(done){
    request(app)
    .put('/api/<%= schemaSlug %>/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "<%= schemaSlug %>": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE <%= schemaCamelized %> by ID', function(){
  it('should delete <%= schemaSlug %> and return 200 status code', function(done){
    request(app)
    .del('/api/<%= schemaSlug %>/'+ _id) 
    .expect(204, done);
  });
});