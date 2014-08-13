exports.run = function() {
	var a = require('absolute/submodule/a');
	var b = require('./b');

	should(a.foo().foo).equal(b.foo);
};