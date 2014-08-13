/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_picker", function() {
	//TIMOB-6956
	it("showDatePickerDialog", function(finish) {
		if ("android" === Ti.Platform.osname) {
			var picker = Ti.UI.createPicker();
			should(function() {
				picker.showDatePickerDialog({
					value: new Date(2010, 8, 1)
				});
			}).not.throw();
			finish();
		} else finish();
	});
	//TIMOB-7313
	it("datePickerGetValue", function(finish) {
		if ("android" === Ti.Platform.osname) {
			var win = Ti.UI.createWindow({
				backgroundColor: "#000"
			});
			var datePicker = Ti.UI.createPicker({
				type: Ti.UI.PICKER_TYPE_DATE,
				useSpinner: false
			});
			var customPicker = Ti.UI.createPicker({
				type: Ti.UI.PICKER_TYPE_DATE,
				useSpinner: false
			});
			win.add(datePicker);
			win.add(customPicker);
			win.open();
			setTimeout(function() {
				should(function() {
					datePicker.getValue();
				}).not.throw();
				should(customPicker.getValue()).not.be.type("undefined");
				finish();
			}, 1e4);
		} else finish();
	});
	//TIMOB-1462
	it("countdownPicker", function(finish) {
		if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
			var win1 = Titanium.UI.createWindow({
				backgroundColor: "black"
			});
			var duration = 6e4 * 3;
			var picker = Ti.UI.createPicker({
				type: Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER,
				countDownDuration: duration
			});
			picker.selectionIndicator = true;
			win1.add(picker);
			win1.open();
			setTimeout(function() {
				should(picker.getCountDownDuration()).eql(18e4);
			}, 1e4);
			finish();
		} else finish();
	});
});