module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		titanium: {
			options: {
				// Task-specific options go here.
			},
			your_target: {
				// Target-specific file lists and/or options go here.
			},
		},
		ti_run: {
			options: {
				build: {
					platform: 'ios'
				}
			},
			myapp: {
				files: {
					'tmp/myapp': ['test/fixtures/myapp/**/*']
				}
			}
		},
		// linting
		appcJs: {
			src: [
				'Gruntfile.js',
				'suites/**/*.js'
			]
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-titanium');
	grunt.loadNpmTasks('grunt-appc-js');

	grunt.registerTask('lint', ['appcJs']);

	// Default task(s).
	grunt.registerTask('default', ['ti_run']);

};
