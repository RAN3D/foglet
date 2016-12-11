var Spray = require("spray-wrtc");
var Foglet = require("foglet");

var spray = new Spray({
	protocol:"sprayExample",
	webrtc:	{
		trickle: true,
		iceServers: [{urls: ['stun:23.21.150.121:3478']}]
	}
});

/**
 * Create the foglet protocol.
 * @param {[type]} {protocol:"chat"} [description]
 */
var foglet = new Foglet({spray:spray, protocol:"sprayExample",room:"montecarlo"});

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
 * Create a register named montecarlo
 * @param {[type]} "montecarlo" [description]
 */
foglet.addRegister("montecarlo");

/**
 * Get the register
 * @param  {[type]} "montecarlo" [description]
 * @return {[type]}        [description]
 */
var montecarlo = foglet.getRegister("montecarlo");

/**
 * Listening on the signal montecarlo-receive where every data are sent when the register is updated.
 * @param  {[type]} "montecarlo-receive" [description]
 * @param  {[type]} function(data  [description]
 * @return {[type]}                [description]
 */
montecarlo.on("montecarlo-receive",function(data){
  changeData(montecarlo.getValue());
});

/**
 * Set the register and update graph
 */
function setVotes(value){
  montecarlo.setValue(value);
  changeData(montecarlo.getValue());
}

/**
 * Set its value, and send by broadcast
 * @param {[type]}
 */
montecarlo.setValue([0,1]);

/**
 * init local canvas (Monte carlo graph)
 */
initCanvas();

var localData = [0,0];
var previousUpdate = [0, 0];

function drawPoints() {
	var x = Math.random() * 2 - 1;
	var y = Math.random() * 2 - 1;

	if (Math.pow(x, 2) + Math.pow(y, 2) < 1){
		drawPoint(x, y, true);
		localData[0]++;
	} else {
		drawPoint(x, y, false);
	}
	localData[1]++;
	changeLocalData(localData);
}

setInterval(drawPoints, 10);

/**
 * Update the register
 */
function updateRegister() {
	var data = montecarlo.getValue();
	var dataToSet = [data[0]+localData[0]-previousUpdate[0], data[1]+localData[1]-previousUpdate[1]];
	montecarlo.setValue(dataToSet);
	previousUpdate = [localData[0], localData[1]];
}

setInterval(updateRegister, 4000);
