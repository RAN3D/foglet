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


Now open http://localhost:3000/

All user connected on http://localhot:3000/ are now on the same P2P network after their connection by clicking on "Connection".
The server on http://url:3000 is here to put the page "online" and the signaling-server on http://url:4000 to connect all new user between them.
The server connection is just temporary.
After P2P connection, if the server is down, clients are always connected between them.

System functionning :
* 1 user connected : nothing to do
* 2 user connected, if peer-1 want to join the network :
      * Peer-1 create an offer ticket sent to the signaling server
      * Signaling server send the offer ticket to all clients connected on the adress, here Peer-2
      * Peer-2 or other Clients create an Accept ticket and re-send it to the server
      * The server send the first accept ticket to Peer-1
      * Peer-1 can join the network, the connection is now established.
