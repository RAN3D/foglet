/**
 * Exceptions list
 */

class Exception {
	constructor(name, message) {
		this.name = name;
		this.message = message;
	}
}

module.exports.ConstructException = class ConstructException extends Exception {
	constructor() {
		super('ConstructException', 'Error: options.protocol is undefined');
	}
};
