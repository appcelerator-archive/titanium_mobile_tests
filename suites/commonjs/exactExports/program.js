exports.run = function() {
	var a = require('./a');
	should(a.program()).equal(exports);
};