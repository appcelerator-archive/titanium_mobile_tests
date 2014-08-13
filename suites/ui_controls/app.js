/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_controls", function() {
	it("textControlsTextValueInitialValue", function(finish) {
		var f = Ti.UI.createLabel();
		should(f.text).eql("");
		f = Ti.UI.createTextField();
		should(f.value).eql("");
		f = Ti.UI.createTextArea();
		should(f.value).eql("");
		f = Ti.UI.createSearchBar();
		should(f.value).eql("");
		f = Ti.UI.createButton();
		should(f.title).eql("");
		finish();
	});
	it("textAreaFieldsHasText", function(finish) {
		var textArea1 = Ti.UI.createTextArea();
		var hasText = textArea1.hasText();
		should(hasText).eql(false);
		var textArea2 = Ti.UI.createTextArea({
			value: "I am a textarea"
		});
		hasText = textArea2.hasText();
		should(hasText).eql(true);
		var textArea3 = Ti.UI.createTextArea({
			value: ""
		});
		hasText = textArea3.hasText();
		should(hasText).eql(false);
		var textField1 = Ti.UI.createTextField();
		hasText = textField1.hasText();
		should(hasText).eql(false);
		var textField2 = Ti.UI.createTextField({
			value: "I am a textfield"
		});
		hasText = textField2.hasText();
		should(hasText).eql(true);
		var textField3 = Ti.UI.createTextField({
			value: ""
		});
		hasText = textField3.hasText();
		should(hasText).eql(false);
		finish();
	});
	it("scrollableViewScrollEvents", function(finish) {
		// functional test for TIMOB-8933, TIMOB-9061: `scroll` event and `scrollEnd` event
		var win = Ti.UI.createWindow({
			layout: "horizontal"
		});
		var view1 = Ti.UI.createView({
			backgroundColor: "#123",
			width: 250
		});
		var view2 = Ti.UI.createView({
			backgroundColor: "#246",
			width: 250
		});
		var view3 = Ti.UI.createView({
			backgroundColor: "#48b",
			width: 250
		});
		var scrollableView = Ti.UI.createScrollableView({
			views: [ view1, view2, view3 ],
			showPagingControl: true,
			width: 300,
			height: 430
		});
		win.add(scrollableView);
		win.open();
		var scrollingEvents = [];
		// Catch all scrolling events, then validate them
		scrollableView.addEventListener("scroll", function(e) {
			Ti.API.debug("scrollableView got a scroll event: float:" + e.currentPageAsFloat + " int: " + e.currentPage);
			scrollingEvents.push(e);
		});
		setTimeout(function() {
			scrollableView.scrollToView(1);
		}, 300);
		scrollableView.addEventListener("dragEnd", function(e) {
			Ti.API.debug("scrollableView got dragEnd event: " + e.currentPage);
		});
		// This is fired when the scrollToView has completed; time to validate our events!
		scrollableView.addEventListener("scrollEnd", function(endEvent) {
			Ti.API.debug("scrollableView got a scrollEnd event: " + endEvent.currentPage);
			var numEvents = scrollingEvents.length;
			should(endEvent.currentPage).eql(1);
			// On Android, sometimes, we don't collect enough events to have some that
			// are within these checks.  If that appears to be the case, don't run these
			// checks.
			if (numEvents > 5) {
				should(scrollingEvents[0].currentPage).eql(0);
				should(scrollingEvents[0].view).eql(view1);
				should(scrollingEvents[0].currentPageAsFloat).be.lessThan(.8);
				should(scrollingEvents[numEvents - 1].currentPageAsFloat).be.greaterThan(.2);
			}
			should(scrollingEvents[numEvents - 1].currentPage).eql(1);
			should(scrollingEvents[numEvents - 1].view).eql(view2);
			Ti.API.debug("passed");
			finish();
		});
		finish();
	});
});