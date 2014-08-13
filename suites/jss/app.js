/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("jss", function() {
	it("platform_jss_dirs", function(finish) {
		var test = Ti.UI.createView({
			id: "test"
		});
		should(test).not.be.null;
		if (Ti.Platform.name == "android") {
			should(test.backgroundColor).eql("red");
		} else if (Ti.Platform.name == "iphone") {
			should(test.backgroundColor).eql("blue");
		}
		finish();
	});
});