/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("analytics", function() {
	it("featureEvent", function(finish) {
		should(function() {
			Ti.Analytics.featureEvent();
		}).throw();
		should(Ti.Analytics.featureEvent("featureEvent.testButton")).be.type("undefined");
		should(Ti.Analytics.featureEvent("featureEvent.testButton", {
			events: "feature"
		})).be.type("undefined");
		finish();
	});
	it("navEvent", function(finish) {
		should(function() {
			Ti.Analytics.navEvent();
		}).throw();
		should(function() {
			Ti.Analytics.navEvent("here");
		}).throw();
		should(Ti.Analytics.navEvent("here", "there")).be.type("undefined");
		should(Ti.Analytics.navEvent("here", "there", "navEvent.testButton")).be.type("undefined");
		should(Ti.Analytics.navEvent("here", "there", "navEvent.testButton", {
			events: "nav"
		})).be.type("undefined");
		finish();
	});
});