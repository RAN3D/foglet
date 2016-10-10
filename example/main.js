var Foglet = require("foglet");
var s = require("spray-wrtc");

var spray = new s({});
var foglet = new Foglet({spray:spray,protocol:"chat"});
foglet.init();

foglet.on("receive",foglet.getCausalBroadcast(),function(message){
  $(".resultSend").append(message);
});

function connect(){
  foglet.connection();
}

function sendMessage(msg){
  foglet.sendMessage(msg);
}
try {
    foglet.addRegister("toto");
} catch (e) {
    console.log(e);
} finally {

}


var toto = foglet.getRegister("toto");
console.log(toto);
