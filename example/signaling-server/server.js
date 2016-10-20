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
  socket.on("joinRoom",function(room){
    socket.join(room);
  });

  socket.on("new",function(data){
        var room = data.room;
        var offer = data.offer;
        console.log("**********BEGIN LUNCH EVENT*************");
        //console.log(spray);
        joinningPeer = socket;
        socket.broadcast.in(room).emit("new_spray",offer);
        console.log("**********END LUNCH EVENT*************");
  });

  socket.on("accept",function(data){
    var room = data.room;
    var offer = data.offer;
    console.log("**********BEGIN ACCEPT EVENT*************");
    console.log(offer);
    if(joinningPeer != null){
        joinningPeer.emit("accept_spray",offer);
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
