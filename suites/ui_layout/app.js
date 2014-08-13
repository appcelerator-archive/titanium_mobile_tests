/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_layout", function() {
	// functional test cases #1010, #1011, #1025, #1025a
	//rect and size properties should not be undefined
	it("viewSizeAndRectPx", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView();
		var label = Ti.UI.createLabel({
			text: "a",
			font: {
				fontSize: 14,
				fontFamily: "monospace"
			}
		});
		win.add(view);
		win.add(label);
		win.addEventListener("postlayout", function(e) {
			should(view.size).not.be.type("undefined");
			should(view.size.width).not.be.type("undefined");
			should(view.size.height).not.be.type("undefined");
			should(view.size.x).not.be.type("undefined");
			should(view.size.y).not.be.type("undefined");
			should(view.rect).not.be.type("undefined");
			should(view.rect.width).not.be.type("undefined");
			should(view.rect.height).not.be.type("undefined");
			should(view.rect.x).not.be.type("undefined");
			should(view.rect.y).not.be.type("undefined");
			//size and rect properties return the same width and height
			should(view.size.width).eql(view.size.width);
			should(view.size.height).eql(view.size.height);
			//size property returns 0 for x and y
			should(view.size.x).eql(0);
			should(view.size.y).eql(0);
			//Functonal test case 1025
			should(view.top).be.type("undefined");
			should(view.bottom).be.type("undefined");
			should(view.left).be.type("undefined");
			should(view.right).be.type("undefined");
			should(view.center).be.type("undefined");
			should(view.zIndex).be.type("undefined");
			//Functonal test case 1025a
			should(label.top).be.type("undefined");
			should(label.bottom).be.type("undefined");
			should(label.left).be.type("undefined");
			should(label.right).be.type("undefined");
			should(label.center).be.type("undefined");
			should(label.zIndex).be.type("undefined");
			//FILL behavior
			should(view.rect.x).eql(0);
			should(view.rect.y).eql(0);
			should(win.size.height / view.size.height).eql(1);
			should(win.size.width / view.size.width).eql(1);
			finish();
		});
		win.open();
	});
	// functional test cases #1012, #1014:
	// ViewLeft and ViewRight
	it("viewLeft", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			left: 10,
			width: 10
		});
		var view2 = Ti.UI.createView({
			right: 10,
			width: 10
		});
		win.add(view);
		win.add(view2);
		win.addEventListener("postlayout", function(e) {
			should(view.left).eql(10);
			should(view.rect.x).eql(10);
			should(view.rect.width).eql(10);
			should(view.right).be.type("undefined");
			should(view2.right).eql(10);
			should(view2.rect.x).eql(win.size.width - 20);
			should(view2.rect.width).eql(10);
			should(view2.left).be.type("undefined");
			finish();
		});
		win.open();
	});
	// functional test case #1016, #1018
	// ViewTop and ViewBottom
	it("viewTop", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			top: 10,
			height: 10
		});
		var view2 = Ti.UI.createView({
			bottom: 10,
			height: 10
		});
		win.add(view);
		win.add(view2);
		win.addEventListener("postlayout", function(e) {
			should(view.top).eql(10);
			should(view.rect.y).eql(10);
			should(view.rect.height).eql(10);
			should(view.bottom).be.type("undefined");
			should(view2.bottom).eql(10);
			should(view2.rect.y).eql(win.size.height - 20);
			should(view2.rect.height).eql(10);
			should(view2.top).be.type("undefined");
			finish();
		});
		win.open();
	});
	// functional test case #1020: ViewCenter
	it("viewCenter", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			center: {
				x: 50,
				y: 50
			},
			height: 40,
			width: 40
		});
		win.add(view);
		win.addEventListener("postlayout", function(e) {
			should(view.center.x).eql(50);
			should(view.center.y).eql(50);
			should(view.rect.x).eql(30);
			should(view.rect.y).eql(30);
			finish();
		});
		win.open();
	});
	// functional test case #1022, #1024
	// ViewWidth, ViewHeight
	it("viewWidth", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			width: 10,
			height: 10
		});
		win.add(view);
		win.addEventListener("postlayout", function(e) {
			should(view.width).eql(10);
			should(view.size.width).eql(10);
			should(view.height).eql(10);
			should(view.size.height).eql(10);
			should(view.left).be.type("undefined");
			should(view.right).be.type("undefined");
			should(view.top).be.type("undefined");
			should(view.bottom).be.type("undefined");
			//Centered View with width and height defined
			should(view.rect.x).eql(Math.floor((win.size.width - view.size.width) / 2));
			should(view.rect.y).eql(Math.floor((win.size.height - view.size.height) / 2));
			finish();
		});
		win.open();
	});
	// functional test #1026 ViewError
	it("viewError", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "green",
			left: "leftString",
			right: "rightString",
			top: "topString",
			bottom: "bottomString",
			width: "widthString",
			height: "heightString",
			center: {
				x: "centerXString",
				y: "centerYString"
			}
		});
		win.add(view);
		win.addEventListener("postlayout", function(e) {
			should(view.left).eql("leftString");
			should(view.right).eql("rightString");
			should(view.top).eql("topString");
			should(view.bottom).eql("bottomString");
			should(view.center.y).eql("centerYString");
			should(view.center.x).eql("centerXString");
			should(view.width).eql("widthString");
			should(view.height).eql("heightString");
			finish();
		});
		win.open();
	});
	// functional test #1033, 1033a, 1033b
	// UndefinedWidth Implicit calculations
	it("undefinedWidth", function(finish) {
		var win = Ti.UI.createWindow();
		var parentView = Ti.UI.createView({
			width: 100,
			height: 100
		});
		var view1 = Ti.UI.createView({
			left: 5,
			right: 10
		});
		var view2 = Ti.UI.createView({
			left: 5,
			center: {
				x: 10
			}
		});
		var view3 = Ti.UI.createView({
			center: {
				x: 75
			},
			right: 10
		});
		win.addEventListener("postlayout", function(e) {
			should(view1.width).be.type("undefined");
			should(view2.width).be.type("undefined");
			should(view3.width).be.type("undefined");
			should(view1.rect.width).eql(85);
			should(view2.rect.width).eql(10);
			should(view3.rect.width).eql(30);
			finish();
		});
		parentView.add(view1);
		parentView.add(view2);
		parentView.add(view3);
		win.add(parentView);
		win.open();
	});
	// functional test #1034/1034a/1034b UndefinedLeft
	it("undefinedLeft", function(finish) {
		var win = Ti.UI.createWindow();
		var view1 = Ti.UI.createView({
			width: 120,
			center: {
				x: 80
			}
		});
		var view2 = Ti.UI.createView({
			right: 120,
			center: {
				x: 80
			}
		});
		var view3 = Ti.UI.createView({
			right: 80,
			width: 120
		});
		win.addEventListener("postlayout", function(e) {
			should(view1.left).be.type("undefined");
			should(view2.left).be.type("undefined");
			should(view3.left).be.type("undefined");
			should(view1.rect.x).not.be.type("undefined");
			should(view2.rect.x).not.be.type("undefined");
			should(view3.rect.x).not.be.type("undefined");
			should(view1.rect.y).not.be.type("undefined");
			should(view2.rect.y).not.be.type("undefined");
			should(view3.rect.y).not.be.type("undefined");
			should(view1.rect.width).not.be.type("undefined");
			should(view2.rect.width).not.be.type("undefined");
			should(view3.rect.width).not.be.type("undefined");
			should(view1.rect.height).not.be.type("undefined");
			should(view2.rect.height).not.be.type("undefined");
			should(view3.rect.height).not.be.type("undefined");
			finish();
		});
		win.add(view1);
		win.add(view2);
		win.add(view3);
		win.open();
	});
	// functional test #1035 & #1039 UndefinedCenter
	it("undefinedCenter", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({});
		win.addEventListener("postlayout", function(e) {
			should(view.center).be.type("undefined");
			//Dynamic center can be calculated from view.rect
			should(view.rect).not.be.type("undefined");
			finish();
		});
		win.add(view);
		win.open();
	});
	// functional test #1036 UndefinedRight
	it("undefinedRight", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "yellow",
			center: {
				x: 50
			},
			left: 10
		});
		win.addEventListener("postlayout", function(e) {
			should(view.right).be.type("undefined");
			should(view.rect.width).eql(80);
			should(view.rect.x).eql(10);
			finish();
		});
		win.add(view);
		win.open();
	});
	// functional test #1037, #1037a, #1037b
	// UndefinedHeight Implicit calculations
	it("undefinedHeight", function(finish) {
		var win = Ti.UI.createWindow();
		var parentView = Ti.UI.createView({
			width: 100,
			height: 100
		});
		var view1 = Ti.UI.createView({
			top: 5,
			bottom: 10
		});
		var view2 = Ti.UI.createView({
			top: 5,
			center: {
				y: 10
			}
		});
		var view3 = Ti.UI.createView({
			center: {
				y: 75
			},
			bottom: 10
		});
		win.addEventListener("postlayout", function(e) {
			should(view1.height).be.type("undefined");
			should(view2.height).be.type("undefined");
			should(view3.height).be.type("undefined");
			should(view1.rect.height).eql(85);
			should(view2.rect.height).eql(10);
			should(view3.rect.height).eql(30);
			finish();
		});
		parentView.add(view1);
		parentView.add(view2);
		parentView.add(view3);
		win.add(parentView);
		win.open();
	});
	// functional test #1038, 1038a, 1038b
	// UndefinedTop. Dynamic top calculation
	it("undefinedTop", function(finish) {
		var win = Ti.UI.createWindow();
		var view1 = Ti.UI.createView({
			height: 50,
			center: {
				y: 200
			}
		});
		var view2 = Ti.UI.createView({
			center: {
				y: 50
			},
			bottom: 200
		});
		var view3 = Ti.UI.createView({
			bottom: 200,
			height: 100
		});
		win.addEventListener("postlayout", function(e) {
			//Static Tops
			should(view1.top).be.type("undefined");
			should(view2.top).be.type("undefined");
			should(view3.top).be.type("undefined");
			//Dynamic Tops
			should(view1.rect.y).eql(175);
			if (win.size.height <= 250) //View Height of 0 positioned at center
			should(view2.rect.y).eql(50); else //View height = 2x(wh - bottom - center)
			//View top = center - height/2 = 2c + b - wh
			should(view2.rect.y).eql(300 - win.size.height);
			should(view3.rect.y).eql(win.size.height - 300);
			finish();
		});
		win.add(view1);
		win.add(view2);
		win.add(view3);
		win.open();
	});
	// functional test #1040 UndefinedBottom
	it("undefinedBottom", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "yellow",
			center: {
				y: 50
			},
			top: 10
		});
		win.addEventListener("postlayout", function(e) {
			should(view.bottom).be.type("undefined");
			//Dynamic bottom is rect.y + rect.height
			should(view.rect.height).not.be.type("undefined");
			finish();
		});
		win.add(view);
		win.open();
	});
	// functional test #1042 WidthPrecedence
	it("widthPrecedence", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "yellow",
			left: 10,
			right: 15,
			width: 10
		});
		win.addEventListener("postlayout", function(e) {
			should(view.size.width).eql(10);
			finish();
		});
		win.add(view);
		win.open();
	});
	// functional test #1043 LeftPrecedence
	it("leftPrecedence", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "yellow",
			left: 10,
			right: 100,
			center: {
				x: 30
			}
		});
		win.addEventListener("postlayout", function(e) {
			should(view.size.width).eql(40);
			finish();
		});
		win.add(view);
		win.open();
	});
	// functional test #1044 CenterXPrecedence
	it("centerXPrecedence", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			height: 200,
			width: 200,
			backgroundColor: "yellow"
		});
		var viewChild = Ti.UI.createView({
			backgroundColor: "red",
			center: {
				x: 100
			},
			right: 50
		});
		win.addEventListener("postlayout", function(e) {
			should(viewChild.size.width).eql(100);
			finish();
		});
		view.add(viewChild);
		win.add(view);
		win.open();
	});
	// functional test #1046 HeightPrecedence
	it("heightPrecedence", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "yellow",
			top: 10,
			bottom: 15,
			height: 10
		});
		win.addEventListener("postlayout", function(e) {
			should(view.size.height).eql(10);
			finish();
		});
		win.add(view);
		win.open();
	});
	// functional test #1047 TopPrecedence
	it("topPrecedence", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			backgroundColor: "yellow",
			top: 10,
			bottom: 100,
			center: {
				y: 30
			}
		});
		win.addEventListener("postlayout", function(e) {
			should(view.size.height).eql(40);
			finish();
		});
		win.add(view);
		win.open();
	});
	// functional test #1048 CenterYPrecedence
	it("centerYPrecedence", function(finish) {
		var win = Ti.UI.createWindow();
		var view = Ti.UI.createView({
			height: 200,
			width: 200,
			backgroundColor: "yellow"
		});
		var viewChild = Ti.UI.createView({
			backgroundColor: "red",
			center: {
				y: 100
			},
			bottom: 50
		});
		win.addEventListener("postlayout", function(e) {
			should(viewChild.size.height).eql(100);
			finish();
		});
		view.add(viewChild);
		win.add(view);
		win.open();
	});
	// functional test #1053 ScrollViewSize
	it("scrollViewSize", function(finish) {
		/*
		 * CB: this test makes no sense whatsoever
		 */
		var win = Ti.UI.createWindow();
		var label = Ti.UI.createLabel({
			color: "red"
		});
		var label2 = Ti.UI.createLabel({
			text: "View Size is: ",
			top: 20,
			left: 10,
			height: 200,
			color: "black"
		});
		var scrollView = Titanium.UI.createScrollView({
			contentHeight: "auto",
			contentWidth: "auto",
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: true,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
		});
		var scrollView2 = Titanium.UI.createScrollView({
			contentHeight: "auto",
			contentWidth: "auto",
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: true
		});
		label.add(scrollView);
		label2.add(scrollView2);
		var view = Ti.UI.createView({
			backgroundColor: "green",
			borderRadius: 10,
			width: 200,
			height: 200
		});
		//var scrollView3 = Titanium.UI.createScrollView({
		//	contentHeight: "auto",
		//	contentWidth: "auto",
		//	showVerticalScrollIndicator: true,
		//	showHorizontalScrollIndicator: true
		//});
		win.addEventListener("postlayout", function(e) {
			//LABEL HAS SIZE AUTO BEHAVIOR.
			//SCROLLVIEW HAS FILL BEHAVIOR
			//LABEL will have 0 size (no text)
			//LABEL2 will have non 0 size (has text/pins)
			should(label.size).not.be.type("undefined");
			should(label2.size).not.be.type("undefined");
			should(scrollView.size).not.be.type("undefined");
			should(scrollView2.size).not.be.type("undefined");
			if (Ti.Platform.osname === 'iphone') {
				//Android does not return 0 height even when there is no text
				should(label.size.width).eql(0);
				should(label.size.height).eql(0);
				// Adding a scroll view to a label does not work in android: TIMOB-7817
				should(scrollView.size.width).eql(0);
				should(scrollView.size.height).eql(0);
				should(label2.size.height).not.be.eql(0);
				should(label2.size.width).not.be.eql(0);
				should(scrollView2.size.height).not.be.eql(0);
				should(scrollView2.size.width).not.be.eql(0);
				should(label2.size.width).eql(scrollView2.size.width);
				should(label2.size.height).eql(scrollView2.size.height);
			}
			// This is not working yet due to TIMOB-5303
			// valueOf(testRun, scrollView3.size.height).shouldNotBe(0);
			// valueOf(testRun, scrollView3.size.width).shouldNotBe(0);
			//
			// valueOf(testRun, view.size.width).shouldBe(scrollView3.size.width);
			// valueOf(testRun, view.size.height).shouldBe(scrollView3.size.height);
			finish();
		});
		view.add(scrollView);
		win.add(view);
		win.add(scrollView2);
		win.add(label);
		win.open();
	});
	// functional test #1106 ZIndexMultiple
	it("zIndexMultiple", function(finish) {
		var win = Ti.UI.createWindow();
		var view1 = Ti.UI.createView({
			backgroundColor: "red",
			zIndex: 0,
			height: 50,
			width: 50,
			top: 10
		});
		var view2 = Ti.UI.createView({
			backgroundColor: "orange",
			zIndex: 1,
			height: 50,
			width: 50,
			top: 20
		});
		var view3 = Ti.UI.createView({
			backgroundColor: "yellow",
			zIndex: 2,
			height: 50,
			width: 50,
			top: 30
		});
		var view4 = Ti.UI.createView({
			backgroundColor: "green",
			zIndex: 3,
			height: 50,
			width: 50,
			top: 40
		});
		var view5 = Ti.UI.createView({
			backgroundColor: "blue",
			zIndex: 4,
			height: 50,
			width: 50,
			top: 50
		});
		win.addEventListener("postlayout", function(e) {
			should(view1.zIndex).eql(0);
			should(view2.zIndex).eql(1);
			should(view3.zIndex).eql(2);
			should(view4.zIndex).eql(3);
			should(view5.zIndex).eql(4);
			finish();
		});
		win.add(view5);
		win.add(view4);
		win.add(view3);
		win.add(view2);
		win.add(view1);
		win.open();
	});
	it("fillInVerticalLayout", function(finish) {
		var win = Ti.UI.createWindow({});
		var parent = Ti.UI.createView({
			height: 50,
			width: 40,
			layout: "vertical"
		});
		var child = Ti.UI.createView({});
		parent.add(child);
		win.add(parent);
		win.addEventListener("postlayout", function(e) {
			should(parent.size.width).eql(40);
			should(parent.size.height).eql(50);
			should(child.size.width).eql(40);
			should(child.size.height).eql(50);
			finish();
		});
		win.open();
	});
	it("sizeFillConflict", function(finish) {
		var win = Ti.UI.createWindow({});
		var grandParent = Ti.UI.createView({
			height: 300,
			width: 200
		});
		var parent = Ti.UI.createView({
			height: Ti.UI.SIZE
		});
		var child1 = Ti.UI.createView({
			height: Ti.UI.SIZE
		});
		var child2 = Ti.UI.createView({
			height: 50
		});
		var child3 = Ti.UI.createView({
			width: 30
		});
		child1.add(child2);
		child1.add(child3);
		parent.add(child1);
		grandParent.add(parent);
		win.add(grandParent);
		win.addEventListener("postlayout", function(e) {
			should(grandParent.size.width).eql(200);
			should(grandParent.size.height).eql(300);
			should(parent.size.width).eql(200);
			should(parent.size.height).eql(300);
			should(child1.size.width).eql(200);
			should(child1.size.height).eql(300);
			should(child2.size.width).eql(200);
			should(child2.size.height).eql(50);
			should(child3.size.width).eql(30);
			should(child3.size.height).eql(300);
			finish();
		});
		win.open();
	});
	// Functional Test #1000 SystemMeasurement
	it("systemMeasurement", function(finish) {
		var win = Ti.UI.createWindow({});
		var parent = Ti.UI.createView({
			height: "50dip",
			width: "40px",
			layout: "vertical"
		});
		var child = Ti.UI.createView({});
		parent.add(child);
		win.add(parent);
		win.addEventListener("postlayout", function(e) {
			if ("android" === Ti.Platform.osname) should(parent.size.width).eql(40); else if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) should(parent.size.height).eql(50);
			finish();
		});
		win.open();
	});
	// Functional Test #1001 #1002 #1003 #1004 #1005 #1006
	it("unitMeasurements", function(finish) {
		var win = Ti.UI.createWindow({});
		var child = Ti.UI.createView({
			height: "50mm",
			width: "40cm"
		});
		var child1 = Ti.UI.createView({
			height: "1in",
			width: "100px"
		});
		var child2 = Ti.UI.createView({
			height: "50dip",
			width: "40dp"
		});
		var child3 = Ti.UI.createView({
			//inavlid measurement
			height: "invalid",
			width: "inavlid"
		});
		win.add(child);
		win.add(child1);
		win.add(child2);
		win.addEventListener("postlayout", function(e) {
			should(child.size.width).not.be.eql(0);
			should(child.size.height).not.be.eql(0);
			should(child1.size.width).not.be.eql(0);
			should(child1.size.height).not.be.eql(0);
			should(child2.size.width).not.be.eql(0);
			should(child2.size.height).not.be.eql(0);
			should(child3.size.width).eql(0);
			should(child3.size.height).eql(0);
			finish();
		});
		win.open();
	});
	// Scrollview
	it("scrollViewAutoContentHeight", function(finish) {
		var win = Ti.UI.createWindow({});
		var scrollView = Titanium.UI.createScrollView({
			contentHeight: "auto",
			contentWidth: "auto",
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: true
		});
		var view2 = Ti.UI.createView({});
		scrollView.add(view2);
		win.addEventListener("postlayout", function(e) {
			should(view2.size.width).eql(scrollView.size.width);
			should(view2.size.height).eql(scrollView.size.height);
			finish();
		});
		win.add(scrollView);
		win.open();
	});
	it("scrollViewLargeContentHeight", function(finish) {
		var win = Ti.UI.createWindow({});
		var scrollView = Titanium.UI.createScrollView({
			contentHeight: "2000",
			contentWidth: "auto",
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: true
		});
		var view2 = Ti.UI.createView({});
		scrollView.add(view2);
		win.addEventListener("postlayout", function(e) {
			should(view2.size.width).eql(scrollView.size.width);
			should(view2.size.height).eql(2e3);
			finish();
		});
		win.add(scrollView);
		win.open();
	});
	it("scrollViewMinimumContentHeight", function(finish) {
		var win = Ti.UI.createWindow({});
		var scrollView = Titanium.UI.createScrollView({
			contentHeight: "50",
			contentWidth: "auto",
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: true
		});
		var view2 = Ti.UI.createView({});
		scrollView.add(view2);
		win.addEventListener("postlayout", function(e) {
			should(view2.size.width).eql(scrollView.size.width);
			should(view2.size.height).eql(scrollView.size.height);
			finish();
		});
		win.add(scrollView);
		win.open();
	});
	it("horizontalScrollViewMinimumContentHeight", function(finish) {
		var win = Ti.UI.createWindow({});
		var scrollView = Titanium.UI.createScrollView({
			contentHeight: "auto",
			contentWidth: "50",
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: true,
			scrollType: "horizontal"
		});
		var view2 = Ti.UI.createView({});
		scrollView.add(view2);
		win.addEventListener("postlayout", function(e) {
			should(view2.size.width).eql(scrollView.size.width);
			should(view2.size.height).eql(scrollView.size.height);
			finish();
		});
		win.add(scrollView);
		win.open();
	});
	it("horizontalScrollViewLargeContentHeight", function(finish) {
		var win = Ti.UI.createWindow({});
		var scrollView = Titanium.UI.createScrollView({
			contentHeight: "auto",
			contentWidth: "50",
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: true,
			scrollType: "horizontal"
		});
		var view2 = Ti.UI.createView({});
		scrollView.add(view2);
		win.addEventListener("postlayout", function(e) {
			should(view2.size.width).eql(scrollView.size.width);
			should(view2.size.height).eql(scrollView.size.height);
			finish();
		});
		win.add(scrollView);
		win.open();
	});
	//TIMOB-8362
	it("scrollViewWithSIZE", function(finish) {
		var win = Ti.UI.createWindow({
			backgroundColor: "#7B6700",
			layout: "vertical"
		});
		var NavBarView = Ti.UI.createView({
			height: "25",
			top: 0,
			backgroundColor: "green",
			width: "100%"
		});
		var scrollView = Ti.UI.createScrollView({
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			scrollType: "vertical",
			layout: "vertical",
			backgroundColor: "red"
		});
		var button = Ti.UI.createButton({
			title: "Click",
			width: "100",
			height: "50"
		});
		scrollView.add(button);
		win.add(NavBarView);
		win.add(scrollView);
		win.addEventListener("postlayout", function(e) {
			should(scrollView.size.height).eql(50);
			should(scrollView.size.width).eql(100);
			finish();
		});
		win.open();
	});
	//TIMOB-8891
	it("scrollViewWithLargeVerticalLayoutChild", function(finish) {
		var win = Ti.UI.createWindow();
		var scrollView = Ti.UI.createScrollView({
			contentHeight: "auto",
			backgroundColor: "green"
		});
		win.add(scrollView);
		var innerView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			// works if set to 1000
			layout: "vertical",
			left: 0,
			top: 0,
			right: 0
		});
		scrollView.add(innerView);
		var colors = [ "red", "blue", "pink", "white", "black" ];
		var max = 10;
		for (var i = 0; max > i; i++) innerView.add(Ti.UI.createView({
			backgroundColor: colors[i % colors.length],
			height: 100,
			top: 20
		}));
		win.addEventListener("postlayout", function(e) {
			should(innerView.size.height).eql(1200);
			should(innerView.size.width).eql(scrollView.size.width);
			finish();
		});
		win.open();
	});
	// Functional Test #1087-#1097
	it("convertUnits", function(finish) {
		// android
		var dpi = Ti.Platform.displayCaps.dpi;
		if ("android" === Ti.Platform.osname) {
			// 1087
			should(Ti.UI.convertUnits("1in", Ti.UI.UNIT_PX)).eql(dpi);
			should(Ti.UI.convertUnits("100", Ti.UI.UNIT_PX)).eql(100);
			// 1092
			should(Ti.UI.convertUnits("25.4mm", Ti.UI.UNIT_PX)).eql(dpi);
		} else if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
			// 1091
			// TODO: This needs to support retina
			should(Ti.UI.convertUnits("1in", Ti.UI.UNIT_DIP)).eql(dpi);
			should(Ti.UI.convertUnits("100", Ti.UI.UNIT_DIP)).eql(100);
			should(Ti.UI.convertUnits("25.4mm", Ti.UI.UNIT_DIP)).eql(dpi);
		}
		// 1088
		should(Math.round(Ti.UI.convertUnits(dpi.toString(), Ti.UI.UNIT_MM))).eql(25);
		// 1089
		should(Math.round(Ti.UI.convertUnits(dpi.toString(), Ti.UI.UNIT_CM))).eql(3);
		// 1088
		should(Math.round(Ti.UI.convertUnits(dpi.toString(), Ti.UI.UNIT_MM))).eql(25);
		// 1089
		should(Math.round(Ti.UI.convertUnits(dpi.toString(), Ti.UI.UNIT_CM))).eql(3);
		// 1090
		should(Math.round(Ti.UI.convertUnits(dpi.toString(), Ti.UI.UNIT_IN))).eql(1);
		// 1093
		should(Ti.UI.convertUnits("100cm", Ti.UI.UNIT_MM)).eql(1e3);
		// 1094
		should(Ti.UI.convertUnits("100in", Ti.UI.UNIT_CM)).eql(254);
		// 1097
		should(Ti.UI.convertUnits("abc", Ti.UI.UNIT_PX)).eql(0);
		finish();
	});
	it("fourPins", function(finish) {
		var win = Ti.UI.createWindow({
			width: 100,
			height: 100
		});
		var label = Ti.UI.createLabel({
			left: 10,
			right: 10,
			top: 10,
			bottom: 10
		});
		win.add(label);
		win.addEventListener("postlayout", function(e) {
			should(label.size.width).eql(80);
			should(label.size.height).eql(80);
			should(label.left).eql(10);
			should(label.right).eql(10);
			should(label.top).eql(10);
			should(label.bottom).eql(10);
			should(label.rect.x).eql(10);
			should(label.rect.width).eql(80);
			should(label.rect.y).eql(10);
			should(label.rect.height).eql(80);
			finish();
		});
		win.open();
	});
});