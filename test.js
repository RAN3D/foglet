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
    broadcast.on("receive",function(msg){
      $(".resultSend").append(msg);
    });

}catch(e){
  console.log(e);
}
createOnSignaling();



/**
 * [callbacks description]
 * @param  {[type]} src  [description]
 * @param  {[type]} dest [description]
 * @return {[type]}      [description]
 */
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
            try{
              console.log(broadcast);
              broadcast.send(message("New user connected " + spray.toString()),vector.increment());
            }catch(e){
              console.log(e);
            }
            console.log("Connection established");
        }
    };
};

/**
 * [message description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
var message = function(msg){
  return "<hr/><p> broadcast-message : <span style='color:red'>"+msg+"</span></p>";
}

/**
 * [getParameterByName description]
 * @param  {[type]} name [description]
 * @param  {[type]} url  [description]
 * @return {[type]}      [description]
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * [createOnSignaling description]
 * @param  {[type]} destination [description]
 * @return {[type]}             [description]
 */
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

/**
 * [createSpray description]
 * @param  {[type]} pseudo [description]
 * @return {[type]}        [description]
 */
function createSpray(pseudo){
  spray.connection(callbacks(null,spray));
}

/**
 * [sendMessage description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function sendMessage(msg){
  broadcast.send(message(msg),vector.increment());
}
