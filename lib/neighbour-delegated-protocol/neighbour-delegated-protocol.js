const EventEmitter = require('events').EventEmitter;
const VVwE = require('version-vector-with-exceptions');
const Unicast = require('unicast-definition');

const NDPMessage = require('./ndp-message.js');

class NDP extends EventEmitter {
	constructor(options) {
		super();
		if (options === undefined || options.spray === undefined || options.protocol === undefined) {
			// TODO THROW AN ERROR
		}
		this.options = options;
		this.vector = new VVwE(Number.MAX_VALUE);
		this.spray = options.spray;
		this.unicast = new Unicast(this.spray, this.protocol + '-unicast');
		const self = this;
		this.unicast.on('receive', (id, message) => {
			console.log('@NDP: protocol:\'receive\' => a message received from : @' + id);
			console.log(message);
			if (message.type === 'request') {
				// WE EXECUTE A CALLBACK FUNCTION NAMED 'execute' SENT BY THE OWNER OF THE MESSAGE
				console.log('@NDP : An action was executed with success');
				var result = "success";
				const msg = new NDPMessage({
					type: 'answer',
					id,
					payload: result
				});
				this.unicast.send(msg, id);
			} else if (message.type === 'answer') {
				console.log('@NDP : A result received from ' + message.id);
				self.emit('receive', message);
			}
		});

		this.maxPeers = options.maxPeers || Number.MAX_VALUE;
	}

	send(data) {
		const peers = this.spray.getPeers(this.maxPeers);
		for (let k = 0; k < peers.i.length; ++k) {
			const msg = new NDPMessage({
				type: 'request',
				id: peers.i[k],
				payload: data
			});
			console.log(msg);
			this.unicast.send(msg, peers.i[k]);
		}
		for (let k = 0; k < peers.o.length; ++k) {
			const msg = new NDPMessage({
				type: 'request',
				id: peers.o[k],
				payload: data
			});
			console.log(msg);
			this.unicast.send(msg, peers.o[k]);
		}
	}
}

module.exports = NDP;
