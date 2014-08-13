/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_imageview", function() {
	//TIMOB-1333
	it("loadEvent", function(finish) {
		var win1 = Titanium.UI.createWindow();
		var image = Titanium.UI.createImageView({
			width: "auto",
			height: "auto",
			image: "image.png"
		});
		image.addEventListener("load", function() {
			finish();
		});
		win1.add(image);
		win1.open();
	});

	//TIMOB-7317
	it("loadEventForImageState", function(finish) {
		this.timeout(10000);
		var win = Titanium.UI.createWindow();
		var imgView = Ti.UI.createImageView({
			touchEnabled: false,
			left: 0,
			top: 0,
			width: 100,
			image: "http://www.ambientreality.com/ingot/appcelerator.png",
			height: 100
		});
		imgView.addEventListener("load", function(e) {
			should(e.state).be.eql("image");
			finish();
		});
		win.add(imgView);
		win.open();
	});
});