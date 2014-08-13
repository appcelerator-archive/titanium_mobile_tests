/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_tableViewRow", function() {
	//TIMOB-5089
	it("dpDimension", function(finish) {
		this.timeout(10000);
		var win = Ti.UI.createWindow();
		var table = Ti.UI.createTableView();
		for (var i = 0; 5 > i; i++) {
			var row = Ti.UI.createTableViewRow({
				height: "110dp"
			});
			var imageview = Ti.UI.createImageView({
				image: "/suites/ui_tableViewRow/ui_tableViewRow/gradient.png",
				height: "100dp",
				width: "100dp"
			});
			row.add(imageview);
			table.appendRow(row);
		}
		var closeEvent = 0;
		win.add(table);
		win.addEventListener("focus", function() {
			should(row.getHeight()).be.eql("110dp");
			should(imageview.getHeight()).be.eql("100dp");
			should(imageview.getWidth()).be.eql("100dp");
		});
		win.addEventListener("close", function() {
			closeEvent += 1;
		});
		setTimeout(function() {
			should(closeEvent).be.eql(0);
			finish();
		}, 2e3);
		win.open();
	});

	//TIMOB-6368
	it("setHeaderOutsideTable", function(finish) {
		this.timeout(10000);
		var win = Titanium.UI.createWindow();
		var table = Titanium.UI.createTableView({
			height: 100,
			width: 200
		});
		var addrow = function() {
			var row = Ti.UI.createTableViewRow({
				height: 65
			});
			row.header = "A";
			table.appendRow(row);
		};
		for (var i = 0; 200 > i; i++) addrow();
		win.add(table);
		table.addEventListener("postlayout", function() {
			should(table.getHeight()).be.eql(100);
			should(table.getWidth()).be.eql(200);
			finish();
		});
		win.open();
	});

	//TIMOB-9890
	it("updateNumberOfRows", function(finish) {
		var win1 = Titanium.UI.createWindow();
		var table = Ti.UI.createTableView({
			top: 0
		});
		win1.add(table);
		function fun() {
			addRows(5);
			assertRowCount(5);
			removeRows(1);
			assertRowCount(4);
			finish();
		}
		function assertRowCount(expectedCount) {
			var actualCount = 0;
			if (table.data[0].rows) actualCount = table.data[0].rows.length;
			should(actualCount).be.eql(expectedCount);
		}
		function removeRows(count) {
			if (table.data[0] && !(table.data[0].rows.rowCount < count)) {
				var tableData = table.data[0].rows;
				for (var i = 0; count > i; i++) tableData.pop();
				table.data = tableData;
			}
		}
		function addRows(count) {
			var tableData;
			if (table.data[0]) tableData = table.data[0].rows; else tableData = new Array();
			for (var i = 0; count > i; i++) {
				var row = Ti.UI.createTableViewRow();
				tableData.push(row);
			}
			table.data = tableData;
		}
		win1.addEventListener("focus", fun);
		win1.open();
	});

	//TIMOB-5982, TIMOB-8050
	it("accesTableViewRow", function(finish) {
		this.timeout(10000);
		var _window = Titanium.UI.createWindow();
		var myTableView = Ti.UI.createTableView();
		var row = Ti.UI.createTableViewRow({
			height: 80
		});
		myTableView.appendRow(row);
		_window.add(myTableView);
		_window.addEventListener("open", function() {
			setTimeout(function() {
				var tableRows = myTableView.data[0].rows;
				should(function() {
					tableRows.pop();
					myTableView.data = tableRows;
				}).not.be.throw();
				finish();
			}, 2e3);
		});
		_window.open();
	});
});