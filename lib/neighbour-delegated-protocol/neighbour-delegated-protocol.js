const EventEmitter = require('events').EventEmitter;
const VVwE = require('version-vector-with-exceptions');
const Unicast = require('unicast-definition');
const ldf = require("./Client.js-master/ldf-client.js");
const NDPMessage = require('./ndp-message.js');

const ENDPOINT = 'http://fragments.dbpedia.org/2015/en';

const fragmentsClient = new ldf.FragmentsClient(ENDPOINT);

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
			//console.log('@NDP: protocol:"receive" => a message received from : @' + id);
			//console.log(message);
			if (message.type === 'request') {
				// WE EXECUTE A CALLBACK FUNCTION NAMED 'execute' SENT BY THE OWNER OF THE MESSAGE
				//console.log('@NDP : An action was executed with success');
				const result = self.execute(message.payload);
				const msg = new NDPMessage({
					type: 'answer',
					id,
					payload: result
				});
				//console.log(msg);
				self.unicast.send(msg, id);
			} else if (message.type === 'answer') {
				console.log('@NDP : A result received from ' + message.id);
				console.log(message);
				self.emit('receive', message);
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
		//console.log("Number of neightbours : ");
		//console.log(peers);
		//Répartition...
		// [ {request:["sql1","sql2"]}, {request:["sql3","sql4"]} ]
		//console.log(peers);
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
		//this.execute(data);
	}

	execute(data){
		console.log("Begin execution...");
		console.log(data);
		let result = {answer:['answer1','answer2']};
		let resultat = [];
		let promise = new Promise(function(resolve,reject){
			////console.log("****** begin promise");
			////console.log(data);
			let results = new ldf.SparqlIterator(data, { fragmentsClient: fragmentsClient });
			results.on('data', function (ldfResult) {
				//result.answer.push(JSON.stringify(ldfResult) + '\n');
				////console.log(ldfResult);
				////console.log("****** resolve promise");
				resultat.push(ldfResult);
			});

			window.setTimeout(function() {
		      // On tient la promesse !
		      //console.log("******* resolv promise");
		      resolve(resultat);
		    }, 10000);
		});
		promise.then(function(result){
			//console.log(result);
			//console.log("End execution !")
		}).catch(function(err){
			//console.log(err);
		});
		return resultat;
	}
}

module.exports = NDP;
