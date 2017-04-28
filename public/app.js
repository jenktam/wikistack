const express = require('express');
const app = express();
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


// start the server
app.listen(1337, function(){
  console.log('listening on port 1337');
});

app.use(express.static(path.join(__dirname, '/public')));

// // modular routing that uses io inside it
// app.use('/', makesRouter(io));