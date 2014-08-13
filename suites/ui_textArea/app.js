/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_textArea", function() {
	//TIMOB-8303
	it("hasTextMethod", function(finish) {
		var textArea1 = Ti.UI.createTextArea();
		var textArea2 = Ti.UI.createTextArea({
			value: "I am a textarea"
		});
		var textArea3 = Ti.UI.createTextArea({
			value: ""
		});
		should(textArea1.hasText()).be.false;
		should(textArea2.hasText()).be.true;
		should(textArea3.hasText()).be.false;
		finish();
	});
	//TIMOB-10222
	it("maxlimit", function(finish) {
		var win = Ti.UI.createWindow();
		var txt = Ti.UI.createTextArea({
			top: 150,
			height: 100,
			value: "abcde",
			maxLength: 5,
			backgroundColor: "white"
		});
		should(txt.value).eql("abcde");
		txt.maxLength = 3;
		txt.addEventListener("focus", function() {
			should(txt.value).eql("abc");
			finish();
		});
		win.add(txt);
		win.addEventListener("focus", function() {
			txt.focus();
		});
		win.open();
	});
	//TIMOB-10460
	it("setselectionProperty", function(finish) {
		var text = Ti.UI.createTextArea({
			top: 10,
			value: "This is Sparta.",
			left: 10
		});
		var win = Ti.UI.createWindow({
			backgroundColor: "#fff"
		});
		text.addEventListener("focus", function(e) {
			should(function() {
				text.setSelection(0, 4);
			}).not.throw();
			should(text.top).eql(10);
			should(text.left).eql(10);
			finish();
		});
		win.add(text);
		win.addEventListener("focus", function() {
			text.focus();
		});
		win.open();
	});
	//TIMOB-8606
	it("selectedEvent", function(finish) {
		if ("iphone" === Ti.Platform.osname) {
			var win1 = Titanium.UI.createWindow();
			var ta = Ti.UI.createTextArea({
				value: "I am a text area",
				width: Ti.UI.FILL,
				height: 100
			});
			ta.addEventListener("selected", function(e) {
				should(ta.height).eql(100);
				finish();
			});
			win1.add(ta);
			win1.addEventListener("focus", function() {
				ta.focus();
			});
			win1.open();
		} else finish();
	});
	// TIMOB-9807
	it("commonNamespace", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "white"
		});
		var ta = Ti.UI.createTextArea({
			left: 5,
			top: 5,
			right: 5,
			height: 180,
			editable: false,
			backgroundColor: "#ccc",
			autoLink: Titanium.UI.AUTOLINK_ALL,
			value: "Contact\n test@test.com\n 817-555-5555\n http://bit.ly\n 444 Castro Street, Mountain View, CA"
		});
		should(ta.autoLink).eql(Titanium.UI.AUTOLINK_ALL);
		win.addEventListener("focus", function(e) {
			ta.autoLink = Titanium.UI.AUTOLINK_NONE;
			should(ta.autoLink).eql(Titanium.UI.AUTOLINK_NONE);
			should(ta.left).eql(5), should(ta.top).eql(5), should(ta.right).eql(5),
			should(ta.height).eql(180), finish();
		});
		win.add(ta);
		win.open();
	});
});