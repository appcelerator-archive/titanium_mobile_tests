/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("commonjs", function() {
	// commonjs test ports - see the commonjs 1.0 test repository
	//	https://github.com/commonjs/commonjs/tree/master/tests/modules/1.0
	//
	// Note that even running these tests depends on certain parts of them passing!
	// If all of these tests fail, as a consequence, there is something seriously
	// wrong with commonjs loading.
	it("test_absolute", function(finish) {
		var test = require("./absolute/program");
		test.run();
		finish();
	});
	it("test_cyclic", function(finish) {
		var test = require("./cyclic/program");
		test.run();
		finish();
	});
	it("test_determinism", function(finish) {
		var test = require("./determinism/program");
		test.run();
		finish();
	});
	it("test_exactExports", function(finish) {
		var test = require("./exactExports/program");
		test.run();
		finish();
	});
	it("test_hasOwnProperty", function(finish) {
		var test = require("./hasOwnProperty/program");
		test.run();
		finish();
	});
	it("test_method", function(finish) {
		var test = require("./method/program");
		test.run();
		finish();
	});
	it("test_missing", function(finish) {
		var test = require("./missing/program");
		test.run();
		finish();
	});
	it("test_monkeys", function(finish) {
		var test = require("./monkeys/program");
		test.run();
		finish();
	});
	it("test_nested", function(finish) {
		var test = require("./nested/program");
		test.run();
		finish();
	});
	it("test_relative", function(finish) {
		var test = require("./relative/program");
		test.run();
		finish();
	});
	it("test_transitive", function(finish) {
		var test = require("./transitive/program");
		test.run();
		finish();
	});
	//TIMOB-12115
	it("test_name_utils", function(finish) {
		should(require("utils").foo()).be.true;
		finish();
	});
});