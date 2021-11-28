var express = require('express');
var router = express.Router();
var shorten = require('../modules/ShortenUrl');

/* GET home page. */
router.get('/:urlCode',shorten.getShortUrl)

module.exports = router;
