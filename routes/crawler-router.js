'use strict'

const express = require('express');
const router = express.Router();
const crawler = require('../controllers/crawler.js');

router.get('/runScraper', crawler.scrapeData)
router.get('/search', crawler.search)

module.exports = router;
