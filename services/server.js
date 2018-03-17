var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var app = express();
// API file for interacting with MongoDB
var api = require('./app');
// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// API location
app.use('/app', api);
//Set Port
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function () { return console.log("Running on localhost:" + port); });
