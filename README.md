# Foglet
It is a Capstone Project for Fog Computing in Browsers.

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

Firstly we have to run a signaling server ! In this example, the signaling server is also the http server which is an ExpressJs server running on the port 3000 in localhost.

In ./example run the following commands :
```bash
node server.js
```

Now open http://localhost:3000/

All user connected on http://localhot:3000/ are now on the same P2P network.
The server is here to put the page "online" and to connect all new user between them.

System functionning :
* 1 user connected : nothing to do
* 2 user connected, if peer-1 want to join the network :
      * Peer-1 create an offer ticket sent to the signaling server
      * Signaling server send the offer ticket to all clients connected on the adress, here Peer-2
      * Peer-2 or other Clients create an Accept ticket and re-send it to the server
      * The server send the first accept ticket to Peer-1
      * Peer-1 can join the network, the connection is now established.
