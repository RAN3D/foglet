var assert = require('chai').assert;
var expect = require('chai').expect;
var mocha = require('mocha');

var Foglet = require('../lib/foglet.js');
var FRegister = require('../lib/fregister.js').FRegister;
var InitConstructException = require('../lib/fexceptions.js').InitConstructException;
var ConstructException = require('../lib/fexceptions.js').ConstructException;
var FRegisterConstructException = require('../lib/fexceptions.js').FRegisterConstructException;
var FRegisterAddException = require('../lib/fexceptions.js').FRegisterAddException;

mocha.describe('[FOGLET:INIT]', function () {
	mocha.describe('#Init without option', function () {
		it('init throw InitConstructException when there is no option', function () {
			var fn = function () {
				(new Foglet())();
			};
			expect(fn).to.throw(InitConstructException);
		});
	});
	mocha.describe('#Init with options', function () {
		it('init throw a ConstructException when needed options are undefined', function () {
			var fn = function () {
				(new Foglet({
					protocol: null,
					room: null
				}))();
			};
			expect(fn).to.throw(ConstructException);
		});
	});
});

mocha.describe('[FOGLET:FREGISTER]', function () {
	mocha.describe('#addRegister without option', function () {
		it('should return a FRegisterConstructException when no option', function () {
			var fn = function () {
				(new FRegister())();
			};
			expect(fn).to.throw(FRegisterConstructException);
		});
		it('should return a FRegisterConstructException when options whit null value', function () {
			var fn = function () {
				(new FRegister({
					name: null,
					spray: null,
					vector: null,
					broadcast: null
				}))();
			};
			expect(fn).to.throw(FRegisterConstructException);
		});
	});
	mocha.describe('#addRegister  (run if a signaling server is running)', function () {
		it('should have options', function () {
			var fn = function () {
				var f = new Foglet({
					protocol: 'test',
					room: 'test'
				});
				var f1 = new Foglet({
					protocol: 'test',
					room: 'test'
				});
				f1.addRegister();
			};
			expect(fn).to.throw(FRegisterAddException);
		});
	});
});

mocha.describe('[FOGLET:EXCEPTION]', function () {
	mocha.describe('#InitConstructException has 2 properties', function () {
		it('has property named InitConstructException', function () {
			expect(new InitConstructException()).to.have.property('name', 'InitConstructException');
		});
		it('has property message', function () {
			expect(new InitConstructException()).to.have.property('message');
		});
	});
	mocha.describe('#ConstructException has 2 properties', function () {
		it('has property named ConstructException', function () {
			expect(new ConstructException()).to.have.property('name', 'ConstructException');
		});
		it('has property message', function () {
			expect(new ConstructException()).to.have.property('message');
		});
	});
	mocha.describe('#FRegisterConstructException has 2 properties', function () {
		it('has property named FRegisterConstructException', function () {
			expect(new FRegisterConstructException()).to.have.property('name', 'FRegisterConstructException');
		});
		it('has property message', function () {
			expect(new FRegisterConstructException()).to.have.property('message');
		});
	});
	mocha.describe('#FRegisterAddException has 2 properties', function () {
		it('has property named FRegisterAddException', function () {
			expect(new FRegisterAddException()).to.have.property('name', 'FRegisterAddException');
		});
		it('has property message', function () {
			expect(new FRegisterConstructException()).to.have.property('message');
		});
	});
});
