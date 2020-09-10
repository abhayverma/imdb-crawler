'use strict'

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const globalConfig = require('./global-config.json');
const imdbCrawler = require('./routes/crawler-router');
const crawler = require('./controllers/crawler');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/crawler', imdbCrawler);

// crawl IMDB on server init
crawler.scrapeData()
  .then((res) => { console.log(res) });

app.listen(globalConfig.api.port, () => console.log(`Server running on port ${globalConfig.api.port}`));
