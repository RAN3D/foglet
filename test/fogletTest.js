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
						iceServers: [{urls: ['stun:23.21.150.121:3478',
							'stun:stun.l.google.com:19305',
							'stun:stun2.l.google.com:19305',
						 	'stun:stun3.l.google.com:19305',
							'stun:stun4.l.google.com:19305',
						]}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			assert(f.status, 'initialized', 'Return a correct status after initialization');
			f.disconnect();
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
						iceServers: [{urls: ['stun:23.21.150.121:3478',
							'stun:stun.l.google.com:19305',
							'stun:stun2.l.google.com:19305',
						 	'stun:stun3.l.google.com:19305',
							'stun:stun4.l.google.com:19305',
						]}]
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
			      iceServers: [{urls: ['stun:23.21.150.121:3478',
							'stun:stun.l.google.com:19305',
							'stun:stun2.l.google.com:19305',
						 	'stun:stun3.l.google.com:19305',
							'stun:stun4.l.google.com:19305',
						]}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			f.init();
			f1.init();
			// @Firefox: we are waiting for the initialization is well established.
			setTimeout(function(){
				f1.connection().then(function(){
					assert(f.status, f1.status, "status need to be 'connected' !");
					done();
				},function(error){
					console.log(error);
					done();
				});
			}, 2000);
			f.disconnect();
			f1.disconnect();
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
	describe('#addRegister with well-formed options', function () {
		it('A register should have a name', function () {
			var fn = function () {
				var f = new Foglet({
					spray: new Spray({
						protocol:"test",
				    webrtc:	{
				      trickle: true,
							iceServers: [{urls: ['stun:23.21.150.121:3478',
								'stun:stun.l.google.com:19305',
								'stun:stun2.l.google.com:19305',
							 	'stun:stun3.l.google.com:19305',
								'stun:stun4.l.google.com:19305',
							]}]
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
						iceServers: [{urls: ['stun:23.21.150.121:3478',
							'stun:stun.l.google.com:19305',
							'stun:stun2.l.google.com:19305',
						 	'stun:stun3.l.google.com:19305',
							'stun:stun4.l.google.com:19305',
						]}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			f.init();
			f.addRegister('test');
			f.getRegister('test').setValue('a_value');
			let result = f.getRegister('test').getValue();
			assert.equal(result, 'a_value', 'Return the correct value');
			f.disconnect();
		});
		it('AntyEntropy test',function(){
			var f = new Foglet({
				spray: new Spray({
					protocol:"test",
			    webrtc:	{
			      trickle: true,
						iceServers: [{urls: ['stun:23.21.150.121:3478',
							'stun:stun.l.google.com:19305',
							'stun:stun2.l.google.com:19305',
						 	'stun:stun3.l.google.com:19305',
							'stun:stun4.l.google.com:19305',
						]}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			var f2 = new Foglet({
				spray: new Spray({
					protocol:"test",
			    webrtc:	{
			      trickle: true,
						iceServers: [{urls: ['stun:23.21.150.121:3478',
							'stun:stun.l.google.com:19305',
							'stun:stun2.l.google.com:19305',
						 	'stun:stun3.l.google.com:19305',
							'stun:stun4.l.google.com:19305',
						]}]
			    }
				}),
				protocol: 'test',
				room: 'test'
			});
			f.init();
			f2.init();
			f.addRegister('test');
			var register = f.getRegister("test");
			register.setValue("toto");
			f.connection();
			f2.connection();
			f2.addRegister('test');
			var register2 = f2.getRegister("test");
			//code before the pause
			setTimeout(function(){
			    var val = resgiter2.getValue();
					assert(val,'toto','Should be the right value.');
					f.disconnect();
					f2.disconnect();
			}, 2000);
		})
	});
});
