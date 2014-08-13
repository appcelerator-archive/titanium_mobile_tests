exports.run = function() {
	var a = require('./a');
	var b = require('./b');

	should(a.a).not.be.type('undefined');
	should(b.b).not.be.type('undefined');
	should(a.a().b).eql(b.b);
	should(b.b().a).eql(a.a);
};