var ldf = require("ldf-client");
var Foglet = require("foglet");

var cptQuery = 0;
var ENDPOINT = 'http://fragments.dbpedia.org/2015/en';
var fragmentsClient = new ldf.FragmentsClient(ENDPOINT);



/**
* Create the foglet protocol.
* @param {[type]} {protocol:"chat"} [description]
*/
var spray = new Spray({
  protocol:"chat",
  webrtc:	{
    trickle: true,
    iceServers: [{urls: ['stun:23.21.150.121:3478']}]
  }
});
var foglet = new Foglet({
  protocol:"chat",
  room:"sparqlDistribution",
  ndp:{
    ldf:ldf,
    fragmentsClient:fragmentsClient
  }
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
	var resultPanel = document.createElement('div');
	resultPanel.append('query ' + id + ' result' + '\n');
	document.getElementById('resultPanel').appendChild(resultPanel);
	resultPanel.append(JSON.stringify(result) + '\n');
});


/**
 * Connect the client to another peer of the network.
 * @return {[type]} [description]
 */
  foglet.connection();


/**
 * will contains the queries in the textArea
 */
var queries;
/**
 * will contains the results of each queries
 */
var queriesResults;

/**
 * convert the value of the textArea into a javascript object
 */
function text2Object(){
	var textQueries = document.getElementById('queries').value;
	queries = JSON.parse(textQueries);
}

/**
 * convert the value and send to other browsers
 */
function send(){
	text2Object();
	foglet.ndp.send(queries);
}

/**
 * When the browser receive an answer
 */
function onReceiveAnswer(msg){
	for (let i = 0; i < msg.payload.length; ++i) {
		displayResult(msg.payload[i],cptQuery);
		++cptQuery;
	}
}
