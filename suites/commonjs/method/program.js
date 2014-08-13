exports.run = function() {
	var a = require('./a');
	var foo = a.foo;

	should(a.foo()).eql(a);
	should(foo()).eql((function (){return this})());
	a.set(10);
	should(a.get()).eql(10);
};