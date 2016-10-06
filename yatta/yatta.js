var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + "/"));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/yatta.html");
});

http.listen(4000,function(){console.log("listening on port 4000 : ");});
