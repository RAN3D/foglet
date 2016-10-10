var VVwE = require("version-vector-with-exceptions");
var CausalBroadcast = require("causal-broadcast-definition");
var io = require("socket.io-client");
var FRegister = require("./fregister.js").FRegister;

/**
 * [Foglet description]
 * @param {[type]} options [description]
 */
function Foglet(options){
  this.options = options;
  if(!this.options.spray){
    flog("Error: spray is undefined");
    return;
  }
    this.spray = this.options.spray || null;
};


/**
 * [init description]
 * @return {[type]} [description]
 */
Foglet.prototype.init = function(){
  var self = this;
  this.vector = new VVwE(Number.MAX_VALUE);
  this.broadcast = new CausalBroadcast(this.spray,this.vector,this.options.protocol);

  //SIGNALING PART
  var url = getParameterByName("server") || "http://localhost:3000" ;
  this.signaling = io.connect(url);;
  this.callbacks = function(src,dest){
      return {
          onInitiate: function(offer){
            self.signaling.emit("new",offer);
          },
          onAccept: function(offer){
            flog("Accept Offer :");
            console.log(offer);
            self.signaling.emit("accept",offer);
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
    self.spray.connection(self.callbacks(self.signaling,spray),data);
  });
  this.signaling.on("accept_spray",function(data){
    console.log("@"+data.pid+" accept your request...");
    self.spray.connection(data);
  });
  this.registerList = {};
};


Foglet.prototype.addRegister = function(name){
  var spray = this.spray;
  var vector = new VVwE(Number.MAX_VALUE);
  var broadcast = new CausalBroadcast(spray,vector,name)
  var options = {
    name:name,
    spray:spray,
    vector:vector,
    broadcast:broadcast
  };
  var reg = new FRegister(options);
  this.registerList[FRegisterKey(reg)]=reg;
};

Foglet.prototype.getRegister = function(name){
  return this.registerList[name];
}

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
Foglet.prototype.on = function(signal,broadcast,callback){
  broadcast.on(signal,callback);
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
 * [message description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
var message = function(msg){
  return "<hr/><p> broadcast-message : <span style='color:red'>"+msg+"</span></p>";
};

module.exports = Foglet;
