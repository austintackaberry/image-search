var http = require('https');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://austin:mongodb@ds157584.mlab.com:57584/austintackaberry'
var db;
var async = require('async');

MongoClient.connect(URL, (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(3001);
  console.log('listening on 3001')
});

app.get('/imgnum/:num', function(req,res) {
  console.log("imgnum request received");
  var listImg = [];
  var allImg = [];
  async.series([
    function(callback) {
      db.collection("imgur").find().toArray()
      .then(function(result) {
        allImg = result;
        callback();
      })
    },
    function(callback) {
      var randoList = [];
      for (var i = 0; i < req.params.num; i++) {
        while (true) {
          var rando = Math.floor(Math.random() * allImg.length);
          if (!randoList.includes(rando)) {
            randoList.push(rando);
            break;
          }
        }
        listImg.push(allImg[rando]);
      }
      callback();
    },
    function(callback) {
      res.send(listImg);
      callback();
    }
  ]);
});

app.get('/imgsearch/:search/:num', function(req, res) {
  console.log("imgsearch request received");
  var searchArr = [];
  var search = req.params.search;
  db.collection("imgur").find().toArray()
  .then(function(result) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].title !== null) {
        if (result[i].title.includes(search)) {
          searchArr.push(result[i]);
          if (searchArr.length == req.params.num) {
            break;
          }
        }
      }
      if (result[i].tags !== undefined && result[i].tags.length !== 0) {
        for (var j = 0; j < result[i].tags.length; j++) {
          if (search.includes(result[i].tags[j])) {
            if (searchArr[searchArr.length-1] !== result[i]) {
              searchArr.push(result[i]);
              break;
            }
          }
        }
        if (searchArr.length == req.params.num) {
          break;
        }
      }
    }
    res.send(searchArr);
  })
});
