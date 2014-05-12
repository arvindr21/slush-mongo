module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      <%= schemaCamelized %> = mongoose.models.<%= schemaCamelized %>,
      api = {};

  // ALL
  api.<%= schemaSlug %>s = function (req, res) {
    <%= schemaCamelized %>.find(function(err, <%= schemaSlug %>s) {
      if (err) {
        res.json(500, err);
      } else {    
        res.json({<%= schemaSlug %>s: <%= schemaSlug %>s});
      }
    });
  };

  // GET
  api.<%= schemaSlug %> = function (req, res) {
    var id = req.params.id;
    <%= schemaCamelized %>.findOne({ '_id': id }, function(err, <%= schemaSlug %>) {
      if (err) {
        res.json(404, err);
      } else {
        res.json({<%= schemaSlug %>: <%= schemaSlug %>});
      }
    });
  };

  // POST
  api.add<%= schemaCamelized %> = function (req, res) {
    
    var <%= schemaSlug %>;
      
    if(typeof req.body.<%= schemaSlug %> == 'undefined'){
         res.status(500);
         return res.json({message: '<%= schemaSlug %> is undefined'});
    }

    <%= schemaSlug %> = new <%= schemaCamelized %>(req.body.<%= schemaSlug %>);

    <%= schemaSlug %>.save(function (err) {
      if (!err) {
        console.log("created <%= schemaSlug %>");
        return res.json(201, <%= schemaSlug %>.toObject());
      } else {
        return res.json(500, err);
      }
    });

  };

  // PUT
  api.edit<%= schemaCamelized %> = function (req, res) {
    var id = req.params.id;

    <%= schemaCamelized %>.findById(id, function (err, <%= schemaSlug %>) {


    <% schemaFields.forEach(function(field, index) { %>
      if(typeof req.body.<%= schemaSlug %>["<%= field.split(':')[0] %>"] != 'undefined'){
        <%= schemaSlug %>["<%= field.split(':')[0] %>"] = req.body.<%= schemaSlug %>["<%= field.split(':')[0] %>"];
      }  
    <% }) %>

      return <%= schemaSlug %>.save(function (err) {
        if (!err) {
          console.log("updated <%= schemaSlug %>");
          return res.json(200, <%= schemaSlug %>.toObject());        
        } else {
         return res.json(500, err);
        }
        return res.json(<%= schemaSlug %>);
      });
    });

  };

  // DELETE
  api.delete<%= schemaCamelized %> = function (req, res) {
    var id = req.params.id;
    return <%= schemaCamelized %>.findById(id, function (err, <%= schemaSlug %>) {
      return <%= schemaSlug %>.remove(function (err) {
        if (!err) {
          console.log("removed <%= schemaSlug %>");
          return res.send(204);
        } else {
          console.log(err);
          return res.json(500, err);
        }
      });
    });

  };


  app.get('/api/<%= schemaSlug %>s', api.<%= schemaSlug %>s);
  app.get('/api/<%= schemaSlug %>/:id', api.<%= schemaSlug %>);
  app.post('/api/<%= schemaSlug %>', api.add<%= schemaCamelized %>);
  app.put('/api/<%= schemaSlug %>/:id', api.edit<%= schemaCamelized %>);
  app.delete('/api/<%= schemaSlug %>/:id', api.delete<%= schemaCamelized %>);
};