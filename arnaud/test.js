//var EventEmitter = require('events').EventEmitter;
var Spray = require('spray-wrtc');
var VVwE = require("version-vector-with-exceptions");
var CausalBroadcast = require("causal-broadcast-definition");

var spray = null;
var id = null;
var ticket = null;
var stampedTicket = null;
var vector = null;
var signaling = null;
var broadcast = null;


var opts = {deltatime: 1000*60*1,
            webrtc: {trickle:true}};
spray = new Spray(opts);

id = spray.ID;
console.log("******************INIT***********************");
console.log(spray);
console.log(id);
console.log("*********************************************");
try{
    vector = new VVwE(Number.MAX_VALUE);
    broadcast = new CausalBroadcast(spray,vector);
    broadcast.on("receive",function(message){
      console.log("Broadcast message : " + message);
      $(".resultSend").append("<hr/><p> <span> Broadcast Message : </span> "+message+" </p>");
    });
}catch(e){
  console.log(e);
}
createOnSignaling();

var callbacks = function(src,dest){
    console.log("Inside the callback function");
    return {
        onInitiate: function(offer){
          //console.log("Inside onInitiate ");
          signaling.emit("new",offer);
        },
        onAccept: function(offer){
          console.log(offer);
          signaling.emit("accept",offer);
        },
        onReady: function(){
            console.log("Connection established");
        }
    };
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createOnSignaling(destination){
  var url = getParameterByName("server") || "http://localhost:3000" ;
  signaling = io.connect(url);
  signaling.on("new_spray",function(data){
    console.log("@"+data.pid+" send a request to you...");
    spray.connection(callbacks(null,spray),data);
  });
  signaling.on("accept_spray",function(data){
    console.log("@"+data.pid+" accept your request...");
    spray.connection(data);
  });
}

function createSpray(pseudo){
  spray.connection(callbacks(null,spray));
}

function sendMessage(message){
  broadcast.send(message,vector.increment());
}
