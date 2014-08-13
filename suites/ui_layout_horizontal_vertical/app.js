/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_layout_horizontal_vertical", function() {
	it("horizontalTopBottomUndefinedHeight", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "white"
		});
		var parent = Ti.UI.createView({
			backgroundColor: "red",
			layout: "horizontal",
			horizontalWrap: true,
			width: 200,
			height: 300
		});
		var child1 = Ti.UI.createView({
			backgroundColor: "green",
			width: 40,
			top: 10,
			bottom: 10,
			height: 50
		});
		var child2 = Ti.UI.createView({
			backgroundColor: "blue",
			left: 5,
			right: 20,
			top: 20,
			bottom: 10,
			width: 55
		});
		var child3 = Ti.UI.createView({
			backgroundColor: "#eee",
			height: 120,
			width: 50
		});
		parent.add(child1);
		parent.add(child2);
		parent.add(child3);
		win.addEventListener("postlayout", function(e) {
			should(child1.rect.height).eql(50);
			should(child1.rect.width).eql(40);
			should(child1.rect.y).eql(10);
			should(child1.rect.x).eql(0);
			should(child2.rect.height).eql(270);
			should(child2.rect.width).eql(55);
			should(child2.rect.y).eql(20);
			should(child2.rect.x).eql(45);
			should(child3.rect.height).eql(120);
			should(child3.rect.width).eql(50);
			should(child3.rect.y).eql(90);
			should(child3.rect.x).eql(120);
			finish();
		});
		win.add(parent);
		win.open();
	});
	it("horizontalLeftRightUndefinedWidth", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "white"
		});
		var parent = Ti.UI.createView({
			backgroundColor: "red",
			layout: "horizontal",
			horizontalWrap: true,
			width: 200,
			height: 300
		});
		var child1 = Ti.UI.createView({
			backgroundColor: "green",
			left: 10,
			right: 10,
			height: 50
		});
		var child2 = Ti.UI.createView({
			backgroundColor: "blue",
			left: 5,
			right: 20,
			height: 90,
			width: 55
		});
		var child3 = Ti.UI.createView({
			backgroundColor: "#eee",
			left: 5,
			height: 120,
			width: 50
		});
		parent.add(child1);
		parent.add(child2);
		parent.add(child3);
		win.addEventListener("postlayout", function(e) {
			should(child1.rect.height).eql(50);
			should(child1.rect.width).eql(180);
			should(child1.rect.y).eql(0);
			should(child1.rect.x).eql(10);
			should(child2.rect.height).eql(90);
			should(child2.rect.width).eql(55);
			// ((120 - 90) / 2) + 50
			// child3 determines the maximum height of that row, so we have to calculate accordingly.
			// We have to add 50 since the previous row just fills and this is in the second row
			should(child2.rect.y).eql(65);
			should(child2.rect.x).eql(5);
			should(child3.rect.height).eql(120);
			should(child3.rect.width).eql(50);
			should(child3.rect.y).eql(50);
			should(child3.rect.x).eql(85);
			finish();
		});
		win.add(parent);
		win.open();
	});
	it("horizontalLeftRightUndefinedWidthNoWrap", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "white"
		});
		var parent = Ti.UI.createView({
			backgroundColor: "red",
			layout: "horizontal",
			horizontalWrap: false,
			width: 200,
			height: 300
		});
		var child1 = Ti.UI.createView({
			backgroundColor: "green",
			left: 10,
			right: 10,
			height: 50
		});
		var child2 = Ti.UI.createView({
			backgroundColor: "blue",
			left: 5,
			right: 20,
			height: 90,
			width: 55
		});
		var child3 = Ti.UI.createView({
			backgroundColor: "#eee",
			left: 5,
			height: 120,
			width: 50
		});
		parent.add(child1);
		parent.add(child2);
		parent.add(child3);
		win.addEventListener("postlayout", function(e) {
			should(child1.rect.height).eql(50);
			should(child1.rect.width).eql(180);
			// (300-50)/2
			should(child1.rect.y).eql(125);
			should(child1.rect.x).eql(10);
			should(child2.rect.height).eql(90);
			should(child2.rect.width).eql(55);
			should(child2.rect.y).eql(105);
			should(child2.rect.x).eql(205);
			should(child3.rect.height).eql(120);
			should(child3.rect.width).eql(50);
			should(child3.rect.y).eql(90);
			should(child3.rect.x).eql(285);
			finish();
		});
		win.add(parent);
		win.open();
	});
	it("horizontalTopBottomUndefinedHeightNoWrap", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "white"
		});
		var parent = Ti.UI.createView({
			backgroundColor: "red",
			layout: "horizontal",
			horizontalWrap: false,
			width: 200,
			height: 300
		});
		var child1 = Ti.UI.createView({
			backgroundColor: "green",
			width: 40,
			top: 10,
			bottom: 10,
			height: 50
		});
		var child2 = Ti.UI.createView({
			backgroundColor: "blue",
			left: 5,
			right: 20,
			top: 20,
			bottom: 10,
			width: 55
		});
		var child3 = Ti.UI.createView({
			backgroundColor: "#eee",
			height: 120,
			width: 50
		});
		parent.add(child1);
		parent.add(child2);
		parent.add(child3);
		win.addEventListener("postlayout", function(e) {
			should(child1.rect.height).eql(50);
			should(child1.rect.width).eql(40);
			should(child1.rect.y).eql(10);
			should(child1.rect.x).eql(0);
			should(child2.rect.height).eql(270);
			should(child2.rect.width).eql(55);
			should(child2.rect.y).eql(20);
			should(child2.rect.x).eql(45);
			should(child3.rect.height).eql(120);
			should(child3.rect.width).eql(50);
			should(child3.rect.y).eql(90);
			should(child3.rect.x).eql(120);
			finish();
		});
		win.add(parent);
		win.open();
	});
	it("horizontalWrapWithSIZEHeight", function(finish) {
		var win = Ti.UI.createWindow({
			navBarHidden: true,
			backgroundColor: "#000"
		});
		var topView = Ti.UI.createView({
			backgroundColor: "white",
			height: Ti.UI.SIZE,
			layout: "horizontal"
		});
		topView.add(Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 100,
			backgroundColor: "blue"
		}));
		topView.add(Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 100,
			backgroundColor: "red"
		}));
		topView.add(Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 100,
			backgroundColor: "purple"
		}));
		topView.add(Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 100,
			backgroundColor: "orange"
		}));
		win.addEventListener("postlayout", function(e) {
			should(topView.rect.height).eql(400);
			finish();
		});
		win.add(topView);
		win.open();
	});
	it("horizontalNoWrapWithSIZEHeight", function(finish) {
		var win = Ti.UI.createWindow({
			navBarHidden: true,
			backgroundColor: "#000"
		});
		var topView = Ti.UI.createView({
			backgroundColor: "white",
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			layout: "horizontal",
			horizontalWrap: false
		});
		topView.add(Ti.UI.createView({
			width: 50,
			height: 100,
			backgroundColor: "blue"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			height: 150,
			backgroundColor: "red"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			height: 200,
			backgroundColor: "purple"
		}));
		topView.add(Ti.UI.createView({
			width: 100,
			height: 100,
			backgroundColor: "orange"
		}));
		win.addEventListener("postlayout", function(e) {
			should(topView.rect.width).eql(250);
			should(topView.rect.height).eql(200);
			finish();
		});
		win.add(topView);
		win.open();
	});
	it("horizontalNoWrapTopPaddingSIZEHeight", function(finish) {
		var win = Ti.UI.createWindow({
			navBarHidden: true,
			backgroundColor: "#000"
		});
		var topView = Ti.UI.createView({
			backgroundColor: "white",
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			layout: "horizontal",
			horizontalWrap: false
		});
		topView.add(Ti.UI.createView({
			width: 50,
			height: 100,
			backgroundColor: "blue"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			height: 150,
			backgroundColor: "red"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			top: 10,
			bottom: 25,
			height: 200,
			backgroundColor: "purple"
		}));
		topView.add(Ti.UI.createView({
			width: 100,
			height: 100,
			backgroundColor: "orange"
		}));
		win.addEventListener("postlayout", function(e) {
			should(topView.rect.width).eql(250);
			should(topView.rect.height).eql(235);
			finish();
		});
		win.add(topView);
		win.open();
	});
	it("horizontalWrapTopPaddingSIZEHeight", function(finish) {
		var win = Ti.UI.createWindow({
			navBarHidden: true,
			backgroundColor: "#000"
		});
		var topView = Ti.UI.createView({
			backgroundColor: "white",
			height: Ti.UI.SIZE,
			layout: "horizontal"
		});
		topView.add(Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 100,
			backgroundColor: "blue"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			height: 100,
			backgroundColor: "red"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			top: 50,
			bottom: 20,
			height: 100,
			backgroundColor: "purple"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			height: 100,
			backgroundColor: "orange"
		}));
		win.addEventListener("postlayout", function(e) {
			should(topView.rect.height).eql(270);
			finish();
		});
		win.add(topView);
		win.open();
	});
	it("verticalWithTopBottomPadding", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "white"
		});
		var container = Ti.UI.createView({
			height: Ti.UI.SIZE,
			backgroundColor: "yellow",
			width: 400,
			layout: "vertical"
		});
		var view1 = Ti.UI.createView({
			width: 100,
			height: 100,
			top: 5,
			bottom: 5,
			backgroundColor: "red"
		});
		var view2 = Ti.UI.createView({
			width: 100,
			height: 100,
			top: 5,
			bottom: 5,
			backgroundColor: "green"
		});
		win.addEventListener("postlayout", function(e) {
			should(view1.rect.y).eql(5);
			should(view2.rect.y).eql(115);
			should(container.rect.height).eql(220);
			finish();
		});
		container.add(view1);
		container.add(view2);
		win.add(container);
		win.open();
	});
	it("horizontalWrapWithSIZEWidth", function(finish) {
		var win = Ti.UI.createWindow({
			navBarHidden: true,
			backgroundColor: "#000"
		});
		var topView = Ti.UI.createView({
			backgroundColor: "white",
			width: Ti.UI.SIZE,
			layout: "horizontal"
		});
		topView.add(Ti.UI.createView({
			width: 100,
			height: 100,
			backgroundColor: "blue"
		}));
		topView.add(Ti.UI.createView({
			width: 50,
			height: 100,
			backgroundColor: "red"
		}));
		win.addEventListener("postlayout", function(e) {
			should(topView.rect.width).eql(150);
			finish();
		});
		win.add(topView);
		win.open();
	});
	it("horizontalWrapWithFILLWidth", function(finish) {
		var win2 = Titanium.UI.createWindow({
			title: "Tab 2",
			backgroundColor: "#fff"
		});
		var fieldWrapper = Ti.UI.createView({
			top: 0,
			left: 0,
			backgroundColor: "#ff0",
			layout: "horizontal"
		});
		var Label = Ti.UI.createLabel({
			text: "Test text field",
			height: 20,
			width: 20
		});
		var Spacer = Ti.UI.createView({
			width: 10,
			height: 10,
			backgroundColor: "#0f0"
		});
		var textfield = Titanium.UI.createTextField({
			width: Ti.UI.FILL,
			hintText: "hint text",
			height: "35"
		});
		var view3 = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 10,
			backgroundColor: "purple"
		});
		var view4 = Ti.UI.createView({
			width: 30,
			height: 10,
			backgroundColor: "red"
		});
		var view5 = Ti.UI.createView({
			width: 30,
			height: 10,
			backgroundColor: "white"
		});
		win2.addEventListener("postlayout", function(e) {
			// purple view should be in 2nd row
			should(view3.rect.x).eql(30);
			should(view3.rect.y).eql(35);
			// red view should be first view in 2nd row
			should(view4.rect.x).eql(0);
			should(view4.rect.y).eql(35);
			// white view should be on the third row
			should(view5.rect.x).eql(0);
			should(view5.rect.y).eql(45);
			// 35 (TextField) + 10 (view4)
			finish();
		});
		fieldWrapper.add(Label);
		fieldWrapper.add(Spacer);
		fieldWrapper.add(textfield);
		fieldWrapper.add(view4);
		fieldWrapper.add(view3);
		fieldWrapper.add(view5);
		win2.add(fieldWrapper);
		win2.open();
	});
});