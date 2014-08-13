/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("json", function() {
	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/1600-android-jsonstringify-incorrectly-handles-dates-including-silently-faiing
	it("jsonDates", function(finish) {
		// 11/11/11 11:11:11 (CST)
		var date = new Date(1321031471e3);
		should(JSON.stringify(date)).eql('"2011-11-11T17:11:11.000Z"');
		should(JSON.stringify({
			time: date
		})).eql('{"time":"2011-11-11T17:11:11.000Z"}');
		finish();
	});
	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/1976-android-jsonstringify-does-not-preserve-type
	it("numberTypes", function(finish) {
		// iOS and android have different but equally valid output for stringify
		var str = JSON.stringify([ "001", "002" ]);
		var result = '["001", "002"]' == str || '["001","002"]' == str;
		should(result).eql(true);
		str = JSON.stringify([ 1, 2 ]);
		result = "[1, 2]" == str || "[1,2]" == str;
		should(result).eql(true);
		finish();
	});
	// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2955-android-json-intake-inconsistency-compared-to-ios#ticket-2955-10
	it("booleanType", function(finish) {
		var a = JSON.parse(JSON.stringify([ true, false ]));
		should(a[0]).eql(true);
		should(a[1]).eql(false);
		a = JSON.parse(JSON.stringify([ "true", "false" ]));
		should(a[0]).eql("true");
		should(a[1]).eql("false");
		var o = JSON.parse(JSON.stringify({
			b1: true,
			b2: false,
			o1: {
				b3: true,
				b4: false
			}
		}));
		should(o.b1).eql(true);
		should(o.b2).eql(false);
		should(o.o1.b3).eql(true);
		should(o.o1.b4).eql(false);
		finish();
	});
	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/2614-jsonstringify-failing-for-droid
	it("wrappedObjects", function(finish) {
		var o = JSON.parse(JSON.stringify({
			"0": "asf"
		}));
		should(o[0]).eql("asf");
		o = JSON.parse(JSON.stringify([ "abc", "def" ]));
		should(o).eql([ "abc", "def" ]);
		o = JSON.parse(JSON.stringify({
			def: "abc"
		}));
		should(o.def).eql("abc");
		var user = "me";
		var pass = "mypass";
		var enc = "encoded";
		var credentials = {
			user_name: user,
			password: pass,
			encryption: enc
		};
		o = JSON.parse(JSON.stringify({
			"0": credentials,
			"1": "mobile",
			"2": {
				name_value_list: {}
			}
		}));
		should(o[0]).be.an.Object;
		should(o[0].user_name).eql(user);
		should(o[0].password).eql(pass);
		should(o[0].encryption).eql(enc);
		should(o[1]).eql("mobile");
		should(o[2]).be.an.Object;
		should(o[2].name_value_list).be.an.Object;
		finish();
	});
	// http://jira.appcelerator.org/browse/TIMOB-4876
	it("nativePrototypes", function(finish) {
		// general tests to ensure that objects returned
		// from JSON.parse are "real boys"
		// custom prototype functions on system types
		// we can test that these exist on the result of JSON.parse
		Object.prototype.objFunction = function() {
			return this;
		};
		Array.prototype.arrayFunction = function() {
			return this;
		};
		String.prototype.strFunction = function() {
			return this;
		};
		Boolean.prototype.boolFunction = function() {
			return this;
		};
		var o = JSON.parse('{"x": "1", "y": [1, 2, 3], "z": true}');
		should(o.hasOwnProperty).be.a.Function;
		should(o.propertyIsEnumerable).be.a.Function;
		should(o.constructor).eql(Object);
		should(o.objFunction).be.a.Function;
		should(o.objFunction()).be.equal(o);
		var props = [ "x", "y", "z" ];
		props.forEach(function(prop) {
			should(o.hasOwnProperty(prop)).be.true;
			should(o.propertyIsEnumerable(prop)).be.true;
		});
		should(Object.keys(o)).eql(props);
		var x = o.x;
		should(x).be.a.String;
		should(x.constructor).eql(String);
		should(x.strFunction).be.a.Function;
		should(x.strFunction()).eql("1");
		var y = o.y;
		should(y).be.Array;
		should(y.constructor).eql(Array);
		should(y.arrayFunction).be.a.Function;
		should(y.arrayFunction()).be.equal(y);
		var z = o.z;
		should(z).be.Boolean;
		should(z.constructor).eql(Boolean);
		should(z.boolFunction).be.a.Function;
		should(z.boolFunction()).eql(true);
		delete Object.prototype.objFunction;
		finish();
	});
	//KitchenSink: Platform
	it("jsonParse", function(finish) {
		var obj1 = JSON.parse('{"a": {"b": 1}}');
		should(obj1.a.b).eql(1);
		var obj2 = JSON.parse("[1, 2, 3]");
		should(obj2[0]).eql(1);
		should(obj2[1]).eql(2);
		should(obj2[2]).eql(3);
		var obj3 = JSON.parse("123");
		should(obj3).eql(123);
		var obj4 = JSON.parse("123.456");
		should(obj4).eql(123.456);
		finish();
	});
});