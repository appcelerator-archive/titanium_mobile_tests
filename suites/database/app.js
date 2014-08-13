/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("database", function() {
	it("testModuleMethodsAndConstants", function(finish) {
		should(Ti.Database).not.be.null;
		should(Ti.Database).be.an.Object;
		should(Ti.Database.open).be.a.Function;
		should(Ti.Database.install).be.a.Function;
		should(Ti.Database.FIELD_TYPE_STRING).not.be.null;
		should(Ti.Database.FIELD_TYPE_INT).not.be.null;
		should(Ti.Database.FIELD_TYPE_FLOAT).not.be.null;
		should(Ti.Database.FIELD_TYPE_DOUBLE).not.be.null;
		finish();
	});
	it("testDatabaseMethods", function(finish) {
		var db = Ti.Database.open("Test");
		try {
			should(db).not.be.null;
			should(db).be.an.Object;
			should(db.close).be.a.Function;
			should(db.execute).be.a.Function;
			should(db.getLastInsertRowId).be.a.Function;
			should(db.getName).be.a.Function;
			should(db.getRowsAffected).be.a.Function;
			should(db.remove).be.a.Function;
			// Properties
			should(db.lastInsertRowId).be.a.Number;
			should(db.name).be.a.String;
			should(db.name).eql("Test");
			should(db.rowsAffected).be.a.Number;
		} finally {
			db.close();
		}
		finish();
	});
	// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2147-android-pragma-and-non-select-statements-return-null-from-tidatabasedbexecute-instead-of-resultset
	it("testDatabaseLH2147", function(finish) {
		var db = Ti.Database.open("Test");
		try {
			should(db).not.be.null;
			var rs = db.execute("drop table if exists Test");
			should(rs).be.null;
			rs = db.execute("create table if not exists Test(row text)");
			should(rs).be.null;
			rs = db.execute("pragma table_info(Test)");
			should(rs).not.be.null;
			should(rs.fieldCount).be.greaterThan(0);
			rs.close();
			rs = db.execute("select * from Test");
			should(rs).not.be.null;
			should(rs.getFieldCount()).eql(1);
			should(rs.rowCount).eql(0);
			rs.close();
		} finally {
			db.close();
			db.remove();
		}
		var f = Ti.Filesystem.getFile("file:///data/data/org.appcelerator.titanium.testharness/databases/Test");
		should(f.exists()).be.false;
		finish();
	});
	it("testDatabaseInsert", function(finish) {
		var db = Ti.Database.open("Test");
		try {
			should(db).not.be.null;
			var rs = db.execute("drop table if exists Test");
			should(rs).be.null;
			rs = db.execute("create table if not exists Test(row text)");
			should(rs).be.null;
			db.execute("insert into Test(row) values(?)", "My TestRow");
			rs = db.execute("select * from Test");
			should(rs).not.be.null;
			should(rs.isValidRow()).eql(true);
			should(rs.getFieldCount()).eql(1);
			should(rs.rowCount).eql(1);
			should(rs.getField(0)).eql("My TestRow");
			rs.close();
		} finally {
			db.close();
			db.remove();
		}
		var f = Ti.Filesystem.getFile("file:///data/data/org.appcelerator.titanium.testharness/databases/Test");
		should(f.exists()).be.false;
		finish();
	});
	it("testDatabaseCount", function(finish) {
		var testRowCount = 100;
		var db = Ti.Database.open("Test");
		try {
			should(db).not.be.null;
			var rs = db.execute("drop table if exists data");
			should(rs).be.null;
			db.execute("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, val TEXT)");
			for (var i = 1; testRowCount >= i; i++) db.execute("INSERT INTO data (val) VALUES(?)", "our value:" + i);
			rs = db.execute("SELECT * FROM data");
			var rowCount = rs.rowCount;
			var realCount = 0;
			for (;rs.isValidRow(); ) {
				realCount += 1;
				rs.next();
			}
			rs.close();
			should(realCount).eql(testRowCount);
			should(rowCount).eql(testRowCount);
			should(rowCount).eql(realCount);
		} finally {
			db.close();
			db.remove();
		}
		finish();
	});
	it("testDatabaseRollback", function(finish) {
		var db = Ti.Database.open("Test");
		var testRowCount = 30;
		try {
			should(db).not.be.null;
			var rs = db.execute("drop table if exists data");
			should(rs).be.null;
			db.execute("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, val TEXT)");
			db.execute("BEGIN TRANSACTION");
			for (var i = 1; testRowCount >= i; i++) db.execute("INSERT INTO data (val) VALUES(?)", "our value:" + i);
			rs = db.execute("SELECT * FROM data");
			should(rs.rowCount).eql(testRowCount);
			rs.close();
			db.execute("ROLLBACK TRANSACTION");
			rs = db.execute("SELECT * FROM data");
			should(rs.rowCount).eql(0);
			rs.close();
			db.execute("drop table if exists data");
		} finally {
			db.close();
			db.remove();
		}
		finish();
	});
	it("testDatabaseSavepointRollback", function(finish) {
		var db = Ti.Database.open("Test");
		var testRowCount = 30;
		try {
			should(db).not.be.null;
			var rs = db.execute("drop table if exists data");
			should(rs).be.null;
			// Devices with Android API Levels before 8 don't support savepoints causing
			// a false failure on those devices. Try and detect and only do
			// this complex test if savepoints work.
			var savepointSupported = true;
			try {
				db.execute("SAVEPOINT test");
				db.execute("RELEASE SAVEPOINT test");
				// Android 4.1 introduced a bug with savepoint rollbacks:
				// http://code.google.com/p/android/issues/detail?id=38706
				if ("android" == Ti.Platform.osname && Ti.Platform.Android.API_LEVEL >= 16) savepointSupported = false;
			} catch (E) {
				savepointSupported = false;
			}
			if (savepointSupported) {
				db.execute("BEGIN DEFERRED TRANSACTION");
				db.execute("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, val TEXT)");
				db.execute("SAVEPOINT FOO");
				for (var i = 1; testRowCount >= i; i++) db.execute("INSERT INTO data (val) VALUES(?)", "our value:" + i);
				db.execute("ROLLBACK TRANSACTION TO SAVEPOINT FOO");
				db.execute("COMMIT TRANSACTION");
				rs = db.execute("SELECT * FROM data");
				should(rs.rowCount).eql(0);
				rs.close();
				db.execute("BEGIN TRANSACTION");
				db.execute("drop table if exists data");
				db.execute("ROLLBACK TRANSACTION");
				rs = db.execute("SELECT * FROM data");
				should(rs).not.be.null;
				rs.close();
			}
		} finally {
			db.close();
			db.remove();
		}
		finish();
	});
	// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2917-api-doc-dbexecute
	it("testDatabaseLH2917", function(finish) {
		var db = Titanium.Database.open("Test"), rowCount = 10, resultSet, i, counter;
		should(db).be.an.Object;
		should(resultSet).be.type("undefined");
		should(i).be.type("undefined");
		should(counter).be.type("undefined");
		try {
			db.execute("CREATE TABLE IF NOT EXISTS stuff (id INTEGER, val TEXT)");
			db.execute("DELETE FROM stuff");
			//clear table of all existing data
			//test that the execute method works with and without an array as the second argument
			for (i = 1; rowCount / 2 >= i; ++i) db.execute("INSERT INTO stuff (id, val) VALUES(?, ?)", i, "our value" + i);
			for (;rowCount >= i; ) {
				db.execute("INSERT INTO stuff (id, val) VALUES(?, ?)", [ i, "our value" + i ]);
				++i;
			}
			resultSet = db.execute("SELECT * FROM stuff");
			should(resultSet).not.be.null;
			should(resultSet).be.an.Object;
			should(resultSet.rowCount).eql(rowCount);
			counter = 1;
			for (;resultSet.isValidRow(); ) {
				should(resultSet.fieldByName("id")).eql(counter);
				should(resultSet.fieldByName("val")).eql("our value" + counter);
				++counter;
				resultSet.next();
			}
			resultSet.close();
		} catch (e) {
			Titanium.API.debug("error occurred: " + e);
		} finally {
			db.close();
			db.remove();
		}
		finish();
	});
	//https://appcelerator.lighthouseapp.com/projects/32238/tickets/3393-db-get-api-extended-to-support-typed-return-value
	it("testTypedGettersAndSetters", function(finish) {
		var db = Ti.Database.open("Test"), rowCount = 10, resultSet = null, i, counter, current_float, float_factor = .5555;
		var isAndroid = "android" === Ti.Platform.osname;
		should(db).be.an.Object;
		try {
			counter = 1;
			i = 1;
			db.execute("CREATE TABLE IF NOT EXISTS stuff (id INTEGER, f REAL, val TEXT)");
			db.execute("DELETE FROM stuff;");
			//clear table of all existing data
			var insert_float;
			for (;rowCount >= i; ) {
				insert_float = float_factor * i;
				db.execute("INSERT INTO stuff (id, f, val) VALUES(?, ?, ?)", [ i, insert_float, "our value" + i ]);
				++i;
			}
			resultSet = db.execute("SELECT * FROM stuff");
			should(resultSet).not.be.null;
			should(resultSet).be.an.Object;
			should(resultSet.rowCount).eql(rowCount);
			for (;resultSet.isValidRow(); ) {
				current_float = counter * float_factor;
				should(resultSet.fieldByName("id", Ti.Database.FIELD_TYPE_INT)).eql(resultSet.field(0, Ti.Database.FIELD_TYPE_INT));
				should(resultSet.fieldByName("id", Ti.Database.FIELD_TYPE_INT)).eql(counter);
				should(resultSet.fieldByName("id", Ti.Database.FIELD_TYPE_INT)).eql(counter);
				should(resultSet.fieldByName("id", Ti.Database.FIELD_TYPE_INT)).eql(counter);
				should(resultSet.fieldByName("f", Ti.Database.FIELD_TYPE_INT)).eql(resultSet.field(1, Ti.Database.FIELD_TYPE_INT));
				should(resultSet.fieldByName("f", Ti.Database.FIELD_TYPE_INT)).eql(parseInt(counter * float_factor));
				var f_val = resultSet.fieldByName("f", Ti.Database.FIELD_TYPE_FLOAT);
				should(Math.floor(Math.round(1e4 * f_val)) / 1e4).eql(current_float);
				should(resultSet.fieldByName("f", Ti.Database.FIELD_TYPE_DOUBLE)).eql(current_float);
				should(resultSet.fieldByName("val", Ti.Database.FIELD_TYPE_STRING)).eql("our value" + counter);
				should(resultSet.fieldByName("id", Ti.Database.FIELD_TYPE_STRING)).eql(counter.toString());
				should(resultSet.fieldByName("f", Ti.Database.FIELD_TYPE_STRING)).eql(current_float.toString());
				// WARNING: On iOS, the following functions throw an uncaught exception -
				should(function() {
					resultSet.fieldByName("val", Ti.Database.FIELD_TYPE_INT);
				}).throw();
				should(function() {
					resultSet.fieldByName("val", Ti.Database.FIELD_TYPE_DOUBLE);
				}).throw();
				should(function() {
					resultSet.fieldByName("val", Ti.Database.FIELD_TYPE_FLOAT);
				}).throw();
				should(function() {
					resultSet.field(2, Ti.Database.FIELD_TYPE_DOUBLE);
				}).throw();
				should(function() {
					resultSet.field(2, Ti.Database.FIELD_TYPE_FLOAT);
				}).throw();
				should(function() {
					resultSet.field(2, Ti.Database.FIELD_TYPE_INT);
				}).throw();
				++counter;
				resultSet.next();
			}
		} finally {
			if (null != db) db.close();
			if (null != resultSet) resultSet.close();
		}
		finish();
	});
	it("testDatabaseExceptions", function(finish) {
		var isAndroid = "android" === Ti.Platform.osname;
		should(function() {
			Ti.Database.open("fred://\\");
		}).throw();
		var db = null;
		try {
			db = Titanium.Database.open("Test");
			should(function() {
				Ti.Database.execute("select * from notATable");
			}).throw();
			db.execute("CREATE TABLE IF NOT EXISTS stuff (id INTEGER, val TEXT)");
			db.execute('INSERT INTO stuff (id, val) values (1, "One")');
			should(function() {
				db.execute("SELECT * FROM idontexist");
			}).throw();
			var rs = db.execute("SELECT id FROM stuff WHERE id = 1");
			should(function() {
				rs.field(2);
			}).throw();
			should(function() {
				rs.field(2);
			}).throw();
			should(function() {
				rs.fieldName(2);
			}).throw();
			if (null != rs) rs.close();
		} finally {
			if (null != db) {
				db.close();
				db.remove();
			}
		}
		finish();
	});
	it("testDatabaseResultsetDotNext", function(finish) {
		var db = Ti.Database.open("mydb");
		db.execute("DROP TABLE IF EXISTS welcome");
		db.execute("CREATE TABLE IF NOT EXISTS welcome (title TEXT)");
		db.execute("INSERT INTO welcome (title) VALUES (?)", "one");
		db.execute("INSERT INTO welcome (title) VALUES (?)", "two");
		var rows = db.execute("SELECT title FROM welcome");
		should(rows.getRowCount()).eql(2);
		should(rows.next()).be.true;
		should(rows.next()).be.false;
		rows.close();
		db.close();
		finish();
	});
	//KitchenSink: Platform
	it("DBIn2ndContext", function(finish) {
		var db = Titanium.Database.open("mydb");
		db.execute("CREATE TABLE IF NOT EXISTS DATABASETEST  (ID INTEGER, NAME TEXT)");
		db.execute("INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)", 5, "Name 5");
		db.execute("INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)", 6, "Name 6");
		db.execute("INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)", 7, "Name 7");
		db.execute("INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)", 8, "Name 8");
		should(db.rowsAffected).eql(1);
		var lastRow = db.lastInsertRowId;
		var rows = db.execute("SELECT * FROM DATABASETEST");
		for (i = 0; lastRow - 4 > i; i++) rows.next();
		should(rows.field(0)).eql(5);
		should(rows.fieldByName("name")).eql("Name 5");
		rows.next();
		should(rows.field(0)).eql(6);
		should(rows.fieldByName("name")).eql("Name 6");
		rows.next();
		should(rows.field(0)).eql(7);
		should(rows.fieldByName("name")).eql("Name 7");
		rows.next();
		should(rows.field(0)).eql(8);
		should(rows.fieldByName("name")).eql("Name 8");
		rows.close();
		db.close();
		finish();
	});
	//KitchenSink: Platform
	it("prePackagedDB", function(finish) {
		var db = Titanium.Database.install("/testdb.db", "quotes");
		var rows = db.execute("SELECT * FROM TIPS");
		db.execute('UPDATE TIPS SET TITLE="UPDATED TITLE" WHERE TITLE = "FOO"');
		db.execute('INSERT INTO TIPS VALUES("FOO", "BAR")');
		should(rows.field(1)).eql("A team will always appreciate a great individual if he's willing to sacrifice for the group.");
		should(rows.field(0)).eql("Kareem Abdul-Jabbar");
		should(rows.fieldName(0)).eql("title");
		should(rows.fieldName(1)).eql("tip");
		finish();
	});
});