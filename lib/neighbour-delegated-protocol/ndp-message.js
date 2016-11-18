// Class representing Object
module.exports = class NDPMessage {
	constructor(options) {
		// Is 'answer' or 'request'
		this.type = options.type;
		// Owner id
		this.id = options.id;
		// Message to sent
		this.payload = options.payload;
	}
};
