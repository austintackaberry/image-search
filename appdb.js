var http = require('https');
var express = require('express');
var request = require('request');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://austin:mongodb@ds157584.mlab.com:57584/austintackaberry'
var db;
var async = require('async');
var num = 500;

MongoClient.connect(URL, (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(4000);
  console.log('listening on 4000')
});

var pathArr = [];
var q = async.queue(function (task, done) {
  var pathName;
  var title;
  var isSevenChar = false;
  async.series([
    function(callback) {
      request('http://www.imgur.com/random', function (error, response, body) {
        pathName = response.request.uri.path.split('/');
        pathName = pathName[pathName.length-1];
        if (pathName.length === 7) {
          isSevenChar = true;
        }
        callback();
      });
    },
    function(callback) {
      var options = {
        "method": "GET",
        "hostname": "api.imgur.com",
        "path": "/3/gallery/image/" + pathName,
        "headers": {
          "Authorization": "Client-ID 645458dfa73a241"
        }
      };
      var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          var body = Buffer.concat(chunks);
          if (isSevenChar) {
            isSevenChar = false;
            title = JSON.parse(body.toString()).data.title;
            var tags = JSON.parse(body.toString()).data.tags;
            var pathObj = {};
            pathObj.title = title;
            pathObj.pathName = pathName;
            if (tags !== undefined) {
              for (var i = 0; i < tags.length; i++) {
                tags[i] = tags[i].name;
              }
              pathObj.tags = tags;
            }
            db.collection("imgur").update({pathName: pathName}, pathObj, {upsert:true});
          }
        });
      });
      req.end();
      callback();
    }
  ],
  function() {
    if (task.index === num) {
      console.log("done");
    }
    done();
  });
});

for (var i = 0; i < num; i++) {
  q.push({index: i});
}
