var Foglet = require("foglet");

var foglet = new Foglet({protocol:"chat"});

foglet.init();

foglet.on("receive",function(message){
  $(".resultSend").append(message);
});



function connect(){
  foglet.connection();
}

function sendMessage(msg){
  foglet.sendMessage(msg);
}
/*
try {
    foglet.addRegister("toto");
} catch (e) {
    console.log(e);
} finally {

}


var toto = foglet.getRegister("toto");
console.log(toto);
*/
