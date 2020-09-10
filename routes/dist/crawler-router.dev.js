'use strict';

var express = require('express');

var router = express.Router();

var crawler = require('../controllers/crawler.js');

router.get('/reloadData', crawler.reloadData);
router.get('/search', crawler.search);
module.exports = router;