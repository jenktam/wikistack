const express = require('express');
const app = express();
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  res.send('got to GET /wiki/');
  res.redirect('/');
});

router.post('/', function(req, res, next) {

  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`
  Page.create({
    title: req.body.title,
    content: req.body.content
  })
    .then(res.json(req.body));

  // Alternate way to add a new page to our database table
  // reference: https://learn.fullstackacademy.com/workshop/572372d780f8bb03009db806/content/57238a922cce560300a5ac55/text
  // Page.build({
  //   title: req.body.title,
  //   content: req.body.content
  // })
  //   .save()
  //   .then(res.json(req.body));
  });

router.get('/add', function(req, res, next) {
  res.render('../views/addpage');
});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    res.json(foundPage);
  })
  .catch(next);

});

module.exports = router;
