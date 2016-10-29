var EventEmitter = require('events').EventEmitter;
var util = require('util');
var VVwE = require('version-vector-with-exceptions');
var CausalBroadcast = require('causal-broadcast-definition');
var io = require('socket.io-client');
var wrtc = require('wrtc');

var Spray = require('./spray-wrtc/lib/spray.js');
var FRegister = require('./fregister.js').FRegister;
var ConstructException = require('./fexceptions.js').ConstructException;
var InitConstructException = require('./fexceptions.js').InitConstructException;
var FRegisterAddException = require('./fexceptions.js').FRegisterAddException;

util.inherits(Foglet, EventEmitter);

/**
 * [Foglet description]
 * @param {[type]} options [description]
 */
function Foglet(options) {
	EventEmitter.call(this);
	if (options === undefined) {
		throw (new InitConstructException());
	}
	this.options = options;
	this.statusList = ['initialized', 'error', 'connected'];
	this.status = this.statusList[0];
	if (this.options.protocol !== undefined && this.options.protocol !== null && this.options.room !== undefined && this.options.room !== null) {
		this.room = this.options.room;
		this.protocol = this.options.protocol;
		this.spray = new Spray({
			protocol: this.protocol,
			wrtc: wrtc,
			webrtc:	{
				wrtc: wrtc,
				trickle: true,
				iceServers: [{urls: ['stun:23.21.150.121:3478']}]
			}
		});
		this.status = this.statusList[0];
		flog('Constructed');
	} else {
		this.status = this.statusList[1];
		throw (new ConstructException());
	}
}

/**
 * [init description]
 * @return {[type]} [description]
 */
Foglet.prototype.init = function () {
	var self = this;
	this.vector = new VVwE(Number.MAX_VALUE);
	this.broadcast = new CausalBroadcast(this.spray, this.vector, this.protocol);
	//	SIGNALING PART
  // 	THERE IS AN AVAILABLE SERVER ON ?server=http://signaling.herokuapp.com:4000/
	var url = null;
	try {
		url = getParameterByName('server');
	} catch (err) {
		console.log(err);
		url = 'http://localhost:4000';
	}
	//	Connection to the signaling server
	this.signaling = io.connect(url);
  //	Connection to a specific room
	this.signaling.emit('joinRoom', this.room);

	this.callbacks = function () {
		return {
			onInitiate: function (offer) {
				self.signaling.emit('new', {offer: offer, room: self.room});
			},
			onAccept: function (offer) {
				flog('Accept Offer :');
				console.log({
					offer: offer,
					room: self.room
				});
				self.signaling.emit('accept', {
					offer: offer,
					room: self.room
				});
			},
			onReady: function () {
				try {
					self.sendMessage('New user connected ' + self.spray.toString());
				} catch (err) {
					console.log(err);
				}
				self.status = self.statusList[2];
				flog('Connection established');
			}
		};
	};

	this.signaling.on('new_spray', function (data) {
		console.log('@' + data.pid + ' send a request to you...');
		self.spray.connection(self.callbacks(), data);
	});
	this.signaling.on('accept_spray', function (data) {
		console.log('@' + data.pid + ' accept your request...');
		self.spray.connection(data);
	});
	this.registerList = {};
	flog('Initialized');
};

/**
 * [function description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Foglet.prototype.addRegister = function (name) {
	if (name !== undefined && name !== null) {
		var spray = this.spray;
		var vector = new VVwE(Number.MAX_VALUE);
		var broadcast = new CausalBroadcast(spray, vector, name, 5000);
		var options = {
			name: name,
			spray: spray,
			vector: vector,
			broadcast: broadcast
		};
		var reg = new FRegister(options);
		this.registerList[fRegisterKey(reg)] = reg;
	} else {
		throw new FRegisterAddException();
	}
};

/**
 * [function description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Foglet.prototype.getRegister = function (name) {
	return this.registerList[name];
};

Foglet.prototype.onRegister = function (name, callback) {
	this.getRegister(name).on('receive', callback);
};

/**
 * [on description]
 * @param  {[type]}   signal   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Foglet.prototype.on = function (signal, callback) {
	this.broadcast.on(signal, callback);
};

/**
 * [createSpray description]
 * @param  {[type]} pseudo [description]
 * @return {[type]}        [description]
 */
Foglet.prototype.connection = function () {
	if (this.spray === null) {
		flog(' Error : spray undefined.');
	} else {
		this.spray.connection(this.callbacks());
	}
};

/**
 * [message description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
var message = function (msg) {
	return '<hr/><p> broadcast-message : <span style="color:red">' + msg + '</span></p>';
};

/**
 * [sendMessage description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
Foglet.prototype.sendMessage = function (msg) {
	if ((this.broadcast !== null) && (this.vector !== null)) {
		this.broadcast.send(message(msg), this.vector.increment());
		flog(' message sent : ' + msg);
	} else {
		flog('Error : broadcast or vector undefined.');
	}
};

/**
 * [getSpray description]
 * @return {[type]} [description]
 */
Foglet.prototype.getSpray = function () {
	return this.spray;
};
/**
 * [getCausalBroadcast description]
 * @return {[type]} [description]
 */
Foglet.prototype.getCausalBroadcast = function () {
	return this.broadcast;
};
/**
 * [getSignaling description]
 * @return {[type]} [description]
 */
Foglet.prototype.getSignaling = function () {
	return this.signaling;
};
/**
 * [getVector description]
 * @return {[type]} [description]
 */
Foglet.prototype.getVector = function () {
	return this.Vector;
};

/**
 ****************************************************
 ****************************************************
 ***************** PRIVATE FUNCTIONS ****************
 ****************************************************
 ****************************************************
 ****************************************************
 */

/**
 * [FRegisterKey description]
 * @param {[type]} obj [description]
 */
function fRegisterKey(obj) {
	return obj.name;
}

/**
 * [getParameterByName description]
 * @param  {[type]} name [description]
 * @param  {[type]} url  [description]
 * @return {[type]}      [description]
 */
function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	var results = regex.exec(url);
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
function flog(msg) {
	console.log('[FOGLET]:' + msg);
}

module.exports = Foglet;
