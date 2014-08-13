/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("properties", function() {
	it("setsAndGets", function(finish) {
		var array = [ {
			name: "Name 1",
			address: "1 Main St"
		}, {
			name: "Name 2",
			address: "2 Main St"
		}, {
			name: "Name 3",
			address: "3 Main St"
		}, {
			name: "Name 4",
			address: "4 Main St"
		} ];
		var object = {
			name1: "1 Main St",
			name2: "2 Main St",
			name3: "3 Main St",
			name4: "4 Main St"
		};
		//
		// Test Default handling
		//
		should(Ti.App.Properties.getBool("whatever", true)).eql(true);
		should(Ti.App.Properties.getDouble("whatever", 2.5)).eql(2.5);
		should(Ti.App.Properties.getInt("whatever", 1)).eql(1);
		should(Ti.App.Properties.getString("whatever", "Fred")).eql("Fred");
		// First StringList Test
		var defaultList = [ "testOne", "testTwo" ];
		should(JSON.stringify(Ti.App.Properties.getList("whatever", defaultList))).eql(JSON.stringify(defaultList));
		// Second StringList Test
		defaultList = [];
		should(JSON.stringify(Ti.App.Properties.getList("whatever", defaultList))).eql(JSON.stringify(defaultList));
		// First Object Test
		var defaultObject = {
			Cat: "Dog"
		};
		should(JSON.stringify(Ti.App.Properties.getObject("whatever", defaultObject))).eql(JSON.stringify(defaultObject));
		// Second Object Test
		defaultObject = {};
		should(JSON.stringify(Ti.App.Properties.getObject("whatever", defaultObject))).eql(JSON.stringify(defaultObject));
		//No Defaults
		should(Ti.App.Properties.getBool("whatever")).be.null;
		should(Ti.App.Properties.getDouble("whatever")).be.null;
		should(Ti.App.Properties.getInt("whatever")).be.null;
		should(Ti.App.Properties.getString("whatever")).be.null;
		should(Ti.App.Properties.getList("whatever")).be.null;
		should(Ti.App.Properties.getObject("whatever")).be.null;
		//
		// Round-trip tests
		//
		Titanium.App.Properties.setString("String", "I am a String Value ");
		should(Ti.App.Properties.getString("String")).eql("I am a String Value ");
		Titanium.App.Properties.setInt("Int", 10);
		should(Ti.App.Properties.getInt("Int")).eql(10);
		Titanium.App.Properties.setBool("Bool", true);
		should(Ti.App.Properties.getBool("Bool")).eql(true);
		Titanium.App.Properties.setDouble("Double", 10.6);
		// for android's sake, we need to round the double, which gets
		// stored as a float and comes back with some lost precision
		var d = Ti.App.Properties.getDouble("Double");
		should(Number(d).toPrecision(5)).eql(Number(10.6).toPrecision(5));
		Titanium.App.Properties.setList("MyList", array);
		var list = Titanium.App.Properties.getList("MyList");
		for (var i = 0; i < list.length; i++) {
			should(list[i].name).eql(array[i].name);
			should(list[i].address).eql(array[i].address);
		}
		Titanium.App.Properties.setObject("MyObject", object);
		var myObject = Titanium.App.Properties.getObject("MyObject");
		for (var k in object) {
			should(myObject.hasOwnProperty(k) && object.hasOwnProperty(k)).eql(true);
			should(myObject[k]).eql(object[k]);
		}
		// We set 6 properties above, so make sure listProperties() includes them.
		var propnames = [ "String", "Int", "Bool", "Double", "MyList", "MyObject" ];
		var proplist = Ti.App.Properties.listProperties();
		should(proplist.length).be.within(propnames.length, 1/0);
		for (var j = 0; j < propnames.length; j++) should(proplist.indexOf(propnames[j])).be.greaterThan(-1);
		//
		// test out remove property and setting to null
		//
		Titanium.App.Properties.setString("String", null);
		should(Ti.App.Properties.getString("String")).be.null;
		Titanium.App.Properties.removeProperty("Int");
		should(Ti.App.Properties.getString("Int")).be.null;
		finish();
	});
	it("doublePrecision", function(finish) {
		var now = new Date();
		var time = now.getTime();
		Ti.App.Properties.setDouble("time", time);
		var value = Ti.App.Properties.getDouble("time");
		should(value).eql(time);
		finish();
	});
	//TIMOB-5494_A
	it("test_userDefaultProperties_A", function(finish) {
		Titanium.App.Properties.setString("my_prop", "dadfcool");
		should(Ti.App.Properties.hasProperty("my_prop")).be.true;
		finish();
	});
	//TIMOB-5494_B
	it("test_userDefaultProperties_B", function(finish) {
		should(Ti.App.Properties.hasProperty("my_prop")).be.true;
		finish();
	});
	//TIMOB-7743
	it("test_encodeURIComponent", function(finish) {
		should(encodeURIComponent("üöäß &?/ tes tetst et st e\ntest etes te stet")).eql("%C3%BC%C3%B6%C3%A4%C3%9F%20%26%3F%2F%20tes%20tetst%20et%20st%20e%0Atest%20etes%20te%20stet");
		finish();
	});
	//TIMOB-7982
	it("test_caseWrong", function(finish) {
		if ("android" === Ti.Platform.osname) {
			should(Titanium.App.id).eql(Titanium.App.getId());
			should(Titanium.App.id).eql(Titanium.App.getID());
			should(Titanium.App.url).eql(Titanium.App.getUrl());
			should(Titanium.App.url).eql(Titanium.App.getURL());
			should(Titanium.App.guid).eql(Titanium.App.getGuid());
			should(Titanium.App.guid).eql(Titanium.App.getGUID());
		}
		finish();
	});
	//TIMOB-8383
	it("test_keyboardVisible", function(finish) {
		if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
			var win = Ti.UI.createWindow({
				backgroundColor: "white"
			});
			var input = Ti.UI.createTextField({
				width: 200,
				height: 40,
				value: "click me",
				top: 20,
				borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE
			});
			input.addEventListener("focus", function isVisible() {
				should(Ti.App.keyboardVisible).be.true;
			});
			win.add(input);
			win.open();
			input.focus();
		}
		finish();
	});
	//TIMOB-9350
	it("test_getDoubleInt", function(finish) {
		Titanium.App.Properties.setInt("Int", 10);
		should(Titanium.App.Properties.getDouble("Int")).eql(10);
		finish();
	});
	//TIMOB-10260, TIMOB-10314
	it("test_changeEvent", function(finish) {
		Ti.App.Properties.setBool("test", false);
		should(Ti.App.Properties.getBool("test")).be.false;
		function onPropertiesChange() {
			finish();
		}
		Ti.App.Properties.addEventListener("change", onPropertiesChange);
		Ti.App.Properties.setBool("test", true);
		should(Ti.App.Properties.getBool("test")).be.true;
	});
	//TIMOB-11399
	it("test_setObjectNullValue", function(finish) {
		var objectWithNullValue = {
			expires_at: 1347623585,
			value: {
				something: null
			}
		};
		Ti.App.Properties.setObject("Object1", objectWithNullValue);
		should(Ti.App.Properties.getObject("Object1")).be.an.Object;
		should(Ti.App.Properties.getObject("Object1").value.something).be.null;
		finish();
	});
});