# Foglet

It is a Capstone Project for Fog Computing in Browsers.

This project aims to provide examples for Spray-wrtc protocol created by Chat-Wane (see References).

## Installation

Built and test with Node :  **v7.0.0**

Built and test with NPM  :  **v3.10.8**

Assume you have node and npm (Node Packet Manager) installed :
```bash
git clone http://github.com/folkvir/foglet.git
cd foglet
npm install
```

## Build
To build foglet.all.bundle.js and its dependencies run following commands :

```bash
#Production mode
npm run build
#Debug and Watch mode in order to recompile all modified code in ./lib
npm run build-watch
```

The bundle provided offers you to :
- ```javascript require("foglet") ```
- ```javascript require("spray-wrtc") ```
- ```javascript require("ldf-client") ```

## Run the example
Pre-condition: foglet.all.bundle.js built

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
Now open http://localhost:3000/sparqlDistribution

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

## Foglet.js Tests

Tests runs under [Karma](https://github.com/karma-runner/karma) with [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai)

In order to run tests in test/test.js with a verification of javascript guidelines :
```bash
npm test
```
It will execute the following commands :
```bash
npm run karma #Will execute karma start karma.config.js
```

It will runs tests under a browser, by default : Firefox, but you can easily change it in the config file.

In order to have coverage for test files :
```bash
npm run cover
```
It will produce coverage in the folder ./coverage.
The coverage is assumed by nyc (https://github.com/istanbuljs/nyc)

## Soon (Priority order)

- Travis support
- coveralls support
- Signaling server on Heroku


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
