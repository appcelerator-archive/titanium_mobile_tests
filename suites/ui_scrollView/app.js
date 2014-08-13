/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_scrollView", function() {
	//TIMOB-3378, TIMOB-10110
	it("removeMethod", function(finish) {
		var win = Titanium.UI.createWindow({
			title: "Scrollview test window",
			backgroundColor: "#fff"
		});
		var scrollview = Ti.UI.createScrollView({
			layout: "vertical"
		});
		var view = Ti.UI.createView({
			height: 20,
			width: 20,
			backgroundColor: "red",
			borderColor: "gray",
			borderWidth: 4
		});
		scrollview.add(view);
		win.addEventListener("open", function() {
			//after fixing https://jira.appcelerator.org/browse/TIMOB-15700 change to focus event
			should(scrollview.getChildren()).be.an.Object;
			should(scrollview.getChildren()[0].height).eql(20);
			scrollview.remove(view);
			should(function() {
				var height = scrollview.getChildren()[0].height;
			}).throw();
			finish();
		});
		win.add(scrollview);
		win.open();
	});
	//TIMOB-8499, TIMOB-11331
	it("scrollToBottom", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "#fff"
		});
		var scroll = Ti.UI.createScrollView({
			contentHeight: "2000",
			scrollType: "vertical"
		});
		win.add(scroll);
		win.addEventListener("open", function() {
			//after fixing https://jira.appcelerator.org/browse/TIMOB-15700 change to focus event
			should(function() {
				scroll.scrollToBottom();
			}).shouldNotThrowException;
			finish();
		});
		win.open();
	});
	//TIMOB-9907
	it("scrollingEnabled", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "#fff"
		});
		var scroll = Ti.UI.createScrollView({
			contentHeight: "2000",
			scrollType: "vertical",
			scrollingEnabled: false
		});
		win.add(scroll);
		win.addEventListener("open", function() {
			//after fixing https://jira.appcelerator.org/browse/TIMOB-15700 change to focus event
			should(scroll.scrollingEnabled).be.false;
			scroll.scrollingEnabled = true;
			should(scroll.scrollingEnabled).be.true;
			finish();
		});
		win.open();
	});
});