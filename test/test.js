// var assert = require('chai').assert;
// var expect = require('chai').expect;
// var mocha = require('mocha');

var Foglet = require('../lib/foglet.js');
var FRegister = require('../lib/fregister.js').FRegister;
var InitConstructException = require('../lib/fexceptions.js').InitConstructException;
var ConstructException = require('../lib/fexceptions.js').ConstructException;
var FRegisterConstructException = require('../lib/fexceptions.js').FRegisterConstructException;
var FRegisterAddException = require('../lib/fexceptions.js').FRegisterAddException;

describe('[FOGLET:INIT]', function () {
	describe('#Init without option', function () {
		it('init throw InitConstructException when there is no option', function () {
			var fn = function () {
				(new Foglet())();
			};
			expect(fn).to.throw(InitConstructException);
		});
	});
	describe('#Init with options', function () {
		it('init() throw a ConstructException when needed options are undefined', function () {
			var fn = function () {
				(new Foglet({
					protocol: null,
					room: null
				}))();
			};
			expect(fn).to.throw(ConstructException);
		});
		it('init() set the correct status with correct options', function () {
			var f = new Foglet({
				protocol: 'test',
				room: 'test'
			});
			assert(f.status, 'initialized', 'Return a correct status after initialization');
		});
	});
	describe('#Connection', function () {
		it('connection return connected as status', function () {
		// TODO USE KARMA TO TEST IN BROWSER
		});
	});
});

describe('[FOGLET:FREGISTER]', function () {
	describe('#addRegister without option', function () {
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
	describe('#addRegister  (run if a signaling server is running)', function () {
		it('should have options', function () {
			var fn = function () {
				var f = new Foglet({
					protocol: 'test',
					room: 'test'
				});
				f.addRegister();
			};
			expect(fn).to.throw(FRegisterAddException);
		});
		it('set a value and return the correct value', function () {
			var f = new Foglet({
				protocol: 'test',
				room: 'test'
			});
			f.init();
			f.addRegister('test');
			f.getRegister('test').setValue('a_value');
			assert.equal(f.getRegister('test').getValue(), 'a_value', 'Return the correct value');
		});
	});
});

describe('[FOGLET:EXCEPTION]', function () {
	describe('#InitConstructException has 2 properties', function () {
		it('has property named InitConstructException', function () {
			expect(new InitConstructException()).to.have.property('name', 'InitConstructException');
		});
		it('has property message', function () {
			expect(new InitConstructException()).to.have.property('message');
		});
	});
	describe('#ConstructException has 2 properties', function () {
		it('has property named ConstructException', function () {
			expect(new ConstructException()).to.have.property('name', 'ConstructException');
		});
		it('has property message', function () {
			expect(new ConstructException()).to.have.property('message');
		});
	});
	describe('#FRegisterConstructException has 2 properties', function () {
		it('has property named FRegisterConstructException', function () {
			expect(new FRegisterConstructException()).to.have.property('name', 'FRegisterConstructException');
		});
		it('has property message', function () {
			expect(new FRegisterConstructException()).to.have.property('message');
		});
	});
	describe('#FRegisterAddException has 2 properties', function () {
		it('has property named FRegisterAddException', function () {
			expect(new FRegisterAddException()).to.have.property('name', 'FRegisterAddException');
		});
		it('has property message', function () {
			expect(new FRegisterConstructException()).to.have.property('message');
		});
	});
});
