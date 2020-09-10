'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var fs = require("fs");

var database = [];

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
      database = records;
    }

    done();
  }
});

var updateDatabase = function updateDatabase(records) {
  return new Promise(function (resolve, reject) {
    database = _toConsumableArray(new Set([].concat(_toConsumableArray(database), _toConsumableArray(records))));
    fs.writeFile('../database.json', JSON.stringify(database, null, 4), function (err) {
      if (err) {
        console.error(err);
        return;
      } //file written successfully

    });
    return;
  });
};

module.exports = {
  scrapeData: function scrapeData(req, res) {
    return new Promise(function (resolve, reject) {
      var sort = req.query.sort ? req.query.sort : globalConfig.crawler.sort;
      var count = req.query.count ? req.query.count : globalConfig.crawler.count;
      var groups = req.query.groups ? req.query.groups : globalConfig.crawler.groups;
      crawl.queue("".concat(globalConfig.crawler.baseURL, "/?count=").concat(count, "&groups=").concat(groups, "&sort=").concat(sort));
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
  search: function search(req, res) {
    return new Promise(function (resolve, reject) {
      var result = database.filter(function (record) {
        return req.query.title && record.title.match(new RegExp(req.query.title, 'ig')) || req.query.year && record.year.match(new RegExp(req.query.year, 'ig'));
      });
      var limit = req.query.limit ? req.query.limit : globalConfig["default"].limit;
      var offset = req.query.offset ? req.query.offset : 0;

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