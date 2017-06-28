const express = require('express');
const app = express();
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
var Promise = require('bluebird');

// Will render list of all authors on our site
// will need to create a new template of views to accomplish
router.get('/', function(req, res, next) {
  User.findAll({})
    .then(function(allUsers) {
      // console.log("allUsers", allUsers);
      res.render('userlist', { allUsers: allUsers });
    })

  // Create
});

// id is the author's id which will render a list of links of each article written by that author
// This begs the question — how do we deal with the fact that users don't have page references? Its page instances that have an "author" reference. Clearly, we'll have to do two lookups: one for the user, and one for all the pages whose author is this user. Since we are hitting this route by user id, we can do both lookups simultaneously, and when they are finished, pass both user and pages to the render function. If you install Bluebird, doing the parallel lookup shouldn't be too hard — you can use .all.
router.get('/:userId', function(req, res, next) {
  // GET = READ. Finds id in User model that matches the url id
  // lookup for user
  var userPromise = User.findById(req.params.userId);
  console.log(req.params.userId);
  // 2nd lookup for all pages whose author is this user. hitting route by user id so can lookup both simultaneously
  var pagesPromise = Page.findAll({
    where:{
      authorId: req.params.userId
    }
  });

  Promise.all([ userPromise, pagesPromise ])
     .spread(function (user, userPages) {
            res.render('userPages', {
                pages: userPages,
                user: user
            });
        })
        .catch(next)
});

module.exports = router;
