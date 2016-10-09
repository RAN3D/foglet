var io = require("socket.io");

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
 * [createOnSignaling description]
 * @param  {[type]} destination [description]
 * @return {[type]}             [description]
 */
function Signaling(spray){
  var url = getParameterByName("server") || "http://localhost:3000" ;
  var signaling = io.connect(url);
  signaling.on("new_spray",function(data){
    console.log("@"+data.pid+" send a request to you...");
    spray.connection(callbacks(null,spray),data);
  });
  signaling.on("accept_spray",function(data){
    console.log("@"+data.pid+" accept your request...");
    spray.connection(data);
  });
  return signaling;
};

var callbacks = function(src,dest){
    flog("Inside the callback function");
    return {
        onInitiate: function(offer){
          signaling.emit("new",offer);
        },
        onAccept: function(offer){
          flog(offer);
          signaling.emit("accept",offer);
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

module.exports = Signaling ;
