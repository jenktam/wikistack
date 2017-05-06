const express = require('express');
const router = express.Router();
const wikiRouter = require('./wiki');
const userRouter = require('./users');

// is called after all app.uses is app.js file
router.use('/wiki', wikiRouter);
router.use('/users', userRouter);
// or, in one line: router.use('/wiki', require('./wiki'));

module.exports = router;
