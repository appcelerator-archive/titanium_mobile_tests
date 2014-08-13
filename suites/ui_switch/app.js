/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_switch", function() {
	//TIMOB-9324
	it("changeEventOnLoading", function(finish) {
		var flag = true;
		var win = Ti.UI.createWindow();
		var simpleSwitch = Ti.UI.createSwitch({
			value: false
		});
		win.add(simpleSwitch);
		simpleSwitch.addEventListener("change", function(e) {
			flag = false;
		});
		win.open();
		should(flag).be.true;
		finish();
	});
});