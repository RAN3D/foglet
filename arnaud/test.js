var Spray = require('spray-wrtc');

var spray = null;
var id = null;
var ticket = null;
var stampedTicket = null;

function createSpray(pseudo){
  // #0 initialize the membership protocol with a unique identifier and WebRTC
  // options. Spray allows options.deltatime (interval of time between the
  // proactive exchanges) and option.timeout.
  spray = new Spray(pseudo, {});
  id = spray.ID;

  // #1 check if the network is ready to emit messages with callback
  spray.ready( function(){
    console.log('I can send messages');
  }, function(){
    console.log("I can't send messages");
  });
  // #2 get a set of links to communicate with the neighborhood. The parameter k
  // is the number of neighbors requested. The membership protocol provides as
  // much peer as possible to meet the request.
  var links = spray.getPeers(10);

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
    console.log('I received a message for the protocol '+ message.protocol);
    socket.send('Thank you!');
  });

  $(".result").html("<p class='ticketId'>Spray Initialized : "+id+" </p> ");
}

function makeOffer(){
  // #A setup the first connection (@joining peer) - first step
  spray.launch( function(offerTicket){
    console.log(offerTicket);
    ticket=offerTicket;
    console.log(id);

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

function handshake(){
  // #C setup the first connection (@joining peer) - third step

  var val = $("#stampedTicket").html();
  console.log(val);
  var t = JSON.parse(val);
  spray.handshake( t );
}
