var Spray = require("spray-wrtc");
var Foglet = require("foglet");

var foglet,spray,montecarlo;

$.ajax({
  url : "https://service.xirsys.com/ice",
  data : {
    ident: "folkvir",
    secret: "a0fe3e18-c9da-11e6-8f98-9ac41bd47f24",
    domain: "foglet-examples.herokuapp.com",
    application: "foglet-examples",
    room: "montecarlo",
    secure: 1
  }
  , success:function(response, status){
    console.log(status);
    console.log(response);
    /**
     * Create the foglet protocol.
     * @param {[type]} {protocol:"chat"} [description]
     */
     if(response.d.iceServers){
       iceServers = response.d.iceServers;
     }
     spray = new Spray({
       protocol:"sprayExample",
       webrtc:	{
         trickle: true,
         iceServers: iceServers
       }
     });


    foglet = new Foglet({spray:spray, room:"montecarlo", signalingServer : "https://foglet-examples.herokuapp.com/"});
		foglet.init();
		foglet.on("receive",function(message){
		  console.log(message);
		});
		/**
		 * Connect the client to another peer of the network.
		 * @return {[type]} [description]
		 */
		 foglet.connection();
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
     montecarlo = foglet.getRegister("montecarlo");

     /**
      * Listening on the signal montecarlo-receive where every data are sent when the register is updated.
      * @param  {[type]} "montecarlo-receive" [description]
      * @param  {[type]} function(data  [description]
      * @return {[type]}                [description]
      */
     montecarlo.on("montecarlo-receive",function(data){
       changeData(montecarlo.getValue());
     });

     montecarlo.setValue([0,1]);

     /**
      * init local canvas (Monte carlo graph)
      */
     initCanvas();
     setInterval(drawPoints, 10);
     setInterval(updateRegister, 4000);
	}
});


/**
 * Not usefull, Send a message over Foglet
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
function sendMessage(msg){
  foglet.sendMessage(msg);
}

/**
 * Set the register and update graph
 */
function setVotes(value){
  montecarlo.setValue(value);
  changeData(montecarlo.getValue());
}

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

/**
 * Update the register
 */
function updateRegister() {
	var data = montecarlo.getValue();
	var dataToSet = [data[0]+localData[0]-previousUpdate[0], data[1]+localData[1]-previousUpdate[1]];
	montecarlo.setValue(dataToSet);
	previousUpdate = [localData[0], localData[1]];
}
