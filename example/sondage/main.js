var Spray = require("spray-wrtc");
var Foglet = require("foglet");

/**
 * Create the foglet protocol.
 * @param {[type]} {protocol:"chat"} [description]
 */
 var spray = new Spray({
   protocol:"sprayExample",
   webrtc:	{
     trickle: true,
     iceServers: [{urls: ['stun:23.21.150.121:3478',
       'stun:stun.l.google.com:19305',
       'stun:stun2.l.google.com:19305',
       'stun:stun3.l.google.com:19305',
       'stun:stun4.l.google.com:19305',
     ]}]
   }
 });
var foglet = new Foglet({
	spray: spray,
	protocol: 'sprayExample',
	room: 'sondage'
});

/**
 * Init the foglet
 * @return {[type]} [description]
 */
foglet.init();

/**
 * Not usefull, it's just in case of a received message from Foglet
 * @param  {[type]} "receive"        [description]
 * @param  {[type]} function(message [description]
 * @return {[type]}                  [description]
 */
foglet.on("receive",function(message){
  console.log(message);
});


/**
 * Connect the client to another peer of the network.
 * @return {[type]} [description]
 */
//function connect(){
  foglet.connection();

/**
 * Not usefull, Send a message over Foglet
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
function sendMessage(msg){
  foglet.sendMessage(msg);
}

/**
 * Create a register named sondage
 * @param {[type]} "sondage" [description]
 */
foglet.addRegister("sondage");

/**
 * Get the register
 * @param  {[type]} "sondage" [description]
 * @return {[type]}        [description]
 */
var sondage = foglet.getRegister("sondage");

/**
 * Listening on the signal sondage-receive where every data are sent when the register is updated.
 * @param  {[type]} "sondage-receive" [description]
 * @param  {[type]} function(data  [description]
 * @return {[type]}                [description]
 */
sondage.on("sondage-receive",function(data){
  changeData(sondage.getValue());
});

/**
 * Set the register and update graph
 */
function setVotes(value){
  sondage.setValue(value);
  changeData(sondage.getValue());
}

/**
 * add a yes vote to register
 * and update graph
 */
function addYes(){
  value = sondage.getValue();
  setVotes([++value[0],value[1]]);
}

/**
 * add a No vote to register
 * and update graph
 */
function addNo(){
  value = sondage.getValue();
  setVotes([value[0],++value[1]]);
}

/**
 * Set its value, and send by broadcast
 * @param {[type]}
 */
sondage.setValue([0,0]);
