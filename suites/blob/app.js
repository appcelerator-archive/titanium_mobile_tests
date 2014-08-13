/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("blob", function() {
	it("testBlob", function(finish) {
		// TIMOB-9175 -- nativePath should be null for non-file Blobs.
		// The inverse case is tested in filesystem.js.
		should(function() {
			var myBlob = Ti.createBuffer({
				value: "Use a string to build a buffer to make a blob."
			}).toBlob();
			should(myBlob.nativePath).be.null;
		}).not.throw();
		finish();
	});
	//TIMOB-7081
	it("invalidSource", function(finish) {
		if ("android" === Ti.Platform.osname) should(function() {
			var image1 = Ti.UI.createImageView({
				image: "images/schat.png"
			});
			var blob = image1.toBlob();
			var win = Ti.UI.createWindow({
				backgroundColor: "white"
			});
			win.add(image1);
			win.open();
		}).not.throw();
		finish();
	});
});