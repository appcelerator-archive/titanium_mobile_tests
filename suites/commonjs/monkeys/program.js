exports.run = function() {
	var a = require('./a');
	should(exports.monkey).eql(10);
};