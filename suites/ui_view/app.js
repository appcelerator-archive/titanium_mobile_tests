/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_view", function() {
	//TIMOB-1124
	it("backgroundGradient", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "black"
		});
		var linearGradient = Ti.UI.createView({
			width: 100,
			height: 100,
			backgroundGradient: {
				type: "linear",
				startPoint: {
					x: "0%",
					y: "50%"
				},
				endPoint: {
					x: "100%",
					y: "50%"
				},
				colors: [ {
					color: "red",
					offset: 0
				}, {
					color: "blue",
					offset: .25
				}, {
					color: "red",
					offset: 1
				} ]
			}
		});
		win.add(linearGradient);
		linearGradient.addEventListener("postlayout", function() {
			should(linearGradient.backgroundGradient.type).eql("linear");
			should(linearGradient.width).eql(100);
			should(linearGradient.height).eql(100);
			finish();
		});
		win.open();
	});
	//TIMOB-1501
	it("sizeProperty", function(finish) {
		var win = Titanium.UI.createWindow();
		var view1 = Ti.UI.createView({
			top: 0,
			bottom: 50,
			left: 20,
			right: 20
		});
		var lbl1 = Ti.UI.createLabel({
			text: "Outer view",
			top: 5,
			left: 5
		});
		view1.add(lbl1);
		win.add(view1);
		view1.addEventListener("postlayout", function() {
			should(view1.size.height).eql(win.size.height - 50);
			should(view1.size.width).eql(win.size.width - 40);
			finish();
		});
		win.open();
	});
	//TIMOB-3238
	it("percentageDimension", function(finish) {
		var win = Ti.UI.createWindow({
			layout: "vertical",
			fullscreen: true
		});
		var view = Ti.UI.createView({
			layout: "horizontal",
			height: 50,
			backgroundColor: "#ccf",
			width: 200
		});
		var nested_view = Ti.UI.createView({
			height: 50,
			backgroundColor: "#cfc",
			width: "50%"
		});
		view.add(nested_view);
		win.add(view);
		nested_view.addEventListener("postlayout", function() {
			should(nested_view.width).eql("50%");
			should(nested_view.height).eql(50);
			finish();
		});
		win.open();
	});
	//TIMOB-4644
	it("getProperties", function(finish) {
		var myApp = {};
		myApp.ui = {};
		myApp.ui.createMyView = function() {
			var v = Ti.UI.createView({});
			v.foo = 100;
			v.getSomething = function() {
				return v.foo;
			};
			v.setSomething = function(val) {
				v.foo = val;
			};
			v.getFood = 200;
			return v;
		};
		var myView = myApp.ui.createMyView();
		should(myView.getSomething).be.a.Function;
		should(myView.setSomething).be.a.Function;
		should(myView.getFood).eql(200);
		should(myView.getSomething()).eql(100);
		myView.setSomething(50);
		should(myView.getSomething()).eql(50);
		finish();
	});
	//TIMOB-6204
	it("fireevent", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "red"
		});
		var view = Ti.UI.createView({
			height: 100,
			width: 100
		});
		should(win.backgroundColor).eql("red");
		view.addEventListener("background", function() {
			win.backgroundColor = "green";
			should(win.backgroundColor).eql("green");
			finish();
		});
		win.addEventListener("open", function() {
			view.fireEvent("background");
		});
		win.open();
	});
	//TIMOB-9054
	it("sourcevalue", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "blue"
		});
		win.add(view);
		should(view.backgroundColor).eql("blue");
		view.addEventListener("myEvent", function(e) {
			e.source.backgroundColor = "red";
			should(e.message).eql("Hello");
			should(view.backgroundColor).eql("red");
			finish();
		});
		view.addEventListener("postlayout", function(e) {
			var data = {
				message: "Hello"
			};
			e.source.fireEvent("myEvent", data);
		});
		win.open();
	});
	//TIMOB-9085
	it("thisvalue", function(finish) {
		var win = Ti.UI.createWindow({
			navBarHidden: true
		});
		var view = Ti.UI.createView({
			width: "100%",
			height: "100%"
		});
		view.addEventListener("postlayout", function() {
			should(this).be.an.Object;
			should(this.toString()).eql("[object TiUIView]");
			finish();
		});
		win.add(view);
		win.open();
	});
	//TIMOB-10015
	it("offsetProperty", function(finish) {
		var win1 = Ti.UI.createWindow({
			layout: "vertical",
			backgroundColor: "gray",
			exitOnClose: true,
			navBarHidden: true
		});
		var view = Ti.UI.createView({
			height: 100,
			width: 100,
			backgroundGradient: {
				type: "linear",
				endPoint: {
					x: 0,
					y: "100%"
				},
				colors: [ {
					color: "white"
				}, {
					color: "red"
				} ]
			}
		});
		win1.add(view);
		view.addEventListener("postlayout", function() {
			should(view.backgroundGradient.type).eql("linear");
			should(view.height).eql(100);
			should(view.width).eql(100);
			finish();
		});
		win1.open();
	});
	//TIMOB-10485
	it("e_source_size", function(finish) {
		var win = Ti.UI.createWindow();
		var data = [];
		var label = Ti.UI.createLabel({
			text: "appcelarator"
		});
		var view = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: 210
		});
		view.addEventListener("postlayout", function(e) {
			should(e.source.size.width).eql(210);
			should(e.source.size.height).not.be.eql(0);
			finish();
		});
		var view2 = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: 250
		});
		view.add(label);
		view2.add(view);
		var tvr = Ti.UI.createTableViewRow();
		tvr.add(view2);
		data.push(tvr);
		var tv = Ti.UI.createTableView({
			data: data
		});
		win.add(tv);
		win.open();
	});
});