var Foglet = require("foglet");

var foglet = new Foglet({protocol:"chat"});
foglet.init();


foglet.on("receive",function(message){
  $(".resultSend").append(message);
});



function connect(){
  foglet.connection();
  //toto.setValue(50);
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

var value = toto.getValue();

toto.setValue("WhatYouWantHere");
