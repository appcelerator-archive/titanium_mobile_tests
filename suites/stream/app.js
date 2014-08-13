/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("stream", function() {
	it("before_all", function(finish) {
		// createBuffer should be tested by Ti.Buffer
		this.sourceBuffer = Ti.createBuffer({
			value: "All work and no play makes Jack a dull boy all work and no play makes Jack a dull boy all work and no play makes Jack a dull boy ALL WORK AND NO PLAY MAKES JACK A DULL BOY"
		});
		// create file to work with
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "streamfile.txt");
		if (file.exists()) file.deleteFile();
		file.write("This is my text1 This is my text2 This is my text3 This is my text4 This is my text5 This is my text6 This is my text7");
		file = null;
		this.sourceBlob = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "streamfile.txt").read();
		this.sourceBlobStr = this.sourceBlob.toString();
		this.streamFuncs = [ "read", "write", "isReadable", "isWritable" ];
		finish();
	});

	it("basicBufferStream", function(finish) {
		var rstream = null;
		var wstream = null;
		var astream = null;
		var sourceBuffer = this.sourceBuffer;
		// create read stream
		should(function() {
			rstream = Ti.Stream.createStream({
				source: sourceBuffer,
				mode: Ti.Stream.MODE_READ
			});
		}).not.throw();
		should(rstream).not.be.null;
		for (var i = 0; i < this.streamFuncs.length; i++) {
			var func = rstream[this.streamFuncs[i]];
			should(func).be.a.Function;
		}
		should(rstream.isReadable()).be.true;
		should(rstream.isWritable()).be.false;
		// create write stream
		should(function() {
			wstream = Ti.Stream.createStream({
				source: sourceBuffer,
				mode: Ti.Stream.MODE_WRITE
			});
		}).not.throw();
		should(wstream).not.be.null;
		for (var i = 0; i < this.streamFuncs.length; i++) {
			var func = wstream[this.streamFuncs[i]];
			should(func).be.a.Function;
		}
		should(wstream.isReadable()).be.false;
		should(wstream.isWritable()).be.true;
		// create append stream
		should(function() {
			astream = Ti.Stream.createStream({
				source: sourceBuffer,
				mode: Ti.Stream.MODE_APPEND
			});
		}).not.throw();
		should(astream).not.be.null;
		for (var i = 0; i < this.streamFuncs.length; i++) {
			var func = astream[this.streamFuncs[i]];
			should(func).be.a.Function;
		}
		should(astream.isReadable()).be.false;
		should(astream.isWritable()).be.true;
		var destBuffer = Ti.createBuffer({
			length: 30
		});
		var readBytes = rstream.read(destBuffer, 0, 20);
		should(readBytes).be.equal(20);
		for (var i = 0; readBytes > i; i++) should(sourceBuffer[i]).be.equal(destBuffer[i]);
		var writeBytes = wstream.write(destBuffer, 0, destBuffer.length);
		should(writeBytes).be.equal(destBuffer.length);
		for (var i = 0; writeBytes > i; i++) should(sourceBuffer[i]).be.equal(destBuffer[i]);
		var appendBuffer = Ti.createBuffer({
			value: "appendme"
		});
		var appendBytes = astream.write(appendBuffer, 0, appendBuffer.length);
		should(appendBytes).be.equal(appendBuffer.length);
		for (var i = 0; appendBytes > i; i++) should(sourceBuffer[sourceBuffer.length - appendBuffer.length + i]).be.equal(appendBuffer[i]);
		should(function() {
			astream.close();
		}).not.throw();
		finish();
	});

	it("basicBlobStream", function(finish) {
		var stream = null;
		var sourceBlob = this.sourceBlob;
		should(function() {
			stream = Ti.Stream.createStream({
				source: sourceBlob,
				mode: Ti.Stream.MODE_READ
			});
		}).not.throw();
		should(stream).not.be.null;
		for (var i = 0; i < this.streamFuncs.length; i++) {
			var func = stream[this.streamFuncs[i]];
			should(func).be.a.Function;
		}
		should(stream.isReadable()).be.true;
		should(stream.isWritable()).be.false;
		var destBuffer = Ti.createBuffer({
			length: 50
		});
		var readBytes = stream.read(destBuffer, 0, 20);
		should(readBytes).be.equal(20);
		var str = sourceBlob.toString();
		for (var i = 0; 20 > i; i++) should(str.charCodeAt(i)).be.equal(destBuffer[i]);
		// read again to ensure position on blob is maintained
		readBytes = stream.read(destBuffer, 20, 20);
		should(readBytes).be.equal(20);
		for (var i = 0; 20 > i; i++) should(str.charCodeAt(20 + i)).be.equal(destBuffer[20 + i]);
		should(function() {
			stream.close();
		}).not.throw();
		finish();
	});

	it("asyncRead", function(finish) {
		this.timeout(1e4);
		// This stuff has to be copied into each asynch test because it lives
		// in a different 'this' context
		var sourceBuffer = Ti.createBuffer({
			value: "All work and no play makes Jack a dull boy all work and no play makes Jack a dull boy all work and no play makes Jack a dull boy ALL WORK AND NO PLAY MAKES JACK A DULL BOY"
		});
		var sourceBlob = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "streamfile.txt").read();
		var sourceBlobStr = sourceBlob.toString();
		// read(source,dest,callback) on BufferStream
		var bufferStream = Ti.Stream.createStream({
			source: sourceBuffer,
			mode: Ti.Stream.MODE_READ
		});
		should(bufferStream).not.be.null;
		var dest = Ti.createBuffer({
			length: 50
		});
		should(dest).not.be.null;
		// Perform read(source,dest,callback)
		Ti.Stream.read(bufferStream, dest, function(e) {
			should(e.errorState).be.a.Number;
			should(e.errorDescription).be.a.String;
			should(e.bytesProcessed).be.equal(dest.length);
			for (var i = 0; i < dest.length; i++) should(dest[i]).be.equal(sourceBuffer[i]);
			finished = true;
		});
		var offset = 10;
		var length = 20;
		var blobStream = Ti.Stream.createStream({
			source: sourceBlob,
			mode: Ti.Stream.MODE_READ
		});
		should(blobStream).not.be.null;
		var blobStr = sourceBlob.toString();
		// Performing the second read while the first read is happening
		// mungs data that gets checked in the callback...
		// have to busywait until the FIRST async call is done.
		var timer = null;
		var callback = function(e) {
			should(e.errorState).be.a.Number;
			should(e.errorDescription).be.a.String;
			should(e.bytesProcessed).be.equal(length);
			for (var i = 0; length > i; i++) {
				should(dest[i + offset]).be.equal(blobStr.charCodeAt(i));
			}
			finish();
		};
		function spinWait() {
			if (!finished) timer = setTimeout(spinWait, 200); else Ti.Stream.read(blobStream, dest, offset, length, callback);
		}
		timer = setTimeout(spinWait, 200);
	});

	it("asyncWrite", function(finish) {
		this.timeout(1e4);
		// This stuff has to be copied into each asynch test because it lives
		// in a different 'this' context
		var sourceBuffer = Ti.createBuffer({
			value: "All work and no play makes Jack a dull boy all work and no play makes Jack a dull boy all work and no play makes Jack a dull boy ALL WORK AND NO PLAY MAKES JACK A DULL BOY"
		});
		var dest = Ti.createBuffer({
			length: sourceBuffer.length
		});
		should(dest).not.be.null;
		var bufferStream = Ti.Stream.createStream({
			source: dest,
			mode: Ti.Stream.MODE_WRITE
		});
		should(bufferStream).not.be.null;
		var offset = 10;
		var length = 20;
		// Need to perform offset/length write first so that the destination buffer doesn't fill
		Ti.Stream.write(bufferStream, sourceBuffer, offset, length, function(e) {
			should(e.errorState).be.a.Number;
			should(e.errorDescription).be.a.String;
			should(e.bytesProcessed).be.equal(length);
			for (var i = 0; length > i; i++) should(dest[i]).be.equal(sourceBuffer[i + offset]);
			finished = true;
		});
		// We can't have a 'this.async' inside of another callback, so we
		// have to busywait until the FIRST async call is done.
		var timer = null;
		var callback = function(e) {
			should(e.errorState).be.a.Number;
			should(e.errorDescription).be.a.String;
			should(e.bytesProcessed).be.equal(sourceBuffer.length);
			for (var i = 0; i < dest.length - length; i++) should(dest[i + length]).be.equal(sourceBuffer[i]);
			finish();
		};
		function spinWait() {
			if (!finished) timer = setTimeout(spinWait, 200); else Ti.Stream.write(bufferStream, sourceBuffer, callback);
		}
		timer = setTimeout(spinWait, 200);
	});

	it("readAll", function(finish) {
		this.timeout(1e4);
		// This stuff has to be copied into each asynch test because it lives
		// in a different 'this' context
		var sourceBuffer = Ti.createBuffer({
			value: "All work and no play makes Jack a dull boy all work and no play makes Jack a dull boy all work and no play makes Jack a dull boy ALL WORK AND NO PLAY MAKES JACK A DULL BOY"
		});
		var sourceBlob = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "streamfile.txt").read();
		var sourceBlobStr = sourceBlob.toString();
		var bufferStream = Ti.Stream.createStream({
			source: sourceBuffer,
			mode: Ti.Stream.MODE_READ
		});
		should(bufferStream).not.be.null;
		var buffer;
		function assignBuffer() {
			buffer = Ti.Stream.readAll(bufferStream);
		}
		should(assignBuffer).not.throw();
		should(buffer).not.be.null;
		should(buffer.length).be.equal(sourceBuffer.length);
		for (var i = 0; i < buffer.length; i++) should(buffer[i]).be.equal(sourceBuffer[i]);
		var blobStream = Ti.Stream.createStream({
			source: sourceBlob,
			mode: Ti.Stream.MODE_READ
		});
		should(blobStream).not.be.null;
		// TODO: Should we be required to create this buffer, or should it be autocreated?
		var dest = Ti.createBuffer({
			length: sourceBlobStr.length
		});
		should(dest).not.be.null;
		Ti.Stream.readAll(blobStream, dest, function(e) {
			should(e.errorState).be.a.Number;
			should(e.errorDescription).be.a.String;
			should(e.bytesProcessed).be.equal(sourceBlobStr.length);
			for (var i = 0; i < dest.length; i++) should(dest[i]).be.equal(sourceBlobStr.charCodeAt(i));
			finish();
		});
	});

	it("writeStream", function(finish) {
		this.timeout(1e4);
		// This stuff has to be copied into each asynch test because it lives
		// in a different 'this' context
		var sourceBuffer = Ti.createBuffer({
			value: "All work and no play makes Jack a dull boy all work and no play makes Jack a dull boy all work and no play makes Jack a dull boy ALL WORK AND NO PLAY MAKES JACK A DULL BOY"
		});
		var sourceBlob = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "streamfile.txt").read();
		var sourceBlobStr = sourceBlob.toString();
		var dest = Ti.createBuffer({
			length: 100
		});
		var destStream = Ti.Stream.createStream({
			source: dest,
			mode: Ti.Stream.MODE_WRITE
		});
		should(destStream).not.be.null;
		var blobStream = Ti.Stream.createStream({
			source: sourceBlob,
			mode: Ti.Stream.MODE_READ
		});
		should(blobStream).not.be.null;
		Ti.Stream.writeStream(blobStream, destStream, 10);
		for (var i = 0; i < dest.length; i++) should(dest[i]).be.equal(sourceBlobStr.charCodeAt(i));
		var destStream2 = Ti.Stream.createStream({
			source: dest,
			mode: Ti.Stream.MODE_WRITE
		});
		should(destStream2).not.be.null;
		var bufferStream = Ti.Stream.createStream({
			source: sourceBuffer,
			mode: Ti.Stream.MODE_READ
		});
		should(bufferStream).not.be.null;
		Ti.Stream.writeStream(bufferStream, destStream2, 20, function(e) {
			should(e.errorState).be.a.Number;
			should(e.errorDescription).be.a.String;
			should(e.bytesProcessed).be.equal(dest.length);
			for (var i = 0; i < dest.length; i++) should(sourceBuffer[i]).be.equal(dest[i]);
			finish();
		});
	});

	it("pump", function(finish) {
		this.timeout(10000);
		// This stuff has to be copied into each asynch test because it lives
		// in a different 'this' context
		var sourceBuffer = Ti.createBuffer({
			value: "All work and no play makes Jack a dull boy all work and no play makes Jack a dull boy all work and no play makes Jack a dull boy ALL WORK AND NO PLAY MAKES JACK A DULL BOY"
		});
		var sourceBlob = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "streamfile.txt").read();
		var sourceBlobStr = sourceBlob.toString();
		var chunksize = 20;
		var totalsize = 0;
		var sourceValue = null;

		// Used as a function for handling comparison
		var numOfPass = 0;
		function handler(e) {
			should(e.errorState).be.a.Number;
			should(e.errorDescription).be.a.String;
			should(e.bytesProcessed).be.within(0, chunksize);
			should(e.buffer).not.be.null;
			for (var i = 0; i < e.buffer.length; i++) {
				should(e.buffer[i]).be.equal(sourceValue(i, totalsize));
			}
			if (e.bytesProcessed != -1) {
				totalsize += e.bytesProcessed;
			}
			should(totalsize).be.equal(e.totalBytesProcessed);
			numOfPass += 1;
			if (2 == numOfPass) {
				finish();
			}
		}
		sourceValue = function(pos, totalsize) {
			return sourceBuffer[totalsize + pos];
		};

		var bufferStream = Ti.Stream.createStream({
			source: sourceBuffer,
			mode: Ti.Stream.MODE_READ
		});
		should(bufferStream).not.be.null;

		// Synch pump
		Ti.Stream.pump(bufferStream, handler, chunksize);
		sourceValue = function(pos, totalsize) {
			return sourceBlobStr.charCodeAt(pos + totalsize);
		};
		var blobStream = Ti.Stream.createStream({
			source: sourceBlob,
			mode: Ti.Stream.MODE_READ
		});
		should(blobStream).not.be.null;
		// Asynch pump
		totalsize = 0;
		Ti.Stream.pump(blobStream, handler, chunksize, true);
	});
});