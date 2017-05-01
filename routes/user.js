const express = require('express');
const app = express();
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('got to GET /wiki/');
});

module.exports = router;
