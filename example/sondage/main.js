var Foglet = require("foglet").Foglet;

var foglet,spray,sondage,votesData;
let f;
$(document).ready(function() {
	$('#survey').hide();
	$('#connection').show();
});


/**
Http request in order to get list of stun servers
**/
var iceServers = [];
$.ajax({
  url : "https://service.xirsys.com/ice",
  data : {
    ident: "folkvir",
    secret: "a0fe3e18-c9da-11e6-8f98-9ac41bd47f24",
    domain: "foglet-examples.herokuapp.com",
    application: "foglet-examples",
    room: "sondage",
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
    var foglet = new Foglet({
    	room: 'survey',
			protocol: 'survey',
      signalingAdress : "https://signaling.herokuapp.com/",
			wrtc:{
				trickle: true,
				iceServers: iceServers
			}
    });

    f = foglet;

    foglet.connection().then( () => {
			console.log('Your are now connected.');
			/**
	     * Create a register named sondage
	     * @param {[type]} "sondage" [description]
	     */
	    foglet.addRegister("sondage");

			/**
	     * Get the register
	     * @param  {[type]} "sondage" [description]
	     * @return {[type]}        [description]
	     */
	    sondage = foglet.getRegister("sondage");

	    /**
	     * Listening on the signal sondage-receive where every data are sent when the register is updated.
	     * @param  {[type]} "sondage-receive" [description]
	     * @param  {[type]} function(data  [description]
	     * @return {[type]}                [description]
	     */
	    sondage.on("sondage-receive",function(data){
	      changeData(sondage.getValue());
	    });
	    /**
	     * Set its value, and send by broadcast
	     * @param {[type]}
	     */
	    sondage.setValue([0,0]);
	    /*
	    * Votes data structure for d3
	    */
	    votesData=[
	    	{label:"Oui", color:"#2AABD2"},
	    	{label:"Non", color:"#265A88"}
	    ];
	    /*
	    * Create the canvas in chart id html tag
	    * and draw the pieGraph
	    */
	    var svg = d3.select("#chart").append("svg").attr("width",300).attr("height",300);
	    svg.append("g").attr("id","quotesDonut");
	    Donut3D.draw("quotesDonut", updateData(sondage.getValue()), 150, 150, 130, 100, 30, 0);

			$('#survey').show();
			$('#connection').hide();
		});
  }
});

/**
 * Set the register and update graph
 */
function setVotes(value){
  sondage.setValue(value);
  changeData(sondage.getValue());
}

/**
 * add a yes vote to register
 * and update graph
 */
function addYes(){
  value = sondage.getValue();
  setVotes([++value[0],value[1]]);
}

/**
 * add a No vote to register
 * and update graph
 */
function addNo(){
  value = sondage.getValue();
  setVotes([value[0],++value[1]]);
}

/*
* Update the canvas with new values
*/
function changeData(value){
  $('#yesLabel').html("Oui:" + value[0]);
  $('#noLabel').html("Non:" + value[1]);
  Donut3D.transition("quotesDonut", updateData(value), 130, 100, 30, 0);
}
function updateData(votes){
  return votesData.map(function(d,i){
    return {label:d.label, value:votes[i], color:d.color};
  });
}
