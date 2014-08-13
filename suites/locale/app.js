/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("locale", function() {
	it("localePPEnhancements", function(finish) {
		should(Ti.Locale.getCurrentLanguage()).eql("en");
		should(Ti.Locale.getCurrentCountry().search(/^[A-Z]{2}$/)).be.within(0, 1/0);
		var x = Ti.Locale.getCurrentLocale();
		should(x.search(/^[a-z]{2}$/) >= 0 || x.search(/^[a-z]{2}\-[A-Z]{2}$/) >= 0).be.true;
		should(Ti.Locale.getCurrencyCode("en-US")).eql("USD");
		should(Ti.Locale.getCurrencySymbol("USD")).eql("$");
		should(Ti.Locale.getLocaleCurrencySymbol("en-US")).eql("$");
		finish();
	});
	it("stringPPEnhancements", function(finish) {
		should(String.formatDecimal(2.5)).eql("2.5");
		should(String.formatDecimal(2.5, "000.000")).eql("002.500");
		should(String.formatDecimal(2.5, "de-DE")).eql("2,5");
		should(String.formatDecimal(2.5, "de-DE", "000.0000")).eql("002,5000");
		finish();
	});
});