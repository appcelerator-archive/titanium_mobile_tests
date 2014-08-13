exports.run = function() {
	should(function() {
		require('./submodule/a');
	}).throw();
};