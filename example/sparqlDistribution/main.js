var Spray = require("spray-wrtc");
var NDP = require("foglet-ndp").NDP;
var LaddaProtocol = require("foglet-ndp").LaddaProtocol;


/**
 * will contains the queries in the textArea
 */
var queries;
/**
 * will contains the results of each queries
 */
var queriesResults;
var cptQuery = 0;
var f;
var execution = 0;

let nbNeighbours = 0;
let receiveResult = 0;

$.ajax({
  url : "https://service.xirsys.com/ice",
  data : {
    ident: "folkvir",
    secret: "a0fe3e18-c9da-11e6-8f98-9ac41bd47f24",
    domain: "foglet-examples.herokuapp.com",
    application: "foglet-examples",
    room: "sparqldistribution",
    secure: 1
  }
  , success:function(response, status){
    console.log(status);
    console.log(response);
    /**
     * Create the foglet protocol.
     * @param {[type]} {protocol:"chat"} [description]
     */
    let iceServers;
     if(response.d.iceServers){
       iceServers = response.d.iceServers;
     }
     spray = new Spray({
       protocol:"sprayExample",
       webrtc:	{
         trickle: true,
         iceServers: iceServers
       },
       deltatime: 1000 * 60 * 15,
       timeout: 1000 * 60 * 60
     });
    foglet = new NDP({
      spray:spray,
      room:"sparqldistribution",
      signalingServer : "http://foglet-examples.herokuapp.com/"
      delegationProtocol: new LaddaProtocol()
    });
		foglet.init();
    f = foglet;

    refreshConnection();

    foglet.onUnicast((id, message) => {
      if(message.type === 'request'){
        logs('You are executing a query from a neighbour !');
      }
    });

    foglet.events.on("ndp-answer", function(message){
      console.log(message);
    	onReceiveAnswer(message);
      receiveResult++;
      logs(" receive result n°" + receiveResult);
    });



	}
});

function refreshConnection(){
  f.connection().then(s => {
    console.log('Your are now connected !');
    logs('Your are now connected !');
    updateNeighbours();
  });
}

function updateNeighbours(){
  receiveResult = 0;
  const nb = foglet.getNeighbours();
  nbNeighbours = nb.length;
  $('#leftBottom').html(' <p> #Neighbours : ' + nbNeighbours + '</p>')
}

/**
 * convert the value and send to other browsers
 */
function send(){
  execution++;
  cptQuery = 0;
  // GET QUERIES
	text2Object();

  logs("Get queries : #" + queries.length);

  // CLEAR RESULT PANEL
  $('#resultPanel').empty();

  // GET THE ENDPOINT
  const endpoint = $('#endpoint').val();
  logs("get endpoint : " + endpoint);

  //GET THE NUMBER NEIGHBOURS TO DELEGATE
  const delegateNumber = $('#delegateNumber').val();
  foglet.delegationProtocol.nbDestinations = delegateNumber;
  // SEND QUERIES
  logs(" execution ...");
  foglet.send(queries, endpoint);
}

function logs(message){
  const d = new Date();
  const format = "<span style='color:red'>[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()+"]</span>";
  $('#leftContent').append("<p>"+ format +"[Execution n°:" + execution + "]" + message +"</p>");
}

function createPanel(data, i, id){
  console.log("***********************************");
  console.log(data);
  //console.log(i);
  let panel = "<div class='panel panel-primary'>";
  panel += "<div class='panel-heading' onclick=\"$('#queries_" + i + "').toggle()\">";
  panel += "<h3 class='panel-title'>Result n°: " + i + " Done by : " + id + " (click to see more...)</h3>";
  panel += "</div>";
  //console.log(panel);
  let content = "<table class='table table-responsive'>";
  content += "<thead><th> Subject </th> <th> Predicate </th> <th> Object </th> </thead>";
  content += "<tbody>";
  //console.log(content);
  for(let i = 0; i < data.length; i++){
    content += "<tr>";
    for(let p in data[i]){
        content += "<td> " + data[i][p] + " </td>";
    }
    content += "</tr>";
  }
  content += "</tbody>";
  content += "</table>";
  panel += "<div class='panel-body' style='display:none' id='queries_" +i + "' >" + content + "</div></div>";
  //console.log(panel);
  $('#resultPanel').append(panel);
}

/**
 * When the browser receive an answer
 */
function onReceiveAnswer(msg){
	//for (let i = 0; i < msg.payload.length; ++i) {
		createPanel(msg.payload,cptQuery, msg.id);
		++cptQuery;
	//}
}

/**
 * convert the value of the textArea into a javascript object
 */
function text2Object(){
	var textQueries = document.getElementById('queries').value;
	queries = JSON.parse(textQueries);
}
