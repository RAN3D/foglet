const EventEmitter = require('events').EventEmitter;
const VVwE = require('version-vector-with-exceptions');
const CausalBroadcast = require('causal-broadcast-definition');
const io = require('socket.io-client');

const NDP = require('./neighbour-delegated-protocol/neighbour-delegated-protocol.js');
const FRegister = require('./fregister.js').FRegister;
const ConstructException = require('./fexceptions.js').ConstructException;
const InitConstructException = require('./fexceptions.js').InitConstructException;
const FRegisterAddException = require('./fexceptions.js').FRegisterAddException;

const SIGNALINGHOSTURL = 'http://localhost:3000/';
if(process.env.HOST){
	SIGNALINGHOSTURL = process.env.HOST;
}


/**
 * [Foglet description]
 * @param {[type]} options [description]
 */
class Foglet extends EventEmitter {
	constructor(options) {
		super();
		if (options === undefined) {
			throw (new InitConstructException());
		}
		this.options = options;
		this.statusList = ['initialized', 'error', 'connected'];
		this.status = this.statusList[0];
		// Activation of the foglet protocol
		if (this.options.spray !== undefined && this.options.spray !== null && this.options.protocol !== undefined && this.options.protocol !== null && this.options.room !== undefined && this.options.room !== null) {
			this.room = this.options.room;
			this.protocol = this.options.protocol;
			this.spray = this.options.spray;
			this.status = this.statusList[0];
			// Activation of the Neighbour-delegated-protocol
			if (this.options.ndp !== undefined && this.options.ndp !== null) {
				this.ndp = new NDP({
					spray: this.spray,
					protocol: this.protocol + '-' + this.room,
					ldf: this.options.ndp.ldf || undefined,
					fragmentsClient: this.options.ndp.fragmentsClient || undefined
				});
				const self = this;
				this.ndp.on('receive', data => {
					console.log(data);
					self.emit('receive', data);
				});
			} else {
				this._flog('Protocol NDP not activated');
			}
			this._flog('Constructed');
		} else {
			this.status = this.statusList[1];
			throw (new ConstructException());
		}
	}

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	init() {
		const self = this;
		this.vector = new VVwE(Number.MAX_VALUE);
		this.broadcast = new CausalBroadcast(this.spray, this.vector, this.protocol);
		//	SIGNALING PART
		// 	THERE IS AN AVAILABLE SERVER ON ?server=http://signaling.herokuapp.com:4000/
		let url = this._getParameterByName('server');
		if (url === null) {
			url = SIGNALINGHOSTURL;
		}
		this._flog('Signaling server used : ' + url);
		//	Connection to the signaling server
		this.signaling = io.connect(url);
		//	Connection to a specific room
		this.signaling.emit('joinRoom', this.room);

		this.callbacks = (resolve, reject) => {
			return {
				onInitiate: offer => {
					self.signaling.emit('new', {offer, room: self.room});
				},
				onAccept: offer => {
					self._flog('Accept Offer :');
					console.log({
						offer,
						room: self.room
					});
					self.signaling.emit('accept', {
						offer,
						room: self.room
					});
				},
				onReady: () => {
					try {
						self.sendMessage('New user connected ' + self.spray.toString());
					} catch (err) {
						console.log(err);
						reject();
					}
					self.status = self.statusList[2];
					self._flog('Connection established');
					resolve();
				}
			};
		};

		this.signaling.on('new_spray', data => {
			this._flog('@' + data.pid + ' send a request to you...');
			self.spray.connection(self.callbacks(), data);
		});
		this.signaling.on('accept_spray', data => {
			this._flog('@' + data.pid + ' accept your request...');
			self.spray.connection(data);
		});
		this.registerList = {};
		this._flog('Initialized');
	}

	/**
	 * [function description]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	addRegister(name) {
		if (name !== undefined && name !== null) {
			const spray = this.spray;
			const vector = new VVwE(Number.MAX_VALUE);
			const broadcast = new CausalBroadcast(spray, vector, name, 5000);
			const options = {
				name,
				spray,
				vector,
				broadcast
			};
			const reg = new FRegister(options);
			this.registerList[this._fRegisterKey(reg)] = reg;
		} else {
			throw (new FRegisterAddException());
		}
	}

	/**
	 * [function description]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	getRegister(name) {
		return this.registerList[name];
	}

	onRegister(name, callback) {
		this.getRegister(name).on('receive', callback);
	}

	/**
	 * [on description]
	 * @param  {[type]}   signal   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	on(signal, callback) {
		this.broadcast.on(signal, callback);
	}

	/**
	 * [createSpray description]
	 * @param  {[type]} pseudo [description]
	 * @return {[type]}        [description]
	 */
	connection() {
		if (this.spray === null) {
			this._flog(' Error : spray undefined.');
			return null;
		}
		const self = this;
		return new Promise((resolve, reject) => {
			self.spray.connection(self.callbacks(resolve, reject));
		});
	}

	disconnect() {
		if (this.spray === null) {
			this._flog(' Error : spray undefined.');
			return null;
		}
		this.spray.leave();
	}

	/**
	 * [sendMessage description]
	 * @param  {[type]} message [description]
	 * @return {[type]}         [description]
	 */
	sendMessage(msg) {
		if ((this.broadcast !== null) && (this.vector !== null)) {
			this.broadcast.send(this._message(msg), this.vector.increment());
			this._flog(' message sent : ' + msg);
		} else {
			this._flog('Error : broadcast or vector undefined.');
		}
	}

	/**
	 * [getSpray description]
	 * @return {[type]} [description]
	 */
	getSpray() {
		return this.spray;
	}
	/**
	 * [getCausalBroadcast description]
	 * @return {[type]} [description]
	 */
	getCausalBroadcast() {
		return this.broadcast;
	}
	/**
	 * [getSignaling description]
	 * @return {[type]} [description]
	 */
	getSignaling() {
		return this.signaling;
	}
	/**
	 * [getVector description]
	 * @return {[type]} [description]
	 */
	getVector() {
		return this.Vector;
	}

	/**
	 ****************************************************
	 ****************************************************
	 ***************** PRIVATE FUNCTIONS ****************
	 ****************************************************
	 ****************************************************
	 ****************************************************
	 */

	/**
 	 * [message description]
 	 * @param  {[type]} msg [description]
 	 * @return {[type]}     [description]
 	 */
	_message(msg) {
		return '<hr/><p> broadcast-message : <span style="color:red">' + msg + '</span></p>';
	}

	/**
	 * [FRegisterKey description]
	 * @param {[type]} obj [description]
	 */
	_fRegisterKey(obj) {
		return obj.name;
	}

	/**
	 * [getParameterByName description]
	 * @param  {[type]} name [description]
	 * @param  {[type]} url  [description]
	 * @return {[type]}      [description]
	 */
	_getParameterByName(name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, '\\$&');
		const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
		const results = regex.exec(url);
		if (!results) {
			return null;
		}
		if (!results[2]) {
			return '';
		}
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	/**
	 * [flog description]
	 * @param  {[type]} msg [description]
	 * @return {[type]}     [description]
	 */
	_flog(msg) {
		console.log('[FOGLET]:' + msg);
	}

}

module.exports = Foglet;
