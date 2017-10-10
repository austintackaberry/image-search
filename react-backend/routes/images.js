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

app.get('/:num', function(req,res) {
  console.log("request received");
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
