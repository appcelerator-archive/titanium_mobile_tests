/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("platform", function() {
	it("apiPoints", function(finish) {
		should(Ti.Platform.createUUID).be.a.Function;
		should(Ti.Platform.openURL).be.a.Function;
		should(Ti.Platform.is24HourTimeFormat).be.a.Function;
		should(Ti.Platform.is24HourTimeFormat()).be.Boolean;
		should(Ti.Platform.BATTERY_STATE_CHARGING).be.a.Number;
		should(Ti.Platform.BATTERY_STATE_FULL).be.a.Number;
		should(Ti.Platform.BATTERY_STATE_UNKNOWN).be.a.Number;
		should(Ti.Platform.BATTERY_STATE_UNPLUGGED).be.a.Number;
		should(Ti.Platform.address).be.a.String;
		should(Ti.Platform.architecture).be.a.String;
		should(Ti.Platform.availableMemory).be.a.Number;
		should(Ti.Platform.batteryMonitoring).be.Boolean;
		should(Ti.Platform.displayCaps).be.an.Object;
		should(Ti.Platform.displayCaps).not.be.null;
		should(Ti.Platform.displayCaps.dpi).be.a.Number;
		should(Ti.Platform.displayCaps.density).be.a.String;
		should(Ti.Platform.displayCaps.platformHeight).be.a.Number;
		should(Ti.Platform.displayCaps.platformWidth).be.a.Number;
		should(Ti.Platform.id).be.a.String;
		should(Ti.Platform.locale).be.a.String;
		should(Ti.Platform.macaddress).be.a.String;
		should(Ti.Platform.model).be.a.String;
		should(Ti.Platform.name).be.a.String;
		should(Ti.Platform.netmask).be.a.String;
		should(Ti.Platform.osname).be.a.String;
		should(Ti.Platform.ostype).be.a.String;
		should(Ti.Platform.processorCount).be.a.Number;
		should(Ti.Platform.version).be.a.String;
		should(Ti.Platform.runtime).be.a.String;
		if ("android" === Ti.Platform.osname) {
			should("rhino" === Ti.Platform.runtime || "v8" === Ti.Platform.runtime).be.true;
		} else if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
			should(Ti.Platform.runtime).eql("javascriptcore");
		} else {
			should(Ti.Platform.runtime.length).be.greaterThan(0);
		}
		finish();
	});
	//TIMOB-2475
	/**
	 * @platform ios
	 * @iosVersion 7.0, 7.1
	 */
	it("displayCaps_platformHeight", function(finish) {
		should(Titanium.Platform.displayCaps.platformHeight).not.be.type("undefined");
		finish();
	});
	//TIMOB-5752
	var platform_id;
	it("platform_id_A", function(finish) {
		platform_id = Ti.Platform.id;
		should(platform_id).not.be.null;
		finish();
	});
	it("platform_id_B", function(finish) {
		should(Ti.Platform.id).eql(platform_id);
		finish();
	});
	//TIMOB-7242
	it("platform_Android_API_LEVEL", function(finish) {
		if ("android" === Ti.Platform.osname) should(Ti.Platform.Android.API_LEVEL).be.a.Number;
		finish();
	});
	//TIMOB-7917
	it("displayCaps_platformWidth", function(finish) {
		if ("android" === Ti.Platform.osname) {
			var result = Ti.Platform.displayCaps.platformWidth;
			var LastDPI = Ti.Platform.displayCaps.dpi;
			should(Ti.Platform.displayCaps.platformWidth).eql(result);
		}
		finish();
	});
	//TIMOB-10043
	it("physicalSizeCategory", function(finish) {
		if ("android" === Ti.Platform.osname) should(Ti.Platform.Android.physicalSizeCategory).be.a.Number;
		finish();
	});
	//TIMOB-10482
	it("platform_manufacturer", function(finish) {
		should(Ti.Platform.getManufacturer()).eql(Ti.Platform.manufacturer);
		finish();
	});
});