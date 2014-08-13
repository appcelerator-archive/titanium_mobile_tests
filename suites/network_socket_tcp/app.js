/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("network_socket_tcp", function() {
	it("testAPI", function(finish) {
		var socket = Ti.Network.Socket.createTCP();
		should(socket).be.an.Object;
		var functions = [ "connect", "listen", "accept", "close" ];
		for (var i = 0; i < functions.length; i++) {
			should(socket[functions[i]]).be.a.Function;
		}
		finish();
	});

	it("testConnectAccept", function(finish) {
		this.timeout(1e4);
		var listener = Ti.Network.Socket.createTCP({
			host: "localhost",
			port: 40505
		});
		var acceptPassed = false;
		var connectPassed = false;

		listener.accepted = function(e) {
			should(e.socket).be.an.Object;
			should(e.socket.state).eql(Ti.Network.Socket.LISTENING);
			should(e.inbound).be.an.Object;
			should(e.inbound.state).eql(Ti.Network.Socket.CONNECTED);
			should(e.inbound.error).be.a.Function;
			should(function() {
				e.inbound.close();
			}).not.throw();
			should(function() {
				e.socket.close();
			}).not.throw();
			acceptPassed = true;
			if (connectPassed) finish();
		};

		var connector = Ti.Network.Socket.createTCP({
			host: "localhost",
			port: 40505
		});
		connector.connected = function(e) {
			should(e.socket).be.an.Object;
			should(e.socket.state).eql(Ti.Network.Socket.CONNECTED);
			should(function() {
				e.socket.close();
			}).not.throw();
			connectPassed = true;
			if (acceptPassed) finish();
		};

		var x = function(e) {};

		should(function() {
			listener.listen();
		}).not.throw();

		should(function() {
			listener.accept({
				error: x
			});
		}).not.throw();

		should(function() {
			connector.connect();
		}).not.throw();
	});

	it("testSocketIO", function(finish) {
		this.timeout(1e4);
		var sourceBuffer = Ti.createBuffer({
				data: "ALL WORK AND NO PLAY MAKES JACK A DULL BOY ALL WORK AND NO PLAY MAKES JACK A DULL BOY ALL WORK AND NO PLAY MAKES JACK A DULL BOY"
			}),
			readBuffer = Ti.createBuffer({
				length: sourceBuffer.length
			}),
			listener = Ti.Network.Socket.createTCP({
				host: "localhost",
				port: 40506
			});

		listener.accepted = function(e) {
			Ti.Stream.write(e.inbound, sourceBuffer, function(e) {
				should(e.errorState).be.equal(0);
				should(e.errorDescription).eql("");
				should(e.bytesProcessed).eql(sourceBuffer.length);

				Ti.Stream.read(connector, readBuffer, function(e) {
					should(e.errorState).equal(0);
					should(e.errorDescription).eql("");
					should(e.bytesProcessed).eql(sourceBuffer.length);
					should(e.bytesProcessed).eql(readBuffer.length);

					for (var i = 0; i < readBuffer.length; i++) {
						should(sourceBuffer[i]).eql(readBuffer[i]);
					}

					should(function() {
						listener.close();
					}).not.throw();

					should(function() {
						connector.close();
					}).not.throw();

					finish();
				});
			});
		};

		var connector = Ti.Network.Socket.createTCP({
			host: "localhost",
			port: 40506
		});

		should(function() {
			listener.listen();
		}).not.throw();
		should(function() {
			listener.accept({});
		}).not.throw();
		should(function() {
			connector.connect();
		}).not.throw();
	});
});