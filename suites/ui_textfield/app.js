/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_textfield", function() {
	//TIMOB-10596
	it("changeEvent", function(finish) {
		this.timeout(5000);
		var win1 = Ti.UI.createWindow({
			title: "Bug"
		});
		var focus1 = false;
		var textField1 = Ti.UI.createTextField();
		win1.add(textField1);
		textField1.addEventListener("change", function() {
			focus1 = true;
		});
		setTimeout(function() {
			should(focus1).be.false;
			finish();
		}, 2500);
		win1.open();
	});
	//TIMOB-877
	it("editableFalse", function(finish) {
		var w = Ti.UI.createWindow();
		var tf = Ti.UI.createTextField({
			width: 280,
			height: 44,
			hintText: "Selecionar...",
			font: {
				fontFamily: "Helvetica Neue",
				fontSize: 18
			},
			color: "red",
			editable: true
		});
		tf.addEventListener("focus", function() {
			should(tf.editable).eql(true);
			should(tf.width).eql(280);
			should(tf.height).eql(44);
			should(tf.color).eql("red");
			should(function() {
				tf.editable = true;
			}).not.throw();
			should(function() {
				tf.editable = false;
			}).not.throw();
			finish();
		});
		w.add(tf);
		var fun = function() {
			tf.focus();
		};
		w.addEventListener("focus", fun);
		w.open();
	});
	//TIMOB-996
	it("hasText", function(finish) {
		var textField1 = Ti.UI.createTextField();
		var textField2 = Ti.UI.createTextField({
			value: "I am a textfield"
		});
		var textField3 = Ti.UI.createTextField({
			value: ""
		});
		should(textField1.hasText()).be.false;
		should(textField2.hasText()).be.true;
		should(textField3.hasText()).be.false;
		finish();
	});
	//TIMOB-997
	it("hasTextInIfStatement", function(finish) {
		var win = Ti.UI.createWindow();
		var textField = Ti.UI.createTextField({
			height: 30,
			color: "red",
			font: {
				fontFamily: "Helvetica Neue",
				fontSize: 12,
				fontWeight: "bold"
			},
			width: 70,
			value: "has text"
		});
		var found_Bug;
		textField.addEventListener("focus", function(e) {
			should(function() {
				if (textField.hasText()) found_Bug = false; else found_Bug = true;
			}).not.throw();
			should(found_Bug).be.false;
			should(textField.height).eql(30);
			should(textField.color).eql("red");
			should(textField.width).eql(70);
			finish();
		});
		win.add(textField);
		var fun = function() {
			textField.focus();
		};
		win.addEventListener("focus", fun);
		win.open();
	});
	//TIMOB-6873
	it("focusAndBlurEvents", function(finish) {
		var win = Ti.UI.createWindow();
		var focus_count = 0;
		var blur_count = 0;
		var row1 = Ti.UI.createTableViewRow({
			height: 80
		});
		tf1 = Titanium.UI.createTextField({
			color: "#336699",
			width: 250,
			height: 80,
			focusable: true
		});
		tf1.addEventListener("focus", function() {
			focus_count += 1;
		});
		tf1.addEventListener("blur", function() {
			blur_count += 1;
			should(focus_count).eql(1);
			should(blur_count).eql(1);
		});
		row1.add(tf1);
		var row2 = Ti.UI.createTableViewRow({
			height: 80
		});
		tf2 = Titanium.UI.createTextField({
			color: "#336699",
			width: 250,
			height: 80,
			focusable: true
		});
		tf2.addEventListener("focus", function() {
			focus_count += 1;
		});
		tf2.addEventListener("blur", function() {
			blur_count += 1;
			should(focus_count).eql(2);
			should(blur_count).eql(2);
		});
		row2.add(tf2);
		var row3 = Ti.UI.createTableViewRow({
			height: 80
		});
		tf3 = Titanium.UI.createTextField({
			color: "#336699",
			width: 250,
			height: 80,
			focusable: true
		});
		tf3.addEventListener("focus", function() {
			focus_count += 1;
			should(focus_count).eql(3);
			should(blur_count).eql(2);
			finish();
		});
		row3.add(tf3);
		var data = [];
		data[0] = row1;
		data[1] = row2;
		data[2] = row3;
		var tableView = Ti.UI.createTableView({
			data: data
		});
		win.add(tableView);
		var fun = function() {
			tf1.focus();
			tf2.focus();
			tf3.focus();
		};
		win.addEventListener("focus", fun);
		win.open();
	});
	// TIMOB-7255
	it("setProperties", function(finish) {
		var win = Ti.UI.createWindow();
		var textField = Ti.UI.createTextField({
			height: 30,
			top: 20,
			left: 20,
			right: 20,
			backgroundColor: "green"
		});
		textField.addEventListener("focus", function() {
			should(textField.getHeight()).eql(30);
			should(textField.getTop()).eql(20);
			should(textField.getLeft()).eql(20);
			should(textField.getRight()).eql(20);
			finish();
		});
		win.add(textField);
		var fun = function() {
			textField.focus();
		};
		win.addEventListener("focus", fun);
		win.open();
	});
	//TIMOB-10460
	it("setSelectionMethod", function(finish) {
		var text = Ti.UI.createTextField({
			top: 10,
			value: "This is Sparta.",
			left: 10,
			backgroundColor: "red"
		});
		var win = Ti.UI.createWindow({
			backgroundColor: "#fff"
		});
		var fun = function() {
			should(function() {
				text.setSelection(0, 4);
			}).not.throw();
			should(text.getTop()).eql(10);
			should(text.getLeft()).eql(10);
			should(text.getBackgroundColor()).eql("red");
			finish();
		};
		win.addEventListener("focus", fun);
		win.add(text);
		win.open();
	});
});