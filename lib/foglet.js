var EventEmitter = require('events').EventEmitter;
var VVwE = require("version-vector-with-exceptions");
var CausalBroadcast = require("causal-broadcast-definition");
var io = require("socket.io-client");
var FRegister = require("./fregister.js").FRegister;
var Spray = require("spray-wrtc");
var wrtc = require("wrtc");
var util = require('util');

util.inherits(Foglet, EventEmitter);

/**
 * [Foglet description]
 * @param {[type]} options [description]
 */
function Foglet(options){
  EventEmitter.call(this);
  this.options = options;
  this.room = this.options.room;
  if(!this.options.protocol){
    throw("Error: options.protocol is undefined");
  }else{
    this.protocol = this.options.protocol;
    this.spray = new Spray({
      wrtc:wrtc,
      webrtc: {
        trickle:true ,
        iceServers: [{urls: ["stun:23.21.150.121:3478"]}]},
    });
    flog("Constructed")
  }
};


/**
 * [init description]
 * @return {[type]} [description]
 */
Foglet.prototype.init = function(){
  var self = this;
  this.vector = new VVwE(Number.MAX_VALUE);
  this.broadcast = new CausalBroadcast(this.spray,this.vector,this.protocol);
  //SIGNALING PART
  // THERE IS AN AVAILABLE SERVER ON ?server=http://signaling.herokuapp.com:4000/
  var url = getParameterByName("server") || "http://localhost:4000" ;

  //Connection to the signaling server
  this.signaling =  io.connect(url);
  //Connection to a specific room
  this.signaling.emit("joinRoom",this.room);
  
  this.callbacks = function(src,dest){
      return {
          onInitiate: function(offer){
            self.signaling.emit("new",{offer:offer,room:self.room});
          },
          onAccept: function(offer){
            flog("Accept Offer :");
            console.log({offer:offer,room:self.room});
            self.signaling.emit("accept",{offer:offer,room:self.room});
          },
          onReady: function(){
              try{
                self.sendMessage("New user connected " + self.spray.toString());
              }catch(e){
                console.log(e);
              }
              flog("Connection established");
          }
      };
  };
  this.signaling.on("new_spray",function(data){
    console.log("@"+data.pid+" send a request to you...");
    self.spray.connection(self.callbacks(null,self.spray),data);
  });
  this.signaling.on("accept_spray",function(data){
    console.log("@"+data.pid+" accept your request...");
    self.spray.connection(data);
  });
  this.registerList = {};
  flog("Initialized")
};

/**
 * [function description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Foglet.prototype.addRegister = function(name){
  var spray = this.spray;
  var vector = new VVwE(Number.MAX_VALUE);
  var broadcast = new CausalBroadcast(spray,vector,name,5000);
  var options = {
    name:name,
    spray:spray,
    vector:vector,
    broadcast:broadcast
  };
  var reg = new FRegister(options);
  this.registerList[FRegisterKey(reg)]=reg;
};

/**
 * [function description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Foglet.prototype.getRegister = function(name){
  return this.registerList[name];
};

Foglet.prototype.onRegister = function(name,callback){
  this.getRegister(name).on("receive",callback);
};

/**
 * [createRegister description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Foglet.prototype.createRegister = function(name){
  //TODO
  flog(" New Register creation : "+name);
};

/**
 * [on description]
 * @param  {[type]}   signal   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Foglet.prototype.on = function(signal,callback){
  this.broadcast.on(signal,callback);
}

/**
 * [createSpray description]
 * @param  {[type]} pseudo [description]
 * @return {[type]}        [description]
 */
Foglet.prototype.connection =function(){
  if(this.spray !=null){
    this.spray.connection(this.callbacks(null,this.spray));
  }else{
    flog(" Error : spray undefined.");
  }
};

/**
 * [sendMessage description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
Foglet.prototype.sendMessage=function(msg){
  if(this.broadcast != null && this.vector != null){
      this.broadcast.send(message(msg),this.vector.increment());
      flog(" message sent : "+msg);
  }else{
      flog("Error : broadcast or vector undefined.");
  }
};

Foglet.prototype.getSpray = function(){ return this.spray;};
Foglet.prototype.getCausalBroadcast = function(){ return this.broadcast;};
Foglet.prototype.getSignaling = function(){ return this.signaling;};
Foglet.prototype.getVector = function(){ return this.Vector;};

/**
 ****************************************************
 ****************************************************
 ***************** PRIVATE FUNCTIONS ****************
 ****************************************************
 ****************************************************
 ****************************************************
 */

/**
 * [FRegisterKey description]
 * @param {[type]} obj [description]
 */
function FRegisterKey(obj){
  return obj.name;
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
};

/**
 * [flog description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
function flog(msg){
  console.log("[FOGLET]:"+msg);
};

/**
 * [cflog description]
 * @param  {[type]} peer [description]
 * @return {[type]}      [description]
 */
function cflog(peer){
    return function(msg) {
      flog(msg);
    }
}

/**
 * [message description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
var message = function(msg){
  return "<hr/><p> broadcast-message : <span style='color:red'>"+msg+"</span></p>";
};

module.exports = Foglet;
