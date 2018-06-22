var express = require('express')
var config = require('../config')
var sss = require('./server-bis.js')
var fs = require('fs')
var path = require('path')
var host = process.env.HOST || 'http://localhost'
// default port where dev server listens for incoming traffic
var port = parseInt(process.env.PORT) || config.dev.port
var express = require('express')
var app = express()
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../dist/index.html'));
});
app.use(express.static(__dirname + '/../dist'))
sss(app, console.log, host, port)
