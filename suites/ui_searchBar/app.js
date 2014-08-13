/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_searchBar", function() {
	//TIMOB-9745,TIMOB-7020
	it("ui_searchBar", function(finish) {
		var win = Ti.UI.createWindow();
		var data = [ {
			title: "Row 1",
			color: "red"
		}, {
			title: "Row 2",
			color: "green"
		} ];
		var sb = Titanium.UI.createSearchBar({
			barColor: "blue",
			showCancel: false,
			height: 44
		});
		var table = Ti.UI.createTableView({
			height: 600,
			width: "100%",
			search: sb,
			top: 75,
			left: 0,
			data: data
		});
		win.addEventListener("open", function() {
			should(function() {
				win.add(table);
			}).not.throw();
			should(function() {
				win.remove(table);
			}).not.throw();
			should(function() {
				win.add(table);
			}).not.throw();
			should(sb.getHeight()).eql(44);
			should(sb.getShowCancel()).be.false;
			should(sb.getBarColor()).eql("blue");
			finish();
		});
		win.open();
	});
	//TIMOB-3223
	it("showBookmark", function(finish) {
		var window = Titanium.UI.createWindow();
		var searchBar = Titanium.UI.createSearchBar({
			height: 44,
			showBookmark: true
		});
		window.addEventListener("focus", function() {
			if (Ti.UI.iOS) {
				should(searchBar.getHeight()).eql(44);
				should(searchBar.getShowBookmark()).be.true;
			}
			finish();
		});
		window.add(searchBar);
		window.open();
	});
});