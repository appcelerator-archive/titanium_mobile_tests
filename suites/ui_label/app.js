/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_label", function() {
	//TIMOB-4123
	it("labelHeight", function(finish) {
		var label = Ti.UI.createLabel({
			top: 10,
			right: 10,
			height: "auto",
			width: "auto",
			borderColor: "red"
		});
		should(label.getTop()).eql(10);
		should(label.getHeight()).eql("auto");
		should(label.getWidth()).eql("auto");
		should(label.getBorderColor()).eql("red");
		should(label.getRight()).eql("10");
		finish();
	});
	//TIMOB-9912
	it("labelTextid", function(finish) {
		var win = Titanium.UI.createWindow();
		var view = Ti.UI.createView({
			top: 0,
			height: 80,
			right: 0,
			left: 0
		});
		var label = Ti.UI.createLabel({
			font: {
				fontSize: 30,
				fontFamily: "Helvetica Neue"
			},
			color: "red",
			left: 0,
			width: "100%",
			textid: "new",
			right: "10%",
			textid: "check"
		});
		view.add(label);
		label.textid = "new";
		should(label.textid).eql("new");
		label.textid = "new";
		should(label.textid).eql("new");
		label.textid = "new";
		should(label.textid).eql("new");
		finish();
		win.add(view);
		win.open();
	});
	//TIMOB-9994
	it("labelPostlayout", function(finish) {
		var win = Ti.UI.createWindow({
			layout: "vertical"
		});
		var postlayoutStatus = false;
		var label = Ti.UI.createLabel({
			text: "hello",
			left: 0,
			top: 10,
			color: "red",
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
		});
		label.addEventListener("postlayout", function(e) {
			if (postlayoutStatus) {
				should(label.text).eql("newText");
				finish();
			} else {
				should(label.text).eql("hello");
				should(label.left).eql(0);
				should(label.top).eql(10);
				should(label.color).eql("red");
				setTimeout(function() {
					label.text = "newText";
					postlayoutStatus = true;
				}, 1);
			}
		});
		win.add(label);
		win.open();
	});
	//TIMOB-8955 & TIMOB-8246
	it("labelBackground", function(finish) {
		var win = Ti.UI.createWindow();
		win.open();
		var signonview = Ti.UI.createView({
			top: 10,
			left: 10,
			right: 10
		});
		var label = Ti.UI.createLabel({
			text: "Appcelerator",
			backgroundGradient: {
				type: "linear",
				colors: [ "red", "blue" ],
				startPoint: {
					x: 0,
					y: 0
				},
				endPoint: {
					x: 0,
					y: 45
				},
				backFillStart: true
			},
			shadowColor: "green",
			shadowOffset: {
				x: 0,
				y: 1
			},
			top: 0,
			height: 45,
			width: 290,
			textAlign: "center",
			backgroundColor: "red"
		});
		label.addEventListener("postlayout", function() {
			should(label.getBackgroundGradient().type).eql("linear");
			should(label.getBackgroundGradient().backFillStart).be.true;
			should(label.getBackgroundGradient().startPoint.x).eql(0);
			should(label.getBackgroundGradient().startPoint.y).eql(0);
			should(label.getBackgroundGradient().endPoint.x).eql(0);
			should(label.getBackgroundGradient().endPoint.y).eql(45);
			should(label.shadowOffset.x).eql(0);
			should(label.shadowOffset.y).eql(1);
			should(label.getTop()).eql(0);
			should(label.getTextAlign()).eql("center");
			should(label.getText()).eql("Appcelerator");
			should(label.getBackgroundColor()).eql("red");
			should(label.getHeight()).eql(45);
			should(label.getWidth()).eql(290);
			finish();
		});
		should(function() {
			signonview.add(label);
		}).not.throw();
		win.add(signonview);
	});
});