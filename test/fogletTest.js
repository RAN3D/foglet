var Spray = require("spray-wrtc");

var Foglet = require('../lib/foglet.js');
var FRegister = require('../lib/fregister.js').FRegister;
var InitConstructException = require('../lib/fexceptions.js').InitConstructException;
var ConstructException = require('../lib/fexceptions.js').ConstructException;
var FRegisterConstructException = require('../lib/fexceptions.js').FRegisterConstructException;
var FRegisterAddException = require('../lib/fexceptions.js').FRegisterAddException;

/*************************************************************
 *************************************************************
 *************************************************************/

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
					spray:null,
					protocol: null,
					room: null
				}))();
			};
			expect(fn).to.throw(ConstructException);
		});
		it('init() set the correct status with correct options', function () {
			var f = new Foglet({
				spray: new Spray({
					protocol:"test",
			    webrtc:	{
			      trickle: true,
			      iceServers: [{urls: ['stun:23.21.150.121:3478']}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			assert(f.status, 'initialized', 'Return a correct status after initialization');
		});
	});
	describe('#Connection', function () {
		this.timeout(15000);
		it('connection return connected as status', function (done) {
			var f = new Foglet({
				spray: new Spray({
					protocol:"test",
			    webrtc:	{
			      trickle: true,
			      iceServers: [{urls: ['stun:23.21.150.121:3478']}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			var f1 = new Foglet({
				spray: new Spray({
					protocol:"test",
			    webrtc:	{
			      trickle: true,
			      iceServers: [{urls: ['stun:23.21.150.121:3478']}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			f.init();
			// @Firefox: we are waiting for the initialization is well established.
			setTimeout(function(){
				f1.init();
				f1.connection().then(function(){
					assert(f.status, f1.status, "status need to be 'connected' !");
					done();
				},function(error){
					done();
				});
			}, 2000);

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
					spray: new Spray({
						protocol:"test",
				    webrtc:	{
				      trickle: true,
				      iceServers: [{urls: ['stun:23.21.150.121:3478']}]
				    }
					}),
					protocol: 'test',
					room: 'test'
				});
				f.addRegister();
			};
			expect(fn).to.throw(FRegisterAddException);
		});
		it('set a value and return the correct value', function () {
			var f = new Foglet({
				spray: new Spray({
					protocol:"test",
			    webrtc:	{
			      trickle: true,
			      iceServers: [{urls: ['stun:23.21.150.121:3478']}]
			    }
				}),
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
