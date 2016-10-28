# Foglet
It is a Capstone Project for Fog Computing in Browsers.
This project aims to provide example for spray-wrtc protocol created by Chat-Wane (see References).

## Install
Assume you have node and npm (Node Packet Manager) installed :
```bash
git clone http://gitlab.com/folkvir/foglet.git
cd foglet
npm install
```

## Build
To build foglet.js and its dependencies run following commands :

```bash
#Production mode
npm run build
#Debug mode
npm run build-debug
#Debug and Watch mode in order to recompile all modified code in ./lib
npm run build-debug-watch
```

## Run the example
Pre-condition: foglet.bundle.debug.js built

Firstly we have to run a signaling server !
```bash
cd example/signaling-server
node server.js
```

Secondly run your http server  :
```bash
cd example/
node http-server.js
```

Or you can run the following command to run both commands with concurrently :
```bash
npm run server
```

Now open http://localhost:3000/sondage
Now open http://localhost:3000/montecarlo

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
#Run all commands in order to run the signaling server, the http server and the build in watch mode.
npm run dev-all
```

## References

Chat-Wane :
Keywords: Random peer sampling, adaptive, browser-to-browser communication, WebRTC

This project aims to provide a WebRTC implementation of Spray.

Spray is a random peer sampling protocol [1] inspired by both Cyclon [2] and Scamp [3]. It adapts the partial view of each member to the network size using local knowledge only. Therefore, without any configurations, each peer automatically adjust itself to the need of the network.

https://github.com/Chat-Wane/spray-wrtc/

[1] M. Jelasity, S. Voulgaris, R. Guerraoui, A.-M. Kermarrec, and M. Van Steen. Gossip-based peer sampling. ACM Transactions on Computer Systems (TOCS), 25(3):8, 2007.

[2] S. Voulgaris, D. Gavidia, and M. van Steen. Cyclon: Inexpensive membership management for unstructured p2p overlays. Journal of Network and Systems Management, 13(2):197–217, 2005.

[3] A. Ganesh, A.-M. Kermarrec, and L. Massoulié. Peer-to-peer membership management for gossip-based protocols. IEEE Transactions on Computers, 52(2):139–149, Feb 2003.

[4] A. Montresor and M. Jelasity. Peersim: A scalable P2P simulator. Proc. of the 9th Int. Conference on Peer-to-Peer (P2P’09), pages 99–100, Seattle, WA, Sept. 2009.
