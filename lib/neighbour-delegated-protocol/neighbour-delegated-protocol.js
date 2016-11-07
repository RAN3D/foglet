const EventEmitter = require('events').EventEmitter;
const VVwE = require('version-vector-with-exceptions');

class NeighbourDelegatedProtocol extends EventEmitter {
	constructor(options) {
		super();
		if (options === undefined || options.spray === undefined) {
			// TODO THROW AN ERROR
		}
		this.options = options;
		this.vector = new VVwE(Number.MAX_VALUE);
		this.spray = options.spray;
		this.maxPeers = options.maxPeers || 2;
	}

	send() {
		const peers = this.spray.getPeers(this.maxPeers);
		for (let i = 0; i < peers.length(); ++i) {
			console.log(peers[i]);
		}
	}
}

module.exports = NeighbourDelegatedProtocol;
