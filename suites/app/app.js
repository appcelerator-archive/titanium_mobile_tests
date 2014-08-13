/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("app", function() {
	it("test_custom_values", function(finish) {
		should(Ti.App.id).eql("org.appcelerator.titanium.testharness");
		should(Ti.App.name).eql("test_harness");
		should(Ti.App.version).eql("1.0.1");
		should(Ti.App.publisher).eql("test publisher");
		should(Ti.App.url).eql("http://www.test.com");
		should(Ti.App.description).eql("test description");
		should(Ti.App.copyright).eql("copyright 2010 test");
		finish();
	});
});