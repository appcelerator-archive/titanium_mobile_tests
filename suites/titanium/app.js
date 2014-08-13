/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("titanium", function() {
	it("buildHash", function(finish) {
		should(Titanium.buildHash.length).eql(7);
		finish();
	});
	it("userAgent", function(finish) {
		should(Titanium.userAgent).be.a.String;
		should(Titanium.userAgent.indexOf("Titanium")).be.a.Number;
		finish();
	});
	//TIMOB-1915
	it("analytics", function(finish) {
		should(function() {
			Ti.Analytics.featureEvent("myevent1");
			Ti.Analytics.featureEvent("myevent2", {
				extraData: "test"
			});
		}).not.throw();
		finish();
	});
});