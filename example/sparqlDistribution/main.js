const Spray = require("spray-wrtc");
const NDP = require("foglet-ndp").NDP;
const LaddaProtocol = require("foglet-ndp").LaddaProtocol;


/**
 * letiables
 */
let queries = []; // Queries to execute
let metadata = []; // Metadata array representing the query result and metadata
let metaNeighbourNumber; // Number of neighbour choose for the delegation
let queriesResults; // Number of result queries
let cptQuery = 0; // Number of query to execute
let f; // Export to the console the foglet
let execution = 0; // Number of execution
let nbNeighbours = 0; // Number of neighbours
let receiveResult = 0; // Number of received result
let waitingTimeConnection = 5000; // Time to wait before to initiate another connection


// time
const formatTime = time => `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
let startTime, endTime;
let connected = false;

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
      signalingServer : "https://foglet-examples.herokuapp.com/",
      delegationProtocol: new LaddaProtocol()
    });

		foglet.init();
    f = foglet;

    setInterval(function(){
      if(!connected){
        refreshConnection();
      }
    }, waitingTimeConnection);

    foglet.onUnicast((id, message) => {
      if(message.type === 'request'){
        updateNeighbours();
        logs('You are executing a query from a neighbour !');
      }
    });

    //We show the button in case of error logs
    $('#prepareMetadata').show();

    foglet.events.on("ndp-answer", function(message){
      let d = Object.assign({} , message);
      d.payload = message.payload.length;
      metadata.push(d);
      console.log(d);
    	onReceiveAnswer(message);
      receiveResult++;
      logs(" receive result n°" + receiveResult);
      if(receiveResult === queries.length){
        writeData();
      }else{
        $('#resultMetadata').hide();
      }
    });



	}
});

function writeData(){
  if(execution === 0){
    alert('You have to execute some queries before...');
    return;
  }
  hidePrepareDownload();
  let datas = {
    fogletId : f.id,
    executionNumber: execution,
    neighbours : metaNeighbourNumber,
    queryNumberToExecute: queries.length,
    resultNumberReceived: metadata.length,
    execution : metadata
  };
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datas, null, '\t'));
  let meta = $('#resultMetadata');
  console.log(meta);
  meta.attr("href", dataStr);
  const fileName = "metadata_"+execution+"_"+formatTime(new Date()).replace(':','-')+"_.json"
  meta.attr("download", fileName);
  $('#resultMetadata').show();
}

function hidePrepareDownload(){
  $('#resultMetadata').hide();
}

function refreshConnection(){
  logs(' Waiting connection...');
  f.connection().then(s => {
    console.log('Your are now connected !');
    logs('Your are now connected !');
    updateNeighbours();
    connected = true;
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
  metadata = [];
  updateNeighbours();
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
  metaNeighbourNumber = foglet.delegationProtocol.nbDestinations;
  // SEND QUERIES
  logs(" execution ...");
  foglet.send(queries, endpoint);
}

function logs(message){
  const d = new Date();
  const format = "<span style='color:red'>[" + formatTime(d) +"]</span>";
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
  console.log(data);
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
	let textQueries = document.getElementById('queries').value;
	queries = JSON.parse(textQueries);
}
