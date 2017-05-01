const express = require('express');
const router = express.Router();
const wikiRouter = require('./wiki');
const userRouter = require('./user');

router.use('/wiki', wikiRouter);
router.use('/user', userRouter);
// or, in one line: router.use('/wiki', require('./wiki'));

module.exports = router;
