/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("console", function() {
	it("consoleAPI", function(finish) {
		should(console).be.an.Object;
		should(console.log).be.a.Function;
		should(console.warn).be.a.Function;
		should(console.error).be.a.Function;
		should(console.info).be.a.Function;
		should(console.debug).be.a.Function;
		finish();
	});
});