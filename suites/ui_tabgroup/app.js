/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_tabgroup", function() {
	//TIMOB-12134
	it("tabgroup", function(finish) {
		this.timeout(1e4);
		var mywin = Titanium.UI.createWindow({
			backgroundColor: "white",
			borderWidth: 0
		});
		var tabGroup = Ti.UI.createTabGroup();
		var tab = Titanium.UI.createTab({
			window: mywin
		});
		tabGroup.addTab(tab);
		mywin.addEventListener("focus", function() {
			finish();
		});
		tabGroup.open();
	});

	//TIMOB-6144
	it("changeTitle", function(finish) {
		this.timeout(1e4);
		var win1 = Ti.UI.createWindow();
		var tab1 = Ti.UI.createTab({
			title: "PRODUCTS",
			window: win1
		});
		should(tab1.getTitle()).be.eql("PRODUCTS");
		win1.addEventListener("focus", function(e) {
			tab1.title = "changeTitle";
			setTimeout(function() {
				should(tab1.getTitle()).be.eql("changeTitle");
				finish();
			}, 3e3);
		});
		var tabGroup = Ti.UI.createTabGroup();
		tabGroup.addTab(tab1);
		tabGroup.open();
	});

	//TIMOB-9444
	it("getActiveTab", function(finish) {
		this.timeout(1e4);
		var tabGroup = Ti.UI.createTabGroup();
		var win1 = Ti.UI.createWindow({
			title: "Win 1",
			layout: "vertical"
		});
		var tab1 = Ti.UI.createTab({
			window: win1
		});
		var win2 = Ti.UI.createWindow({
			title: "Win 2"
		});
		tabGroup.addTab(tab1);
		tabGroup.open();
		setTimeout(function() {
			tabGroup.getActiveTab().open(win2);
			tabGroup.close(win2);
			var t = tabGroup.getActiveTab().getWindow().title;
			should(t).be.eql("Win 1");
			finish();
		}, 3e3);
	});

	//TIMOB-9436, TIMOB-8910, TIMOB-7926, TIMOB-3139
	it("tabGroupEvents", function(finish) {
		this.timeout(10000);
		var tabGroup = Ti.UI.createTabGroup();
		var win1 = Ti.UI.createWindow();
		var tab1 = Ti.UI.createTab({
			window: win1
		});
		var win2 = Ti.UI.createWindow();
		var tab2 = Ti.UI.createTab({
			window: win2
		});
		tabGroup.addTab(tab1);
		tabGroup.addTab(tab2);
		var tabfocus = 0;
		var tab1focus = 0;
		var tab2focus = 0;
		var win1focus = 0;
		var win2focus = 0;
		var tab1blur = 0;
		var tab2blur = 0;
		var win1blur = 0;
		var win2blur = 0;
		tabGroup.addEventListener("focus", function() {
			tabfocus += 1;
		});
		tab1.addEventListener("focus", function() {
			tab1focus += 1;
		});
		tab2.addEventListener("focus", function() {
			tab2focus += 1;
		});
		win1.addEventListener("focus", function() {
			win1focus += 1;
		});
		win2.addEventListener("focus", function() {
			win2focus += 1;
		});
		tab1.addEventListener("blur", function() {
			tab1blur += 1;
		});
		tab2.addEventListener("blur", function() {
			tab2blur += 1;
		});
		win1.addEventListener("blur", function() {
			win1blur += 1;
		});
		win2.addEventListener("blur", function(e) {
			win2blur += 1;
		});
		setTimeout(function() {
			tabGroup.setActiveTab(tab2);
			tabGroup.setActiveTab(tab1);
			setTimeout(function() {
				should(tab1focus).be.eql(2);
				should(win1focus).be.eql(2);
				should(win2focus).be.eql(1);
				should(tab1blur).be.eql(1);
				should(tab2focus).be.eql(1);
				should(tab2blur).be.eql(1);
				should(win1blur).be.eql(1);
				should(win2blur).be.eql(1);
				finish();
			}, 3000);
		}, 2000);
		tabGroup.open();
	});

	//TIMOB-10946
	it("tabGroupFocus", function(finish) {
		var win1 = Ti.UI.createWindow();
		var tab1 = Ti.UI.createTab({
			window: win1
		});
		var win2 = Ti.UI.createWindow();
		var tab2 = Ti.UI.createTab({
			window: win2
		});
		var tabGroup = Ti.UI.createTabGroup();
		var tabgroupFocus = 0;
		tabGroup.addTab(tab1);
		tabGroup.addTab(tab2);
		tabGroup.setActiveTab(tab1);
		setTimeout(function() {
			tabGroup.setActiveTab(tab2);
		}, 1e3);
		tabGroup.addEventListener("focus", function() {
			tabgroupFocus += 1;
			if (2 == tabgroupFocus) {
				finish();
			}
		});
		tabGroup.open();
	});

	//TIMOB-10916
	it("activeTab", function(finish) {
		this.timeout(10000);
		var win1 = Ti.UI.createWindow();
		var tab1 = Ti.UI.createTab({
			window: win1
		});
		var win2 = Ti.UI.createWindow();
		var tab2 = Ti.UI.createTab({
			window: win2
		});
		var tabGroup = Ti.UI.createTabGroup();
		tabGroup.addTab(tab1);
		tabGroup.addTab(tab2);
		tabGroup.open();
		setTimeout(function() {
			should(tabGroup.activeTab).be.Object;
			finish();
		}, 2000);
	});

	//TIMOB-8048
	it("removeEventListener", function(finish) {
		this.timeout(10000);
		var tabGroup = Ti.UI.createTabGroup();
		var win1 = Ti.UI.createWindow();
		var tab1 = Ti.UI.createTab({
			window: win1
		});
		var win2 = Ti.UI.createWindow();
		var tab2 = Ti.UI.createTab({
			window: win2
		});
		tabGroup.addTab(tab1);
		tabGroup.addTab(tab2);
		var focusEvent = 0;
		var onFocus = function() {
			focusEvent += 1;
		};
		win1.addEventListener("focus", onFocus);
		setTimeout(function() {
			win1.removeEventListener("focus", onFocus);
			tabGroup.setActiveTab(tab2);
			tabGroup.setActiveTab(tab1);
			setTimeout(function() {
				should(focusEvent).be.eql(1);
				finish();
			}, 3000);
		}, 1000);
		tabGroup.open();
	});

	//TIMOB-9811
	it("source_Name", function(finish) {
		this.timeout(10000);
		var tabGroup = Ti.UI.createTabGroup({
			name: "tabgroup"
		});
		var win1 = Ti.UI.createWindow({
			name: "win 1"
		});
		var tab1 = Ti.UI.createTab({
			name: "Tab 1",
			window: win1
		});
		var win2 = Ti.UI.createWindow({
			name: "win 2"
		});
		var tab2 = Ti.UI.createTab({
			name: "Tab 2",
			window: win2
		});
		tabGroup.addTab(tab1);
		tabGroup.addTab(tab2);
		var source_name2;
		var source_name3;
		var source_name4;
		var source_name5;
		var source_name6;
		var source_name7;
		tab1.addEventListener("focus", function(e) {
			source_name2 = e.source.name;
		});
		win1.addEventListener("focus", function(e) {
			source_name3 = e.source.name;
		});
		tab2.addEventListener("focus", function(e) {
			source_name4 = e.source.name;
		});
		win2.addEventListener("focus", function(e) {
			source_name5 = e.source.name;
		});
		tab1.addEventListener("blur", function(e) {
			source_name6 = e.source.name;
		});
		win1.addEventListener("blur", function(e) {
			source_name7 = e.source.name;
		});
		setTimeout(function() {
			tabGroup.setActiveTab(tab2);
			setTimeout(function() {
				should(source_name2).be.eql("Tab 1");
				should(source_name3).be.eql("win 1");
				should(source_name4).be.eql("Tab 2");
				should(source_name5).be.eql("win 2");
				should(source_name6).be.eql("Tab 1");
				should(source_name7).be.eql("win 1");
				finish();
			}, 2000);
		}, 3000);
		tabGroup.open();
	});

	//TIMOB-7573, TIMOB-7572
	it("openingAndClosingNewTab", function(finish) {
		this.timeout(10000);
		var win = Ti.UI.createWindow({
			fullscreen: false,
			exitOnClose: true
		});
		var tabGroup = Ti.UI.createTabGroup();
		var tabWin = Ti.UI.createWindow();
		var tab = Ti.UI.createTab({
			title: "blue",
			window: tabWin
		});
		var count = 0;
		var timer = setInterval(function() {
			count++;
			tabGroup.open();
			setTimeout(function() {
				tabGroup.close();
			}, 500);
			if (4 == count) {
				clearInterval(timer);
				should(win.fullscreen).be.false;
				should(win.exitOnClose).be.true;
				finish();
			}
		}, 2000);
		tabGroup.addTab(tab);
	});

	//TIMOB-7000
	it("tabGroup_Open", function(finish) {
		var tabGroup = Ti.UI.createTabGroup();
		var win1 = Ti.UI.createWindow();
		var tab1 = Ti.UI.createTab();
		tab1.window = win1;
		var win2 = Ti.UI.createWindow();
		var tab2 = Ti.UI.createTab();
		tab2.setWindow(win2);
		tabGroup.addTab(tab1);
		tabGroup.addTab(tab2);
		should(function() {
			tabGroup.open();
		}).not.be.throw();
		finish();
	});
});