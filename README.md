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
