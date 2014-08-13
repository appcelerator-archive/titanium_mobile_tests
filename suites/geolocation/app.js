/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("geolocation", function() {
	it("getCurrentPositionException", function(finish) {
		// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2395-android-ks-geolocation-always-says-geo-turned-off-and-location-updates-never-occur
		should(function() {
			Ti.Geolocation.getCurrentPosition(function() {});
		}).not.throw();
		finish();
	});
	//TIMOB-8751
	it("getPreferredProviderAppCrash", function(finish) {
		should(function() {
			Titanium.Geolocation.getPreferredProvider();
		}).not.throw();
		finish();
	});
	//TIMOB-3077
	it("shouldBeLessThan360", function(finish) {
				this.timeout(5e4);
		if ("android" === Ti.Platform.osname) {
			var headingCallback = function(e) {
				should(e.heading.trueHeading).be.within(360, undefined);
				finish();
			};
			Titanium.Geolocation.addEventListener("heading", headingCallback);
		} else finish();
	});
	//TIMOB-9434
	it("trueHeadingNotGenerated", function(finish) {
				this.timeout(5e4);
		if ("android" === Ti.Platform.osname) {
			var headingHandler = function(e) {
				should(e.heading.trueHeading).not.be.type("undefined");
				finish();
			};
			Ti.Geolocation.addEventListener("heading", headingHandler);
		} else finish();
	});
	//TIMOB-11235
	it("invalidValue", function(finish) {
		if ("android" === Ti.Platform.osname) {
			gpsProvider = Ti.Geolocation.Android.createLocationProvider({
				name: Ti.Geolocation.PROVIDER_GPS,
				minUpdateTime: "5.0",
				minUpdateDistance: "3.0"
			});
			should(gpsProvider.minUpdateTime).eql("5.0");
			should(gpsProvider.minUpdateDistance).eql("3.0");
			finish();
		} else finish();
	});
	//TIMOB-12598
	it("reverseGeocoder", function(finish) {
		Ti.Geolocation.reverseGeocoder(51.5171, -.1062, function(e) {
			should(e.places[0].address).eql("Saint Andrew, Shoe Lane, City of London, Greater London, England, EC4A 3AB, United Kingdom, European Union");
		});
		Ti.Geolocation.reverseGeocoder(40.7142, -74.0064, function(e) {
			should(e.places[0].address).eql("Tower 270, 270, Broadway, Tribeca, NYC, New York, 10003, United States of America");
		});
		finish();
	});
});