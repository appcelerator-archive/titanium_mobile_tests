/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("string", function() {
	//TIMOB-11709
	it("string", function(finish) {
		should(function() {
			String.formatTime("GIBBERISH");
		}).not.throw();
		finish();
	});

	//KitchenSink: Platform
	it("search_case_insensitive", function(finish) {
		var mystring = "Add to Address Book";
		should(mystring.search(/ss/i)).eql(12);
		should(mystring.search(/ess/i)).eql(11);
		should(mystring.search(/ress/i)).eql(10);
		should(mystring.search(/dress/i)).eql(9);
		should(mystring.search(/ddress/i)).eql(8);
		should(mystring.search(/address/i)).eql(7);
		should(mystring.search(/address /i)).eql(7);
		should(mystring.search(/ddress/)).eql(8);
		finish();
	});
});