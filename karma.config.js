// Karma configuration
// Generated on Thu Nov 03 2016 06:11:50 GMT+0100 (Paris, Madrid)
module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: './',
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['browserify', 'mocha', 'chai'],

		plugins: [
  		'karma-browserify',
			'karma-mocha',
			'karma-chai',
			'karma-coverage',
			'karma-mocha-reporter',
			'karma-chrome-launcher',
			'karma-firefox-launcher'
		],
		// list of files / patterns to load in the browser
		files: [
			'test/test.js'
		],
		preprocessors:{
				'test/test.js' : ['coverage','browserify'],
		},
		// list of files to exclude
		exclude: [
			'lib/spray-wrtc/lib/*.js'
		],

		browserify: {
			debug: true,
			transform: [ 'babelify' ]
		},

    reporters: ['coverage', 'mocha'],
		coverageReporter: {
      // specify a common output directory
      dir: 'coverage',
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
      ],
			instrumenterOptions: {
        istanbul: { noCompact: false }
      }
    },

    logLevel: config.LOG_DISABLE,
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    autoWatch: true,
		port: 9876,
		colors: true,
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome', 'Firefox'],
		singleRun: false,
		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
};
