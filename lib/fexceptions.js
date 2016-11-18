/**
 * Exceptions list
 */
'use strict';

class Exception {
	constructor(name, message) {
		this.name = name;
		this.message = message;
	}
}

module.exports.ConstructException = class ConstructException extends Exception {
	constructor() {
		super('ConstructException', 'Error: options.protocol or options.room is undefined or null');
	}
};

module.exports.InitConstructException = class InitConstructException extends Exception {
	constructor() {
		super('InitConstructException', 'Error: options is undefined');
	}
};

module.exports.FRegisterConstructException = class FRegisterConstructException extends Exception {
	constructor() {
		super('FRegisterConstructException', 'Error: options is not well-formated');
	}
};

module.exports.FRegisterAddException = class FRegisterAddException extends Exception {
	constructor() {
		super('FRegisterAddException', 'Error: addRegister need a name argument');
	}
};
