const express = require('express');
const app = express();
const models = require('./models');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');


// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);


// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

app.use('/', routes);

// Where your server and express app are being defined:
// ... other stuff
// .sync creates the tables
models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    // make sure to replace the name below with your express app
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error);

app.use(express.static(path.join(__dirname, '/public')));

// // modular routing that uses io inside it
// app.use('/', makesRouter(io));
