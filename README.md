# Foglet [![Build Status](https://travis-ci.org/RAN3D/foglet.svg?branch=master)](https://travis-ci.org/RAN3D/foglet) [![Heroku Support](https://img.shields.io/badge/Heroku-online-brightgreen.svg)](http://foglet-examples.herokuapp.com/) [![XirSys WebRTC Cloud Support](https://img.shields.io/badge/XirSys%20Cloud-used-blue.svg)](http://xirsys.com/)

It is a Capstone Project for Fog Computing in Browsers.

This project aims to provide examples for Spray-wrtc protocol created by Chat-Wane (see References).

We used a list of ice servers provided by [Xirsys WebRTC Cloud](http://xirsys.com/) in order to provide functionnal examples.

## Installation

Built and test with Node :  **v7.0.0**

Built and test with NPM  :  **v3.10.8**

Assume you have node and npm (Node Packet Manager) installed :
```bash
git clone http://github.com/folkvir/foglet.git
cd foglet
npm install
npm run install:all
```

## Build
To build foglet.all.bundle.js and its dependencies run following commands :

```bash
#In order to build all files
npm run build:all
#Debug and Watch mode in order to recompile all modified code in ./lib
npm run build:watch
```

## Run the example
Firstly we have to run a signaling server, and an http server, we have both in one server !
```bash
npm run server
```

Secondly, all links are in http://localhost:3000/ (or available on http://foglet-examples.herokuapp.com/)

Now open [Sondage Example](http://localhost:3000/sondage)

Now open [Montecarlo Example](http://localhost:3000/montecarlo)

Now open [Sparql Distribution Example](http://localhost:3000/sparqlDistribution)

System functionning :
* 1 user connected : nothing to do
* 2 user connected, if peer-1 want to join the network :
      * Peer-1 create an offer ticket sent to the signaling server
      * Signaling server send the offer ticket to all clients connected on the adress, here Peer-2
      * Peer-2 or other Clients create an Accept ticket and re-send it to the server
      * The server send the first accept ticket to Peer-1
      * Peer-1 can join the network, the connection is now established.

## Foglet.js Development

```bash
#Install all dependencies
npm install
```

## Write your Foglet example

If you do not provide a list of ice servers your example will not work on the web but will work on your local network.
Examples with iceServers are provided by us in our list of examples.

But to be begin here is a simple example, after building Spray and Foglet you can write something like this:
```javascript
     // Require at least those two libraries
     var Foglet = require('foglet').Foglet;

    // Construction of our protocol
    var foglet = new Foglet({
    	protocol: '[your-protocol-name]',
    	room: '[your-example-name]'
    });


    // Connect our Foglet to an example
    foglet.connection().then(() => {
			console.log('You are now connected !');
	});

    //Now your example is connected !
```

If you want to use our Register Protocol you can write this (after the previous connection):

```javascript
     // Create a register named sondage
    foglet.addRegister("[your-register-name]");

    // Get the register
    var reg = foglet.getRegister("[your-register-name]");

    // Listening on the signal [your-register-name]-receive where every data are sent when the register is updated.
    reg.on("[your-register-name]-receive", function(data){
      console.log(data);
    });

    // Set its value, and send it by broadcast
    var value = [0,0]
    reg.setValue(value);

```

If you want to use The NDP protocol (Neighbour Delegated Protocol) alias foglet-ndp ``` npm install foglet-ndp```.
So to use it write your example like this:

```javascript
		var Foglet = require("foglet-ndp");

		var ENDPOINT = 'https://query.wikidata.org/bigdata/ldf';
		var fragmentsClient = new ldf.FragmentsClient(ENDPOINT);

		foglet = new Foglet({
		    spray:spray,
		    protocol:"[your-protocol-name]",
		    room:"[your-example-name]"
		});

		foglet.init();
		foglet.connection().then(() => {
			console.log('You are now connected !');
		});
		var endpoint = 'https://localhost:5000/'
    var somethingToSend = ['query1','query2']; // The Type is only array
    foglet.ndp.send(somethingToSend, endpoint);
		// Retreive a message send by a broadcast foglet and by ndp protocol...
		foglet.on("ndp-answer",function(message){
		    console.log(message);
		});
```

## References

**T. Minier** alias [Callidon](https://github.com/Callidon) :  for contributions on ES6 references and testing tools.

**Chat-Wane** :
Keywords: Random peer sampling, adaptive, browser-to-browser communication, WebRTC

This project aims to provide a WebRTC implementation of Spray.

Spray is a random peer sampling protocol [1] inspired by both Cyclon [2] and Scamp [3]. It adapts the partial view of each member to the network size using local knowledge only. Therefore, without any configurations, each peer automatically adjust itself to the need of the network.

https://github.com/Chat-Wane/spray-wrtc/

[1] M. Jelasity, S. Voulgaris, R. Guerraoui, A.-M. Kermarrec, and M. Van Steen. Gossip-based peer sampling. ACM Transactions on Computer Systems (TOCS), 25(3):8, 2007.

[2] S. Voulgaris, D. Gavidia, and M. van Steen. Cyclon: Inexpensive membership management for unstructured p2p overlays. Journal of Network and Systems Management, 13(2):197–217, 2005.

[3] A. Ganesh, A.-M. Kermarrec, and L. Massoulié. Peer-to-peer membership management for gossip-based protocols. IEEE Transactions on Computers, 52(2):139–149, Feb 2003.

[4] A. Montresor and M. Jelasity. Peersim: A scalable P2P simulator. Proc. of the 9th Int. Conference on Peer-to-Peer (P2P’09), pages 99–100, Seattle, WA, Sept. 2009.
