'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();
var dns = require('dns');
var bodyParser = require("body-parser");

// Basic Configuration 
var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, function(err, db){
  if (err) {
    console.log(err);
  }
  console.log(db);
});

var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  url: String,
  short_url: Number
});

var Url = mongoose.model('UrlStore', UrlSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/shorturl/:id", function (req, res) {
  var id = req.params.id;
  if (id) {
       Url.findOne({short_url: id}, function (err, data){
         res.redirect(301, data.url);
      });
  }
});

app.post("/api/shorturl/new", async function (req, res) {
    var bodyUrl = req.body.url;
  
    var regex = /^https?:\/\//i;
  
    if (regex.test(bodyUrl)) {
         var newUrl = new Url({url: bodyUrl, short_url: Math.floor(Math.random() * 1000000000)});
         newUrl.save();
         res.send(newUrl);  
    } else {
         res.json({"error":"invalid URL"});
    }
});
  
app.listen(port, function () {
  console.log('Node.js listening ...');
});