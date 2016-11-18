'use strict';

const EventEmitter = require('events').EventEmitter;
const FRegisterConstructException = require('./fexceptions').FRegisterConstructException;

/**
 * Create a register
 * @param {[type]} options [description]
 */
class FRegister extends EventEmitter {
	constructor(options) {
		super();
		if (options !== undefined && options.name && options.name !== null && options.spray && options.spray !== null && options.vector && options.vector !== null && options.broadcast && options.broadcast !== null) {
			this.name = options.name;
			this.spray = options.spray;
			this.vector = options.vector;
			this.broadcast = options.broadcast;
			this.value = {};
			const self = this;
			this.broadcast.on('receive', data => {
				console.log('[FOGLET:' + self.name + '] Receive a new value');
				console.log(data);
				self.value = data;
				console.log(self.value);
				/**
				 * Emit a message on the signal this.name+"-receive" with the data associated
				 * @param  {[type]} self.name+"-receive" [description]
				 * @param  {[type]} self.value           [description]
				 * @return {[type]}                      [description]
				 */
				self.emit(self.name + '-receive', self.value);
			});

			this.broadcast.on('antiEntropy', (id, rcvCausality, lclCausality) => {
				// console.log("Receive antiEntropy request from @"+id);
				// console.log(self.value);
				try {
					const data = {
						protocol: self.name,
						id: {_e: self.vector.local.e, _c: self.vector.local.v},
						payload: self.value
					};
					self.broadcast.sendAntiEntropyResponse(id, lclCausality, [data]);
					// console.log("Sent an antiEntropy response with ");
					// console.log(data);
				} catch (err) {
					console.log(err);
				}
			});

			this.status = 'initialized';
		} else {
			throw new FRegisterConstructException();
		}
	}

	/**
	 * [function description]
	 * @return {[type]} [description]
	 */
	getValue() {
		return this.value;
	}

	/**
	 * [function description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	setValue(data) {
		this.value = data;
		this.send();
	}

	/**
	 * [function description]
	 * @return {[type]} [description]
	 */
	send() {
		this.broadcast.send(this.getValue(), this.vector.increment());
	}
}

module.exports.FRegister = FRegister;
