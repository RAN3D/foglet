
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Spray = require("spray-wrtc");
var VVwE = require("version-vector-with-exceptions");
var CausalBroadcast = require("causal-broadcast-definition");
var io = require("socket.io-client");
var wrtc = require("wrtc");


/**
 * [Foglet description]
 * @param {[type]} options [description]
 */
function Foglet(options){
  EventEmitter.call(this);
  this.options = options;
  this.spray = new Spray({
      deltatime: 1000*60*1,
      webrtc: {trickle:true}
  });
  this.broadcast = options.broadcast || null;
  this.vector = options.vector || null;
  this.signaling = createSignaling();
  if(this.spray == null || this.causal == null || this.vector == null){
    //this.setDefaultProperties();
  }
}


/**
 * [init description]
 * @return {[type]} [description]
 */
Foglet.prototype.init = function(){
  //TODO
  flog(" Initialisation ");
}

/**
 * [createRegister description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Foglet.prototype.createRegister = function(name){
  //TODO
  flog(" New Register creation : "+name);
}


Foglet.prototype.setDefaultProperties = function(){
  this.spray = new Spray({
      deltatime: 1000*60*1,
      webrtc: {trickle:true}
  });
  this.vector = new VVwE(Number.MAX_VALUE);
  flog("lol2");
  this.broadcast = new CausalBroadcast(this.spray,this.vector);
  flog("lol3");
  this.broadcast.on("receive",function(msg){
    flog("broadcast-message:"+msg);
  });
  try{

  }catch(e){
    flog("Error during setting default properties...");
    console.log(e);
  }
}


/**
 * [callbacks description]
 * @param  {[type]} src  [description]
 * @param  {[type]} dest [description]
 * @return {[type]}      [description]
 */
var callbacks = function(src,dest){
    flog("Inside the callback function");
    return {
        onInitiate: function(offer){
          //console.log("Inside onInitiate ");
          this.signaling.emit("new",offer);
        },
        onAccept: function(offer){
          flog(offer);
          this.signaling.emit("accept",offer);
        },
        onReady: function(){
            try{
              flog(broadcast);
              this.sendMessage("New user connected " + this.spray.toString());
            }catch(e){
              console.log(e);
            }
            flog("Connection established");
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
 * [createSpray description]
 * @param  {[type]} pseudo [description]
 * @return {[type]}        [description]
 */
Foglet.prototype.connection =function(){
  if(this.spray !=null){
    this.spray.connection(callbacks(null,this.spray));
  }else{
    flog(" Error : spray undefined.");
  }
}

/**
 * [sendMessage description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
Foglet.prototype.sendMessage=function(msg){
  if(this.broadcast != null && this.vector != null){
      this.broadcast.send(message(msg),this.vector.increment());
  }else{
      flog("Error : broadcast or vector undefined.");
  }

}

/**
 ****************************************************
 ****************************************************
 ***************** PRIVATE FUNCTIONS ****************
 ****************************************************
 ****************************************************
 ****************************************************
 */

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
function createSignaling(destination){
  var url = getParameterByName("server") || "http://localhost:3000" ;
  this.signaling = io.connect(url);
  this.signaling.on("new_spray",function(data){
    console.log("@"+data.pid+" send a request to you...");
    this.spray.connection(callbacks(null,spray),data);
  });
  this.signaling.on("accept_spray",function(data){
    console.log("@"+data.pid+" accept your request...");
    this.spray.connection(data);
  });
}

/**
 * [flog description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
function flog(msg){
  console.log("[FOGLET]:"+msg);
}

module.exports = Foglet;
