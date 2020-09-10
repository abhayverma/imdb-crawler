'use strict';

var cors = require('cors');

var express = require('express');

var bodyParser = require('body-parser');

var globalConfig = require('./global-config.json');

var imdbCrawler = require('./routes/crawler-router');

var crawler = require('./controllers/crawler');

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use('/api/crawler', imdbCrawler); // crawl IMDB on server init

crawler.scrapeData().then(function (res) {
  console.log(res);
});
app.listen(globalConfig.api.port, function () {
  return console.log("Server running on port ".concat(globalConfig.api.port));
});