var express = require("express");
var app = express();
var http = require('http').Server(app);

var number = 0;
var joinningPeer = null;

app.use(express.static(__dirname + "/../"));

app.get('/:name', function(req, res){
  res.sendFile(__dirname + "/"+req.params.name+"/index.html");
});

http.listen(3000, function () {
  console.log('HTTP Server listening on port 3000');
});
