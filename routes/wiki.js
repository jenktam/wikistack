const express = require('express');
const app = express();
const router = express.Router();
const models = require('../models');
const nunjucks = require('nunjucks');
const Page = models.Page;
const User = models.User;

router.get('/', function(req, res, next) {
  Page.findAll()
    .then(function(allPages) {
      res.render('../views/index', { allPages: allPages });
    })
});

router.post('/', function(req, res, next) {
  // req.body for POST and Put
  // req.params.name mainly for GET, DELETE

  // findOrCreate method checks if a user already exists and if not, create a new user
  User.findOrCreate({
    // parameters in where are what you are looking for in User model.
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
    // will pass user object above as value. want to look at value[0] because value is an object and as long as there's a value in the 1st index, we know that the user exists. Therefore, value[0] is all we care about
    .then(function(value) {
      var user = value[0];

      // Set up action to create new page with every POST request
      var page = Page.create({
        title: req.body.title,
        content: req.body.content
      });
      // ensures calling promise on page
      return page.then(function(page) {
        return page.setAuthor(user);
      });
    })
    // promise on User continued
    .then(function(page) {
      // run through async function calls from top to bottom, but essentially we are calling User.findOrCreate, page.create,page.setAuthor, res.redirect
      res.redirect(page.route);
    })
    .catch(next);


  // User.findOrCreate({
  //     where: { name: req.body.name },
  //     defaults: { email: req.body.email }
  //   })
  //   .then(function(userInstancesArray){;
  //     var user = userInstancesArray[0];
  //     Page.create({
  //         title: req.body.title,
  //         content: req.body.content
  //       })
  //       // is sending promise with object. Creating a page and then calling function once it's created
  //       .then(function(savedPage) {
  //           // console.log("author:", author);
  //           savedPage.setAuthor(user);
  //           // console.log("savedPage", savedPage);
  //           // check routes/index.js to see route getter method. Saved as 3rd argument
  //           res.redirect(savedPage.route);
  //       })
  //       .catch(next);
  //   })
  //   .catch(next);

  // Alternate way to add a new page to our database table
  // reference: https://learn.fullstackacademy.com/workshop/572372d780f8bb03009db806/content/57238a922cce560300a5ac55/text
  // Page.build({
  //   title: req.body.title,
  //   content: req.body.content
  // })
  //   .save()
  //   .then(res.json(req.body));


  // CHECK

});

router.get('/add', function(req, res, next) {
  res.render('../views/addpage');
});

function generateError(message, status) {
  let err = new Error(message);
  err.status = status;
  return err;
}

router.get('/:urlTitle', function (req, res, next) {
  var urlTitleOfAPage = req.params.urlTitle;
  Page.findOne({
    where: {
      urlTitle: urlTitleOfAPage
    },
    include: [
                {model: User, as: 'author'}
            ]
  })
  .then(function(page){ //should change to pages if
    if (page === null) {
      throw generateError('No page found with this title', 404);
    } else {
      res.render('wikipage', {
        page: page
      });
    }
  })
  .catch(next);

});

router.get('/search', function(req, res, next) {
  Page.findByTag(req.query.search)
  .then(function(pages) {
    res.render('index', {
      pages: pages
    });
  });
});

router.get('/:urlTitle/similar', function(req, res, next) {
  // first find page
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  // if page is null, throw error
  // otherwise, find pages with similar tags and render them
  .then(function(page) {
    if(page === null ) {
      throw generateError('No pages corresponding to this title', 404);
    } else {
      return page.findSimilar()
      .then(function(pages) {
        res.render('index', {
          pages:pages
        });
      });
    }
  })
  .catch(next);

});

module.exports = router;

