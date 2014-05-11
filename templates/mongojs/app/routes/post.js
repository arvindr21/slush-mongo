module.exports = function (app) {
  // Module dependencies.
  var db = require('../config/db'),
    mongojs = require('mongojs'),
    api = {};

  // ALL
  api.posts = function (req, res) {
    db.posts.find(function (err, posts) {
      if (err) {
        res.json(500, err);
      } else {
        res.json({
          posts: posts
        });
      }
    });
  };

  // GET
  api.post = function (req, res) {
    var id = req.params.id;
    db.posts.findOne({
      '_id': mongojs.ObjectId(id)
    }, function (err, post) {
      if (err) {
        res.json(404, err);
      } else {
        res.json(200, {
          post: post
        });
      }
    });
  };

  // POST
  api.addPost = function (req, res) {

    if (typeof req.body == 'undefined') {
      return res.json(500, {
        message: 'body is undefined'
      });
    }
    var post = req.body;

    db.posts.save(post, function (err) {
      if (!err) {
        console.log("created post");
        return res.json(201, post);
      } else {
        return res.json(500, err);
      }
    });

  };

  // PUT
  api.editPost = function (req, res) {
    var id = req.params.id;

    db.posts.findOne({
      '_id': mongojs.ObjectId(id)
    }, function (err, post) {

      if (typeof req.body["title"] != 'undefined') {
        post["title"] = req.body["title"];
      }

      if (typeof req.body["excerpt"] != 'undefined') {
        post["excerpt"] = req.body["excerpt"];
      }

      if (typeof req.body["content"] != 'undefined') {
        post["content"] = req.body["content"];
      }

      if (typeof req.body["active"] != 'undefined') {
        post["active"] = req.body["active"];
      }

      if (typeof req.body["created"] != 'undefined') {
        post["created"] = req.body["created"];
      }


      return db.posts.save(post, function (err) {
        if (!err) {
          console.log("updated post");
          return res.json(200, post);
        } else {
          return res.json(500, err);
        }
        return res.json(post);
      });
    });

  };

  // DELETE
  api.deletePost = function (req, res) {
    var id = req.params.id;
    db.posts.findOne({
      '_id': mongojs.ObjectId(id)
    }, function (err, post) {
      return db.posts.remove({
        '_id': mongojs.ObjectId(id)
      }, function (err) {
        if (!err) {
          console.log("removed post");
          return res.send(204);
        } else {
          console.log(err);
          return res.json(500, err);
        }
      });
    });

  };


  app.get('/api/posts', api.posts);
  app.get('/api/post/:id', api.post);
  app.post('/api/post', api.addPost);
  app.put('/api/post/:id', api.editPost);
  app.delete('/api/post/:id', api.deletePost);
};