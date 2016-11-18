var ENDPOINT = 'http://fragments.dbpedia.org/2015/en'

var ldf = require('ldf-client');
var fragmentsClient = new ldf.FragmentsClient(ENDPOINT);

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
	resultPanel.append('query ' + id + ' result' + '\n');
	document.getElementById('resultPanel').appendChild(resultPanel);
	
	results = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient });
	results.on('data', function (result) {resultPanel.append(JSON.stringify(result) + '\n')});
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
