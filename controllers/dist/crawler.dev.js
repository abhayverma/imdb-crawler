'use strict';

var fs = require("fs");

var Crawler = require("crawler");

var globalConfig = require('../global-config.json');

var crawl = new Crawler({
  maxConnections: globalConfig.crawler.maxConnections,
  // This will be called for each crawled page
  callback: function callback(error, res, done) {
    var records = [];

    if (error) {
      console.error(error);
    } else {
      var $ = res.$;
      var elements = globalConfig.crawler.elements; // $ is Cheerio by default
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
          link: $(this).find(elements.title).attr('href')
        });
      });
    }

    if (records.length > 0) {
      fs.writeFile('./database.json', JSON.stringify(records, null, 4), function (err) {
        if (err) {
          console.error(err);
          return;
        } //file written successfully


        return;
      });
    }

    done();
  }
});
module.exports = {
  scrapeData: function scrapeData() {
    return new Promise(function (resolve, reject) {
      crawl.queue("".concat(globalConfig.crawler.baseURL, "/?count=").concat(globalConfig.crawler.count, "&groups=").concat(globalConfig.crawler.groups, "&sort=").concat(globalConfig.crawler.sort));
      console.log('Crawling started');
      crawl.on('drain', function () {
        return resolve('Crawling completed');
      });
    });
  },
  search: function search(req, res) {
    return new Promise(function (resolve, reject) {
      var database = require('../database.json');

      return res.status(200).json({
        success: true,
        data: database
      });
    });
  }
};