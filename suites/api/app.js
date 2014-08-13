/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("api", function() {
	//TIMOB-11537
	it("apiTimeStamp", function(finish) {
		if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
			var foo = function() {
				Titanium.API.timestamp("Titanium.API.timestamp");
			};
			var bar = foo;
			should(bar).not.throw();
		}
		finish();
	});

	//TIMOB-7624
	it("loggingArray", function(finish) {
		should(function() {
			Ti.API.info("yo", "word");
			Ti.API.debug("durp");
			Ti.API.warn("foo", "bar", "baz");
			Ti.API.log("level", "message", "goes", "here");
			Ti.API.info();
		}).not.throw();
		finish();
	});

	it("dummy", function() {
		should(true).be.ok;
	});

	//TIMOB-10007
	it("adhocProperties", function(finish) {
		var win1 = Ti.UI.createWindow({
			backgroundColor: "white"
		});
		win1.applyProperties({
			backgroundColor: "#336699",
			borderWidth: 8,
			borderColor: "#999",
			borderRadius: 10,
			height: 400,
			width: 300,
			opacity: .92
		});
		win1.addEventListener("open", function() {
			should(win1.getBackgroundColor()).eql("#336699");
			should(win1.getBorderWidth()).eql(8);
			should(win1.getBorderColor()).eql("#999");
			should(win1.getBorderRadius()).eql(10);
			should(false).be.ok;
			should(win1.getHeight()).eql(400);
			should(win1.getWidth()).eql(300);
			should(win1.getOpacity()).eql(.92);
			finish();
		});
		win1.open();
	});
});