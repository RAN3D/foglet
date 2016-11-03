var Foglet = require("foglet");

/**
 * Create the foglet protocol.
 * @param {[type]} {protocol:"chat"} [description]
 */
var foglet = new Foglet({protocol:"chat",room:"montecarlo"});

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
 * Create a register named toto
 * @param {[type]} "toto" [description]
 */
foglet.addRegister("toto");

/**
 * Get the register
 * @param  {[type]} "toto" [description]
 * @return {[type]}        [description]
 */
var toto = foglet.getRegister("toto");

/**
 * Listening on the signal toto-receive where every data are sent when the register is updated.
 * @param  {[type]} "toto-receive" [description]
 * @param  {[type]} function(data  [description]
 * @return {[type]}                [description]
 */
toto.on("toto-receive",function(data){
  changeData(toto.getValue());
});

/**
 * Set the register and update graph
 */
function setVotes(value){
  toto.setValue(value);
  changeData(toto.getValue());
}

/**
 * Set its value, and send by broadcast
 * @param {[type]}
 */
toto.setValue([0,1]);

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
	var data = toto.getValue();
	var dataToSet = [data[0]+localData[0]-previousUpdate[0], data[1]+localData[1]-previousUpdate[1]];
	toto.setValue(dataToSet);
	previousUpdate = [localData[0], localData[1]];
}

setInterval(updateRegister, 4000);


