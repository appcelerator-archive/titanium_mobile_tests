/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_tableview", function() {
	//TIMOB-11683 ,TIMOB-11523
	it("deleterow", function(finish) {
				this.timeout(1e4);
		var win = Ti.UI.createWindow();
		var table = Ti.UI.createTableView();
		win.add(table);
		var tableData = [];
		var r = Ti.UI.createTableViewRow({
			height: 80
		});
		tableData.push(r);
		table.setData(tableData);
		table.deleteRow(0);
		setTimeout(function() {
			should(table.data[0].rows.length).eql(0);
			finish();
		}, 4e3);
		win.open();
	});
	//TIMOB-4134
	this.rowHeight = function(testRun) {
		var win = Ti.UI.createWindow();
		var tableView = Ti.UI.createTableView({
			rowHeight: 65
		});
		tableView.addEventListener("postlayout", function() {
			should(tableView.getRowHeight()).eql(65);
			finish();
		});
		win.add(tableView);
		win.open();
	};
	//TIMOB-7612,TIMOB-9640 ,TIMOB-10477
	it("percentageHeight", function(finish) {
				this.timeout(5e3);
		var win1 = Titanium.UI.createWindow({
			height: 400,
			width: 200,
			layout: "vertical"
		});
		var tableView = Ti.UI.createTableView({
			height: "50%",
			width: "50%"
		});
		var rows = [];
		var row;
		for (var i = 0; 4 > i; i++) {
			row = Ti.UI.createTableViewRow();
			rows.push(row);
		}
		tableView.data = rows;
		tableView.addEventListener("postlayout", function() {
			should(tableView.getHeight()).eql("50%");
			should(tableView.getWidth()).eql("50%");
			finish();
		});
		win1.add(tableView);
		win1.open();
	});
	//TIMOB-8706
	it("scrollEventFalse", function(finish) {
				this.timeout(5e3);
		var win = Ti.UI.createWindow();
		var data = [];
		for (i = 0; 50 > i; i++) {
			var row = Ti.UI.createTableViewRow();
			data.push(row);
		}
		var autocomplete_table = Titanium.UI.createTableView({
			scrollable: true,
			top: 170,
			data: data
		});
		win.add(autocomplete_table);
		var scrollEvent = false;
		autocomplete_table.addEventListener("scroll", function() {
			scrollEvent = true;
		});
		setTimeout(function() {
			should(scrollEvent).be.false;
			finish();
		}, 2e3);
		win.open();
	});
	//TIMOB-4917
	it("appendRowSupportArrayOfRows", function(finish) {
				this.timeout(5e3);
		var win = Ti.UI.createWindow();
		var table = Ti.UI.createTableView();
		win.add(table);
		win.open();
		var currentRows = [];
		var b1 = Ti.UI.createButton({
			bottom: 10
		});
		setTimeout(function() {
			var rowdata = [];
			var label = Ti.UI.createLabel({
				left: 100,
				top: 10,
				bottom: 10
			});
			var r = Ti.UI.createTableViewRow({
				height: 80,
				color: "blue"
			});
			r.add(label);
			for (var i = 0; 2 > i; i++) rowdata.push(r);
			should(function() {
				table.appendRow(rowdata);
			}).not.throw();
			should(table.data[0].rows.length).eql(2);
			finish();
		}, 2e3);
	});
});