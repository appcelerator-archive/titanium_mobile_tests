/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("yahoo", function() {
	it("yqlFlickrCats", function(finish) {
		this.timeout(10000);

		Ti.Yahoo.yql('select * from geo.places where text="san francisco, ca"', function(e) {
			should(e.error).be.type('undefined');
			var data = e.data;
			should(data).not.be.null;
			should(data.place).not.be.null;
			should(data.place.name).eql('San Francisco');
			finish();
		});
	});
});