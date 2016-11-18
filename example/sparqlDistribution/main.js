var Foglet = require("foglet");

/**
 * Create the foglet protocol.
 * @param {[type]} {protocol:"chat"} [description]
 */
var foglet = new Foglet({
  protocol:"chat",
  room:"sparqlDistribution"
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
 * Ask the endpoint with the query
 * @param query the query to execute
 * @param id the index of the query in 'queries' variable
 */
function getQueryResult(query,id) {
	var resultPanel = document.createElement('div');
	//resultPanel.append('query ' + id + ' result' + '\n');
	//document.getElementById('resultPanel').appendChild(resultPanel);
	
	foglet.ndp.send(query);
}

/**
 * convert the value and send to ldf
 */
function send(){
	text2Object();
	for (i = 0; i < queries.length; i++) {
		getQueryResult(queries[i],i);
	}
	
}
