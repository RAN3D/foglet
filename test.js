  console.log("click ok");
  var Spray = require('spray-wrtc');

  // #0 initialize the membership protocol with a unique identifier and WebRTC
  // options. Spray allows options.deltatime (interval of time between the
  // proactive exchanges) and option.timeout.
  var spray = new Spray("folkvir", {});

  // #A setup the first connection (@joining peer) - first step
  spray.launch( function(offerTicket){
    manuallyGiveToTheKnownPeer(offerTicket);
  });

  // #B setup the first connection (@known peer) - second step
  spray.answer(offerTicket, function(stampedTicket){
    manuallyGiveToTheJoiningPeer(stampedTicket);
  });

  // #C setup the first connection (@joining peer) - third step
  spray.handshake(stampedTicket);

  // #1 check if the network is ready to emit messages with callback
  spray.ready( function(){
    console.log('I can send messages');
  });

  // #2 get a set of links to communicate with the neighborhood. The parameter k
  // is the number of neighbors requested. The membership protocol provides as
  // much peer as possible to meet the request.
  var links = spray.getPeers(k);

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
    socket.send(new ReponseMessageExample('Thank you!'));
  });
