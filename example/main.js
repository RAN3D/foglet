var s = require("spray-wrtc");
var Foglet = require("foglet");
var foglet  = new Foglet({});


function connect(){
  foglet.connection();
}

function send(msg){
  foglet.sendMessage(msg);
}
