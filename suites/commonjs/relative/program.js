exports.run = function() {
	var a = require('relative/submodule/a');
	var b = require('relative/submodule/b');

	should(a.foo).eql(b.foo);
};