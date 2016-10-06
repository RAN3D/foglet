var express = require("express");
var app = express();
var http = require('http').Server(app);

var io = require("socket.io")(http);


var joinningPeer = null;

app.use(express.static(__dirname + "/"));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});


io.on('connection', function(socket){
  console.log('A user connected');

  socket.on("lunch",function(offerTicket){
    console.log("**********BEGIN LUNCH EVENT*************");
    console.log(offerTicket);
    //ON ACCEPTE LA REQUETE DU CLIENT QUI VEUT SE CONNECTER ET LA LUI RENVOIE
    joinningPeer = socket;
    console.log(joinningPeer);
    socket.broadcast.emit("accept",offerTicket);
    console.log("**********END LUNCH EVENT*************");
  });

  socket.on("answer",function(stampedTicket){
    console.log("**********BEGIN ANSWER EVENT*************");
    console.log(joinningPeer);
    console.log(stampedTicket);
    joinningPeer.emit("handshake",stampedTicket);
    console.log("**********BEGIN ANSWER EVENT*************");
  });

  socket.on('disconnect', function(){
    console.log('A user disconnected');
  });
});


http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
