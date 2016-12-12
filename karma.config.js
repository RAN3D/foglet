// Karma configuration
// Generated on Thu Nov 03 2016 06:11:50 GMT+0100 (Paris, Madrid)
module.exports = function (config) {
	config.set({
		hostname: 'localhost',
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: './',
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['browserify', 'mocha', 'chai','express-http-server'],
		plugins: [
  		'karma-browserify',
			'karma-mocha',
			'karma-chai',
			'karma-coverage',
			'karma-mocha-reporter',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-express-http-server',
			'karma-edge-launcher',
			'karma-safari-launcher'
		],
		// list of files / patterns to load in the browser
		files: [
			'external-lib/spray-wrtc/build/spray-wrtc.bundle.js',
			'test/fexceptionsTest.js',
			'test/fogletTest.js',
			'test/ndpTest.js',
			'http://localhost:4000/socket.io/socket.io.js' //just only inject it
		],
		preprocessors:{
				'test/fexceptionsTest.js' : ['coverage','browserify'],
				'test/fogletTest.js' : ['coverage','browserify'],
				'test/ndpTest.js' : ['coverage','browserify']
		},
		// list of files to exclude
		exclude: [
			'example/**/*.js'
		],
		// browserify with babelify
		browserify: {
			debug: true,
			transform: [ ['babelify', {presets: ["es2015"]}], 'browserify-istanbul' ],
			configure: function(bundle) {
			 bundle.on('prebundle', function() {
				 bundle.external(['spray-wrtc','foglet']);
			 });
		 }
		},
		extensions: ['.js'],
		proxies : {
			'./': 'http://localhost:3000'
		},
		port:3000,
		expressHttpServer: {
        // this function takes express app object and allows you to modify it
        // to your liking. For more see http://expressjs.com/4x/api.html
        appVisitor: function (app, log) {
					let http = require('http').Server(app);
					let io = require("socket.io")(http);
					let number = 0;
					let joinningPeer = null;

					io.on('connection', function(socket){
						number++;
						log.info('A user connected - Number of members : '+number);
						socket.on("joinRoom",function(room){
							socket.join(room);
						});
						socket.on("new",function(data){
									let room = data.room;
									let offer = data.offer;
									log.info("**********BEGIN LUNCH EVENT*************");
									//console.log(spray);
									joinningPeer = socket;
									socket.broadcast.in(room).emit("new_spray",offer);
									log.info("**********END LUNCH EVENT*************");
						});
						socket.on("accept",function(data){
							let room = data.room;
							let offer = data.offer;
							log.info("**********BEGIN ACCEPT EVENT*************");
							log.info(offer);
							if(joinningPeer != null){
									joinningPeer.emit("accept_spray",offer);
							}
							joinningPeer = null;
							log.info("**********END ACCEPT EVENT*************");
						});
						socket.on('disconnect', function(){
							log.info('A user disconnected');
							number--;
						});
					});
					http.listen(4000, function () {
					  console.log('Signaling server listening on port 4000');
					});
        }
    },
    reporters: ['coverage', 'mocha'],

		coverageReporter: {
      // specify a common output directory
      dir: 'coverage',
      reporters: [
        // reporters not supporting the `file` property
        //{ type: 'html', subdir: 'report-html' },
        //{ type: 'lcov', subdir: 'report-lcov' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        { type: 'lcovonly', subdir: '.' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.'  },
      ],
			instrumenterOptions: {
        istanbul: { noCompact: false }
      }
    },

    logLevel: config.LOG_DISABLE,
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
    autoWatch: true,
		browserNoActivityTimeout:20000,
		colors: true,
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Firefox'],
		singleRun: true,
		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
};
