var Spray = require('spray-wrtc');
var spray = null;
var id = null;
var ticket = null;
var stampedTicket = null;

var signaling = null;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createOnSignaling(destination){
  signaling = io.connect(getParameterByName("server"));
  signaling.on("accept",function(offerTicket){
    console.log("**********************");
    console.log(offerTicket);
    if(signaling == null || spray == null){
      console.log("Error with signaling or spray !");
    }else{
      console.log(">>>>[STATUS] Signaling & spray : OK ! ");
    }
    spray.answer(offerTicket,function(stampedTicket){
      console.log(stampedTicket);
      signaling.emit("answer",stampedTicket);
    });
    console.log("**********************");
  });

  signaling.on("handshake",function(stampedTicket){
    spray.handshake(stampedTicket)
    signaling.emit("disconnect");
  });


}

function createSpray(pseudo){
  // #0 initialize the membership protocol with a unique identifier and WebRTC
  // options. Spray allows options.deltatime (interval of time between the
  // proactive exchanges) and option.timeout.
  spray = new Spray(pseudo, {iceServers : [{url: null}]});
  id = spray.ID;
  createOnSignaling();



  // #3 events
  // #A emitted when the network state change; the possible states are
  spray.on('statechange', function(state){
    if (state==='connect') {console.log('I am connected!');};
    if (state==='partial') {console.log('Temporary state. Hopefully... ');};
    if (state==='disconnect') {console.log('I am disconnected');};
  });

  // #B emitted when the membership protocol receives a message. It requires that
  // the message carries a 'protocol' property. For instance, Spray handles the
  // event 'spray-receive'. The arguments are the socket from which the message is
  // received, and the message itself.
  spray.on('spray-receive', function(socket, message){
    console.log("*************************************************");
    console.log('I received a message for the protocol '+ message.protocol);
    console.log(message);
    //socket.emit("Thank you");
    console.log("*************************************************");
  });

  $(".result").html("<p class='ticketId'>Spray Initialized : "+id+" </p> ");
}

function makeOffer(){
  // #A setup the first connection (@joining peer) - first step
  spray.launch( function(offerTicket){
    console.log(offerTicket);
    signaling.emit("lunch",offerTicket);
    $(".resultOffer").html(JSON.stringify(offerTicket));
    $("#acceptOffer").val(JSON.stringify(offerTicket));
  });
}

function connecToTicket(ticketStringify){
  var ticket = JSON.parse(ticketStringify);
  // #B setup the first connection (@known peer) - second step
  console.log("Ticket provided: "+ticket);
  //console.log(ticket);
  spray.answer(ticket, function(stampedTicketSpray){
    console.log(stampedTicketSpray);
    $(".resultAccept").html("<p id='stampedTicket'>"+JSON.stringify(stampedTicketSpray)+"</p>");
  }),(function(){
      console.log($("#stampedTicket").html());
  });
}

function handshake(accepTicket){
  // #C setup the first connection (@joining peer) - third step
  var val = JSON.parse(accepTicket);
  console.log(val);
  spray.handshake( val );
}

function sendMessage(message){
  spray.ready( function(){
    console.log('I can send messages');
  });
  var message = {
    message : message ,
    protocol: "spray"
  };
  // #2 get a set of links to communicate with the neighborhood. The parameter k
  // is the number of neighbors requested. The membership protocol provides as
  // much peer as possible to meet the request.
  var links = spray.getPeers(10);
  console.log(links);
  for(var socket in links){
    links[socket].send(message);
  }
}
