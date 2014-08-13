/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_clipboard", function() {
	it("setAndGetText", function(finish) {
		Ti.UI.Clipboard.setText("hello");
		should(Ti.UI.Clipboard.hasText()).be.true;
		should(Ti.UI.Clipboard.getText()).eql("hello");
		finish();
	});

	//TIMOB-9263
	it("setAndGetData", function(finish) {
		Ti.UI.Clipboard.setData("text/plain", "hello");
		should(Ti.UI.Clipboard.hasData("text/plain")).be.true;
		should(Ti.UI.Clipboard.getData("text/plain")).not.be.null;
		should(Ti.UI.Clipboard.getText()).eql("hello");
		finish();
	});

	//TIMOB-9223
	it("hasText", function(finish) {
		Ti.UI.Clipboard.clearText();
		should(Ti.UI.Clipboard.hasText()).be.false;
		Ti.UI.Clipboard.setText("hello");
		should(Ti.UI.Clipboard.hasText()).be.true;
		should(Ti.UI.Clipboard.getText()).eql("hello");
		finish();
	});

	//TIMOB-9222
	it("hasAndGetData", function(finish) {
		if (Ti.UI.iOS) {
			Ti.UI.Clipboard.clearData();
			Ti.UI.Clipboard.setData("text/uri-list", "http://www.appcelerator.com/");
			Ti.UI.Clipboard.setData("text/uri-list", "http://developer.android.com/");
			Ti.UI.Clipboard.setData("text/uri-list", "https://developer.apple.com/");
			should(Ti.UI.Clipboard.hasData("text/uri-list")).be.Boolean;
			should(function() {
				Ti.UI.Clipboard.hasData("text/uri-list");
			}).not.throw();
			should(Ti.UI.Clipboard.getData("text/uri-list")).not.be.null;
			should(function() {
				Ti.UI.Clipboard.getData("text/uri-list");
			}).not.throw();
			should(Ti.UI.Clipboard.hasData("image")).be.Boolean;
			should(function() {
				Ti.UI.Clipboard.hasData("image");
			}).not.throw();
			should(Ti.UI.Clipboard.hasData("image")).not.be.null;
			should(function() {
				Ti.UI.Clipboard.hasData("image");
			}).not.throw();
		}
		finish();
	});

	it("clearText", function(finish) {
		should(function() {
			Ti.UI.Clipboard.clearText();
		}).not.throw();
		should(Ti.UI.Clipboard.hasText()).be.false;
		// Return value of getText() varies by platform: TIMOB-9224
		// So we can't test it, but at least it shouldn't throw an exception.
		should(function() {
			Ti.UI.Clipboard.getText();
		}).not.throw();
		finish();
	});

	// Using setData to store text with a mime type.
	it("setAndGetHTML", function(finish) {
		// Clear all data first.
		Ti.UI.Clipboard.clearData();
		Ti.UI.Clipboard.setData("text/html", "<p>How is <em>this</em> for data?</p>");
		should(Ti.UI.Clipboard.hasData("text/html")).be.true;
		should(Ti.UI.Clipboard.getData("text/html").toString()).eql("<p>How is <em>this</em> for data?</p>");
		finish();
	});

	// Data with mimeType 'text/url-list' or 'url' is treated as a URL on iOS, so
	// follows a different code path than plain text or images.
	it("urlData", function(finish) {
		Ti.UI.Clipboard.clearData();
		Ti.UI.Clipboard.setData("text/url-list", "http://www.appcelerator.com");
		should(Ti.UI.Clipboard.getData("text/url-list").toString()).eql("http://www.appcelerator.com");
		finish();
	});
});