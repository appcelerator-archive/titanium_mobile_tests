/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("network_socket", function() {
	it("testAPI", function(finish) {
		should(Ti.Network.Socket).be.an.Object;
		var functions = [ "createTCP" ];
		var properties = [ "INITIALIZED", "CONNECTED", "LISTENING", "CLOSED", "ERROR" ];
		for (var i = 0; i < functions.length; i++) {
			should(Ti.Network.Socket[functions[i]]).be.a.Function;
			should(Ti.Network.Socket[functions[i]]()).be.an.Object;
		}
		for (var i = 0; i < properties.length; i++) {
			should(Ti.Network.Socket[properties[i]]).be.a.Number;
		}
		finish();
	});
});