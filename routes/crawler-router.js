'use strict'

const express = require('express');
const router = express.Router();
const crawler = require('../controllers/crawler.js');

router.get('/reloadData', crawler.reloadData)
router.get('/search', crawler.search)

module.exports = router;
