var Spray = require("spray-wrtc");
var ldf = require("ldf-client");
var Foglet = require("foglet");

var cptQuery = 0;
var ENDPOINT = 'http://fragments.dbpedia.org/2015/en';
var fragmentsClient = new ldf.FragmentsClient(ENDPOINT);

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
    foglet = new Foglet({
      spray:spray,
      protocol:"sprayExample",
      room:"sparqlDistribution",
      ndp:{
        ldf:ldf,
        fragmentsClient:fragmentsClient
      }
    });
		foglet.init();
    foglet.connection();
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


	}
});


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
