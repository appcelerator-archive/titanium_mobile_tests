/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("kroll", function() {
	it("tiSanity", function(finish) {
		should(Ti).not.be.null;
		should(Titanium).not.be.null;
		should(Ti).eql(Titanium);
		finish();
	});
	it("functionSanity", function(finish) {
		// Titanium API methods should report a typeof 'function'
		// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2288-drillbit-shouldbefunction-fails-on-proxy-methods
		should(Ti.API.info).be.a.Function;
		should(Ti.API.debug).be.a.Function;
		finish();
	});
	it("functionWrap", function(finish) {
		// Make sure functions that get wrapped by Kroll still have a return value
		// https://appcelerator.lighthouseapp.com/projects/32238/tickets/2221-regression-methods-passed-through-contexts-not-returning-values
		Ti.testFunction = function() {
			return 1 + 1;
		};
		should(Ti.testFunction).be.a.Function;
		var result = Ti.testFunction();
		should(result).eql(2);
		finish();
	});
	it("customProxyMethods", function(finish) {
		// You should be able to add custom proxy instance methods and use "this" to refer to the proxy instance
		// https://appcelerator.lighthouseapp.com/projects/32238/tickets/1005-functions-and-currentwindow-on-android-broken
		var x = Ti.Filesystem.getFile("app://app.js");
		x.customMethod = function() {
			return this.getNativePath();
		};
		should(x.customMethod).be.a.Function;
		var path = x.customMethod();
		should(path).eql(x.getNativePath());
		finish();
	});
	it("customObjects", function(finish) {
		// ensure custom objects work when wrapped/unwrapped by Kroll
		// https://appcelerator.lighthouseapp.com/projects/32238/tickets/2027-android-weird-behavior-when-setting-custom-sub-properties-on-proxies
		var view = Ti.UI.createView();
		view.customObj = "hello";
		should(view.customObj).eql("hello");
		view.customObj = {};
		view.customObj.test = "hello";
		should(view.customObj.test).eql("hello");
		view.customObj = {
			test: "hello"
		};
		should(view.customObj.test).eql("hello");
		var X = function() {
			this.y = 1;
		};
		X.prototype.getY = function() {
			return this.y;
		};
		var x = new X();
		var row = Ti.UI.createTableViewRow();
		row.x = x;
		should(x.getY()).eql(1);
		should(row.x.getY()).eql(1);
		// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2204-150-regression-errors-accessing-custom-attributes-off-of-tableviewrow-objects-includes-testcase
		var testDate = new Date();
		var dateObj = {
			bla: "foo",
			testDateObj: testDate
		};
		var noDateObj = {
			bla: "foo"
		};
		var row = Ti.UI.createTableViewRow({
			_dateObj: dateObj,
			_noDateObj: noDateObj,
			_testDate: testDate
		});
		should(row._noDateObj.bla).eql("foo");
		should(row._dateObj.bla).eql("foo");
		should(row._dateObj.testDateObj).eql(testDate);
		should(row._testDate.getTime()).eql(testDate.getTime());
		should(row._testDate).eql(testDate);
		finish();
	});
	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/2341-android-incorrect-method-parameter-binding-if-first-parameter-is-object-and-a-value-is-passed-for-second-parameter
	// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2065-android-behavior-change-in-set-row-data-test-case#ticket-2065-5
	it("varArgs", function(finish) {
		should(Ti.App.Properties.getList("x.y.z", [ "abcdefg" ])).eql([ "abcdefg" ]);
		var tv = Ti.UI.createTableView();
		should(function() {
			tv.setData([ {
				title: "test"
			} ], {
				options: "x"
			});
		}).not.throw();
		finish();
	});
	it("arrayMixedTypeAndConstructor", function(finish) {
		should(function() {
			Ti.a = [ "abc", "def", 123 ];
		}).not.throw();
		should(Ti.a[0]).eql("abc");
		should(Ti.a[1]).eql("def");
		should(Ti.a[2]).eql(123);
		Ti.x = [ 1, 2, 3, 4, 5 ];
		should(Ti.x.constructor).not.be.type("undefined");
		should(Ti.x.constructor.toString()).be.containEql("Array");
		finish();
	});
	it("iteration", function(finish) {
		// Function that simulates "x in ['a','b','c']"
		function oc(a) {
			if (void 0 == a || null == a) return {};
			var o = {};
			for (var i = 0; i < a.length; i++) o[a[i]] = "";
			return o;
		}
		// Iteration over native JS objects
		var x = {
			a: "b",
			b: "c",
			c: "d"
		};
		var results = {};
		var i = 0;
		for (var y in x) {
			should(y in oc(Object.keys(x))).be.true;
			// JS spec specifies x in y returns keys in the same order as
			// Object.keys()
			should(y).eql(Object.keys(x)[i]);
			results[x[y]] = y;
			i++;
		}
		should(i).eql(Object.keys(x).length);
		// Perform a reverse lookup to check we got the right values
		should(results.b).eql("a");
		should(results.c).eql("b");
		should(results.d).eql("c");
		// Iteration over proxies, including custom props & props
		// we know are KVC on iOS. Note that we MAY, on proxies, have
		// additional values which were not defined by the user.
		var b = Ti.UI.createButton({
			title: "xyz",
			backgroundImage: "foo.jpg",
			custom: "sup"
		});
		var bKeys = Object.keys(b);
		for (i = 0; i < bKeys.length; i++) {
			var key = bKeys[i];
			should(key in b).be.true;
			results[b[key]] = key;
		}
		should(i).eql(bKeys.length);
		// Only check the values we explicitly set; other values
		// retrieved are gravy
		should(results.xyz).eql("title");
		should(results["foo.jpg"]).eql("backgroundImage");
		should(results.sup).eql("custom");
		finish();
	});
	//TIMOB-5240
	it("optionalParam", function(finish) {
		function getList(name, value) {
			return Titanium.App.Properties.getList(name, value);
		}
		should(function() {
			getList("key", "value");
		}).not.throw();
		should(function() {
			getList("key");
		}).not.throw();
		//TIMOB-5276
		should(getList("key")).be.null;
		finish();
	});
	//TIMOB-6684
	it("krollNamespace", function(finish) {
		var x = {};
		should(x.extend).be.type("undefined");
		finish();
	});
});