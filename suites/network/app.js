/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("network", function() {
	it("uriComponents", function(finish) {
		should(encodeURIComponent).be.a.Function;
		should(decodeURIComponent).be.a.Function;
		should(Ti.Network.encodeURIComponent).be.a.Function;
		should(Ti.Network.decodeURIComponent).be.a.Function;
		// Taken from: http://www.w3schools.com/jsref/jsref_encodeURIComponent.asp
		var uri = "http://w3schools.com/my test.asp?name=ståle&car=saab";
		var encoded = encodeURIComponent(uri);
		should(encoded).eql(Ti.Network.encodeURIComponent(uri));
		should(encoded).eql("http%3A%2F%2Fw3schools.com%2Fmy%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab");
		should(decodeURIComponent(encoded)).eql(uri);
		should(Ti.Network.decodeURIComponent(encoded)).eql(uri);
		// Taken from: https://appcelerator.lighthouseapp.com/projects/32238/tickets/986-implement-tinetworkdecodeencodeuricomponent
		uri = "http://www.google.com?somestring=more&more";
		encoded = encodeURIComponent(uri);
		should(encoded).eql(Ti.Network.encodeURIComponent(uri));
		should(encoded).eql("http%3A%2F%2Fwww.google.com%3Fsomestring%3Dmore%26more");
		should(decodeURIComponent(encoded)).eql(uri);
		should(Ti.Network.decodeURIComponent(encoded)).eql(uri);
		finish();
	});
	//TIMOB-2849
	it("set_CookieResponseHeaders", function(finish) {
		var testServer = "http://www.ambientreality.com/ingot/cookie_test.php";
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function(e) {
			should(this.getResponseHeader("Set-Cookie")).eql("CookieName1=CookieValue1; path=/, CookieName2=CookieValue2; path=/");
			finish();
		};
		xhr.open("GET", testServer + "?count=2&clear=false");
		xhr.send();
	});
	//TIMOB-5807
	it("getResponseHeaderReturnsNull", function(finish) {
		var url = "https://api.cloud.appcelerator.com/v1/checkins/show.json";
		var request = Titanium.Network.createHTTPClient();
		request.open("GET", url);
		request.send();
		request.onerror = function() {
			if (401 == this.status) {
				should(this.getResponseHeader("WWW-Authenticate")).be.a.String;
				finish();
			}
		};
	});
	//TIMOB-6828
	it("nullRequestHeader", function(finish) {
		should(function() {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.onload = function() {};
			xhr.open("GET", "http://www.appcelerator.com");
			xhr.setRequestHeader("Authorization", null);
			xhr.send();
		}).not.throw();
		finish();
	});
	//TIMOB-6973
	it("sendingBlobsAsForm", function(finish) {
		should(function() {
			var xhr = Ti.Network.createHTTPClient({});
			xhr.setTimeout = 16e5;
			xhr.open("POST", "http://www.ambientreality.com/ingot/post_test.php");
			xhr.setRequestHeader("ContentType", "multipart/form-data");
			xhr.send({
				blobtest: Ti.UI.createImageView({
					image: "KS_nav_ui.png",
					height: 200,
					width: 200
				}).toBlob()
			});
		}).not.throw();
		finish();
	});
	//TIMOB-7264, TIMOB-7850
	it("uploadFiles", function(finish) {
		var image = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "KS_nav_ui.png");
		var xhr = Titanium.Network.createHTTPClient();
		xhr.setTimeout(2e4);
		xhr.onload = function(e) {
			should(this.status).eql(200);
			should(this.readyState).eql(4);
			finish();
		};
		xhr.open("POST", "http://www.ambientreality.com/ingot/post_test.php");
		xhr.send({
			media: image,
			username: "fgsandford1000",
			password: "sanford1000",
			message: "check me out"
		});
	});
	//TIMOB-9108, TIMOB-10321
	it("networkChangeListener", function(finish) {
		if ("android" === Ti.Platform.osname) {
			Ti.Network.addEventListener("change", function(e) {
				should(Titanium.Network.online).be.true;
				finish();
			});
			var tab = Ti.UI.createTabGroup();
			var win1 = Ti.UI.createWindow({
				title: "NetworkStatus Sample",
				backgroundColor: "#fff"
			});
			var tab1 = Ti.UI.createTab({
				title: "tab1",
				backgroundColor: "#fff",
				window: win1
			});
			tab.addTab(tab1);
			tab.open();
		} else finish();
	});
	//TIMOB-9864
	it("network_Property", function(finish) {
		should(Ti.Network.NETWORK_NONE).eql(0);
		should(Ti.Network.NETWORK_WIFI).eql(1);
		should(Ti.Network.NETWORK_MOBILE).eql(2);
		should(Ti.Network.NETWORK_LAN).eql(3);
		should(Ti.Network.NETWORK_UNKNOWN).eql(4);
		finish();
	});
	//TIMOB-7718
	it("listeningForHttpRequests", function(finish) {
		if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
			should(function() {
				socket = Titanium.Network.Socket.createTCP({
					host: Ti.Platform.address,
					port: 8080,
					listenQueueSize: 100
				});
				socket.listen();
			}).not.throw();
			finish();
		} else finish();
	});
});