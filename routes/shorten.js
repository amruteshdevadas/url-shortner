var express = require('express');
var router = express.Router();
var shorten = require('../modules/ShortenUrl')

/* GET users listing. */
router.post('/', shorten.postShorten);
router.get('/count', shorten.getCount);
module.exports = router;
