exports.run = function() {
	should(require('./a/b/c/d').foo()).eql(1);
};