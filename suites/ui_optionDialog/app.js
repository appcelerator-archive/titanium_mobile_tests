/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_optionDialog", function() {
	//TIMOB-7548
	it("dialogBox", function(finish) {
		this.timeout(6e4);
		var win = Ti.UI.createWindow();
		var dialog = Titanium.UI.createOptionDialog({
			options: [ "Option 1", "Option 2" ],
			cancel: 1
		});
		var fun = function() {
			dialog.show();
			dialog.hide();
			setTimeout(function() {
				should(function() {
					dialog.show();
				}).not.throw();
				finish();
			}, 2e3);
		};
		win.addEventListener("postlayout", fun);
		win.open();
	});
});