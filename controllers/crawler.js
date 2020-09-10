'use strict'

const fs = require("fs");
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
      fs.writeFile('./database.json', JSON.stringify(records, null, 4), err => {
        if (err) {
          console.error(err)
          return;
        }
        //file written successfully
        return;
      });
    }
    done();
  }
});

module.exports = {
  scrapeData: function () {
    return new Promise(function (resolve, reject) {

      crawl.queue(`${globalConfig.crawler.baseURL}/?count=${globalConfig.crawler.count}&groups=${globalConfig.crawler.groups}&sort=${globalConfig.crawler.sort}`);

      console.log('Crawling started');
      crawl.on('drain', function () {
        return resolve('Crawling completed');
      });
    });
  },
  reloadData: function (req, res) {
    return new Promise(function (resolve, reject) {
      module.exports.scrapeData()
        .then(response => {
          console.log(response);
          const database = require('../database.json');
          return res.status(200).json({
            success: true,
            data: database
          });
        });
    });
  },
  search: function (req, res) {
    return new Promise(function (resolve, reject) {
      const database = require('../database.json');
      return res.status(200).json({
        success: true,
        data: database
      });
    });
  }
};
