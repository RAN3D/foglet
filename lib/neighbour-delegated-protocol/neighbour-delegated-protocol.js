const EventEmitter = require('events').EventEmitter;
const VVwE = require('version-vector-with-exceptions');
const Unicast = require('unicast-definition');
const ldf = require("./Client.js-master/ldf-client.js");
const NDPMessage = require('./ndp-message.js');

const ENDPOINT = 'http://fragments.dbpedia.org/2015/en';

const fragmentsClient = new ldf.FragmentsClient(ENDPOINT);

function divideData(data, n){
	let dividedData = new Array(n);
	for (let i = 0; i <n; ++i) {
		dividedData[i] = new Array();
	}
	for (let i = 0; i < data.length; ++i) {
		dividedData[i%n] [dividedData[i%n].length] = data[i];
	}
	return dividedData;
}

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
			if (message.type === 'request') {
				// WE EXECUTE A CALLBACK FUNCTION NAMED 'execute' SENT BY THE OWNER OF THE MESSAGE
				//console.log('@NDP : An action was executed with success');
				self.execute(message.payload).then(function(result) {
					const msg = new NDPMessage({
						type: 'answer',
						id,
						payload: result
					});
					console.log(msg);
					self.unicast.send(msg, id);
				}).catch(function(){
					console.log("promesse rompue");
				});
			} else if (message.type === 'answer') {
				console.log('@NDP : A result received from ' + message.id);
				self.emit('receive', message);
				onReceiveAnswer(message);
			}
		});

		this.maxPeers = options.maxPeers || Number.MAX_VALUE;
	}
	
	/**
	*
	* @param data array of element to send (query)
	*
	**/
	send(data) {
	
		const peers = this.spray.getPeers(this.maxPeers);

		//calcul des requètes à envoyer
		const users = peers.i.length + peers.o.length + 1;
		console.log("Number of neightbours : ");
		console.log(peers);
		//Répartition...
		const dividedData = divideData(data,peers.i.length);
		
		for (let k = 0; k < peers.i.length; ++k) {
			const msg = new NDPMessage({
				type: 'request',
				id: peers.i[k],
				payload: dividedData[k]
			});
			this.unicast.send(msg, peers.i[k]);
		}
	}

	execute(data){
		console.log("Begin execution...");
		let resultat = new Array(data.length);
		let finishedQuery = 0;
		return new Promise(function(resolve,reject){
			for (let i = 0; i < data.length; ++i) {
				resultat[i] = new Array();
				let results = new ldf.SparqlIterator(data[i], { fragmentsClient: fragmentsClient });
				results.on('data', function (ldfResult) {
					resultat[i].push(JSON.stringify(ldfResult) + '\n');
				}).on('end', function () {
					++finishedQuery;
					console.log(finishedQuery);
					if (finishedQuery >= data.length){
						resolve(resultat);
					}
				});
			}
		});
	}
}

module.exports = NDP;
