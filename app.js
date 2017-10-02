var http = require('http');
var express = require('express');
var request = require('request');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://austin:mongodb@ds157584.mlab.com:57584/austintackaberry'
var db;
var async = require('async');
// app.use('/', express.static('public'));

MongoClient.connect(URL, (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(3000);
  console.log('listening on 3000')
});


var pathArr = [];
var q = async.queue(function (task, done) {
  request('http://www.imgur.com/random', function (error, response, body) {
    var parsed = body.match(/(?:","title":")(.*?)(?:","score":)/g);
    if (parsed !== null) {
      var parsedStr = parsed[0].split(/(?:","title":")|(?:","score":)/)[1];
    }
    var pathName = response.request.uri.path.split('/');
    pathName = pathName[pathName.length-1];
    if (parsed !== null) {
      if (parsedStr.length < 150) {
        var pathObj = {};
        pathObj["title"] = parsedStr;
        pathObj["pathName"] = pathName;
        db.collection("imgur").update({pathName: pathName}, pathObj, {upsert:true});
      }
    }
    done();
  });
});

for (var i = 0; i < 500; i++) {
  q.push({index: i});
}

app.get('/', function(req,res) {
  res.send(pathArr);
});
