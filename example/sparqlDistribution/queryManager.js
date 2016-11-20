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
 * @param query the query to execute
 * @param id the index of the query
 */
function displayResult(queryResult,id) {
	var resultPanel = document.createElement('div');
	resultPanel.append('query ' + id + ' result' + '\n');
	document.getElementById('resultPanel').appendChild(resultPanel);
	var table = document.createElement("table");
	table.className += "resultTab";
	for (let i = 0; i < queryResult.length; ++i) {
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		td.innerHTML = queryResult[i];
		tr.appendChild(td);
		table.appendChild(tr);
	}
	resultPanel.appendChild(table);
}
