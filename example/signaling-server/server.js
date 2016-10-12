var express = require("express");
var app = express();
var http = require('http').Server(app);

var io = require("socket.io")(http);

var number = 0;
var joinningPeer = null;

app.use(express.static(__dirname + "/"));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});



io.on('connection', function(socket){
  number++;
  console.log('A user connected - Number of members : '+number);


  socket.on("new",function(spray){
        console.log("**********BEGIN LUNCH EVENT*************");
        //console.log(spray);
        joinningPeer = socket;
        socket.broadcast.emit("new_spray",spray);
        console.log("**********END LUNCH EVENT*************");
  });

  socket.on("accept",function(spray){
    console.log("**********BEGIN ACCEPT EVENT*************");
    console.log(spray);
    if(joinningPeer != null){
        joinningPeer.emit("accept_spray",spray);
    }
    joinningPeer = null;
    console.log("**********END ACCEPT EVENT*************");
  });


  socket.on('disconnect', function(){
    console.log('A user disconnected');
    number--;
  });
});


http.listen(4000, function () {
  console.log('Signaling server listening on port 4000');
});
