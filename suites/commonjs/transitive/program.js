exports.run = function() {
	should(require('./a').foo()).eql(1);
};