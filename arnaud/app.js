var express = require("express");
//var app = express();
//var http = require('http').Server(app);
var io = require("socket.io")(3000);
var wrtc = require("wrtc");
var Spray = require("spray-wrtc");

var spray = new Spray("server",{wrtc:wrtc})

app.use(express.static(__dirname + "/"));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});


io.on('connection', function(socket){
  console.log('A user connected');

  socket.on("lunch",function(offerTicket){
    console.log("Lunch : ");
    console.log(offerTicket);
    //ON ACCEPTE LA REQUETE DU CLIENT QUI VEUT SE CONNECTER ET LA LUI RENVOIE
    spray.answer(offerTicket,function(stampedTicket){
        socket.emit("accept",stampedTicket);
    })
  });

  socket.on('disconnect', function(){
    console.log('A user disconnected');
  });
});
