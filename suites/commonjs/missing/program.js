exports.run = function() {
	should(function() {
		require('bogus')
	}).throw();
};