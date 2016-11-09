const EventEmitter = require('events').EventEmitter;
const VVwE = require('version-vector-with-exceptions');
const Unicast = require('unicast-definition');
class NDP extends EventEmitter {
	constructor(options) {
		super();
		if (options === undefined || options.spray === undefined || options.protocol === undefined) {
			// TODO THROW AN ERROR
		}
		this.options = options;
		this.vector = new VVwE(Number.MAX_VALUE);
		this.spray = options.spray;
		this.unicast = new Unicast(this.spray,this.protocol+"-unicast");
		const self = this;
		this.unicast.on("receive", (data) => {
			console.log("NDP:" + data);
			self.emit("receive",data);
		});
		this.maxPeers = options.maxPeers || Number.MAX_VALUE;
	}

	send() {
		const peers = this.spray.getPeers(this.maxPeers);
		console.log(peers.i);
		console.log(peers.o);
		for (let k = 0; k < peers.i.length; ++k) {
			this.unicast.send(peers.i[k]," => Request"+peers.i[k]);
		}
	}
}

module.exports = NDP;
