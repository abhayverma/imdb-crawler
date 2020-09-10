'use strict'

const fs = require("fs");
let database = [];
const Crawler = require("crawler");
const globalConfig = require('../global-config.json');

const crawl = new Crawler({
  maxConnections: globalConfig.crawler.maxConnections,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    let records = [];
    if (error) {
      console.error(error);
    } else {
      let $ = res.$;
      const elements = globalConfig.crawler.elements;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      $(elements.component).each(function (index, val) {
        records.push({
          title: $(this).find(elements.title).text(),
          year: $(this).find(elements.year).text(),
          description: $(this).find(elements.description).text().substring(1).trim(),
          certificate: $(this).find(elements.certificate).text(),
          runTime: $(this).find(elements.runTime).text(),
          genre: $(this).find(elements.genre).text().substring(1).trim(),
          rating: $(this).find(elements.rating).text(),
          link: $(this).find(elements.title).attr('href'),
        });
      });
    }
    if (records.length > 0) {
      database = records;
    }
    done();
  }
});

const updateDatabase = (records) => {
  return new Promise((resolve, reject) => {
    database = [...new Set([...database, ...records])];
    fs.writeFile('../database.json', JSON.stringify(database, null, 4), err => {
      if (err) {
        console.error(err)
        return;
      }
      //file written successfully
    });
    return;
  });
}

module.exports = {
  scrapeData: function (req, res) {
    return new Promise(function (resolve, reject) {

      const sort = req.query.sort ? req.query.sort : globalConfig.crawler.sort;
      const count = req.query.count ? req.query.count : globalConfig.crawler.count;
      const groups = req.query.groups ? req.query.groups : globalConfig.crawler.groups;

      crawl.queue(`${globalConfig.crawler.baseURL}/?count=${count}&groups=${groups}&sort=${sort}`);

      console.log('Crawling');
      crawl.on('drain', function () {
        console.log('drained');
        return resolve(res.status(200).json({
          success: true,
          data: database
        }));
      });
    });
  },
  search: function (req, res) {
    return new Promise(function (resolve, reject) {

      let result = database.filter(record => (req.query.title && record.title.match(new RegExp(req.query.title, 'ig'))) ||
        (req.query.year && record.year.match(new RegExp(req.query.year, 'ig'))));

      const limit = req.query.limit ? req.query.limit : globalConfig.default.limit;
      const offset = req.query.offset ? req.query.offset : 0;

      if (!req.query.title && !req.query.year) {
        result = database;
      }

      return res.status(200).json({
        success: true,
        data: {
          total: result.length,
          data: result.slice(offset, limit)
        }
      });
    });
  }
};
