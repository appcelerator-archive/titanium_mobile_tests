/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("ui_window", function() {
	//TIMOB-11525
	it("windowRelativeUrl", function(finish) {
		this.timeout(1e4);
		var w = Ti.UI.createWindow({
			url: "dir/relative.js"
		});
		w.addEventListener("close", function() {
			should(w.getBackgroundColor()).be.eql("blue");
			should(w.getTitle()).be.eql("relativeWindow");
			finish();
		});
		w.open();
	});

	//TIMOB-9482
	it("closeEventListenerInOpenEvent", function(finish) {
		this.timeout(1e4);
		var win = Ti.UI.createWindow();
		var win2 = Ti.UI.createWindow({
			layout: "vertical"
		});
		win2.addEventListener("open", function() {
			win2.title = "win2";
			win2.addEventListener("close", function() {
				should(win2.getTitle()).be.eql("win2");
				finish();
			});
		});
		setTimeout(function() {
			win2.open();
			setTimeout(function() {
				win2.close();
			}, 4e3);
		}, 2e3);
		win.open();
	});

	//TIMOB-12134
	it("borderWidthWindowInTabgroup", function(finish) {
		this.timeout(3e4);
		var tabGroup = Titanium.UI.createTabGroup();
		var openEvent = false;
		var win1 = Titanium.UI.createWindow({
			borderWidth: 1,
			borderColor: "red"
		});
		var tab1 = Titanium.UI.createTab({
			window: win1
		});
		tabGroup.addTab(tab1);
		win1.addEventListener("open", function() {
			openEvent = true;
		});
		tabGroup.open();
		setTimeout(function() {
			should(openEvent).be.true;
			finish();
		}, 4e3);
	});

	//TIMOB-9462
	it("modalAndExitoncloseTogether", function(finish) {
		this.timeout(6e4);
		var win = Ti.UI.createWindow({
			modal: true,
			exitOnClose: true
		});
		var webview = Titanium.UI.createWebView({
			url: "http://www.appcelerator.com"
		});
		win.add(webview);
		win.addEventListener("close", function() {
			finish();
		});
		setTimeout(function() {
			should(function() {
				win.close();
			}).not.be.throw();
		}, 5e3);
		win.open();
	});

	//TIMOB-5192 ios
	it("events_Navigationbar", function(finish) {
		this.timeout(5e3);
		if ("iphone" !== Ti.Platform.osname && "ipad" !== Ti.Platform.osname) {
			return finish();
		}

		var navGroup = Titanium.UI.iOS.createNavigationWindow();
		var win1 = Titanium.UI.createWindow();
		var win2 = Titanium.UI.createWindow();

		var win1state = 'win1 closed';
		var win2state = 'win2 closed';
		var win1focused = false;

		win1.addEventListener("open", function() {
			//Ti.API.info('WIN1 OPEN');
			should(win1state).eql('win1 closed');
			should(win2state).eql('win2 closed');
			win1state = 'win1 opened';
		});
		win1.addEventListener("focus", function() {
			//Ti.API.info('WIN1 FOCUS');
			if (!win1focused) {
				win1focused = true;
				should(win1state).eql('win1 opened');
				should(win2state).eql('win2 closed');
				win1state = 'win1 focused';
				//Ti.API.info('OPENING WIN2');
				navGroup.openWindow(win2);
			} else {
				should(win1state).eql('win1 blurred');
				should(win2state).eql('win2 blurred');
				win1state = 'win1 focused';
				finish();
			}
		});
		win1.addEventListener("blur", function() {
			//Ti.API.info('WIN1 BLUR');
			should(win1state).eql('win1 opened');
			should(win2state).eql('win2 closed');
			win1state = 'win1 blurred';
		});

		win2.addEventListener("open", function() {
			//Ti.API.info('WIN2 OPEN');
			should(win1state).eql('win1 focused');
			should(win2state).eql('win2 closed');
			win2state = 'win2 opened';
		});
		win2.addEventListener("focus", function() {
			//Ti.API.info('WIN2 FOCUS');
			should(win1state).eql('win1 blurred');
			should(win2state).eql('win2 opened');
			//Ti.API.info('CLOSING WIN2');
			win2state = 'win2 focused';
			navGroup.closeWindow(win2);
		});
		win2.addEventListener("blur", function() {
			//Ti.API.info('WIN2 BLUR');
			should(win1state).eql('win1 blurred');
			should(win2state).eql('win2 blurred');
			win2state = 'win2 blurred';
		});
		win2.addEventListener("close", function() {
			//Ti.API.info('WIN2 CLOSE');
			should(win1state).eql('win1 focused');
			should(win2state).eql('win2 blurred');
			win2state = 'win2 closed';
		});

		navGroup.window = win1;
		//Ti.API.info('NAVGROUP OPEN');
		navGroup.open();
	});

	//TIMOB-7023 TIMOB-8331
	it("openAndFocusEventOrder", function(finish) {
		this.timeout(5e3);
		var win1 = Titanium.UI.createWindow({
			navBarHidden: true
		});
		var openevent = false;
		var focusevent = false;
		win1.addEventListener("open", function(e) {
			openevent = true;
			should(focusevent).be.false;
			should(openevent).be.true;
		});
		win1.addEventListener("focus", function(e) {
			focusevent = true;
			should(focusevent).be.true;
			should(openevent).be.true;
			finish();
		});
		win1.open();
	});

	//TIMOB-10005
	this.postlyoutEvent = function(testRun) {
		var win = Ti.UI.createWindow({
			layout: "vertical",
			navBarHidden: true
		});
		var button = Ti.UI.createButton();
		win.add(button);
		var label = Ti.UI.createLabel({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL
		});
		win.add(label);
		var buttonEvent = 0;
		var labelEvent = 0;
		var winEvent = 0;
		button.addEventListener("postlayout", function(e) {
			buttonEvent += 1;
		});
		label.addEventListener("postlayout", function(e) {
			labelEvent += 1;
		});
		win.addEventListener("postlayout", function(e) {
			winEvent += 1;
		});
		setTimeout(function() {
			should(buttonEvent).be.eql(1);
			should(labelEvent).be.eql(1);
			should(winEvent).be.eql(1);
			finish();
		}, 2e3);
		win.open();
	};

	//TIMOB-4104
	it("exposePixelFormat", function(finish) {
		this.timeout(5e3);
		if ("android" !== Ti.Platform.osname) {
			return finish();
		}

		var w = Ti.UI.createWindow({
			navBarHidden: false,
			exitOnClose: true,
			backgroundImage: "gradient.png",
			windowPixelFormat: Ti.UI.Android.PIXEL_FORMAT_RGB_565
		});
		w.addEventListener("focus", function() {
			should(function() {
				w.windowPixelFormat = Ti.UI.Android.PIXEL_FORMAT_RGB_565;
			}).not.be.throw();
			should(function() {
				w.setWindowPixelFormat(Ti.UI.Android.PIXEL_FORMAT_RGBA_8888);
			}).not.be.throw();
			finish();
		});
		w.open();
	});

	//TIMOB-8027
	it("openEventInNavigationalGroup", function(finish) {
		this.timeout(5e3);
		if ("iphone" !== Ti.Platform.osname && "ipad" !== Ti.Platform.osname) {
			return finish();
		}

		var win2 = Titanium.UI.createWindow();
		var f1 = 0;
		var f2 = 0;
		var win1 = Titanium.UI.iOS.createNavigationWindow({
			window: win2
		});
		var win3 = Titanium.UI.createWindow();
		win2.addEventListener("open", function() {
			f1 += 1;
		});
		win3.addEventListener("open", function() {
			f2 += 1;
		});
		win1.open();
		win1.openWindow(win3, {
			animated: true
		});
		setTimeout(function() {
			should(f1).be.eql(1);
			should(f2).be.eql(1);
			finish();
		}, 3e3);
	});

	//TIMOB-8314
	it("fireCloseEvent", function(finish) {
		this.timeout(8000);
		if ("iphone" !== Ti.Platform.osname && "ipad" !== Ti.Platform.osname) {
			return finish();
		}

		var win1state = 'win1 closed';
		var win2state = 'win2 closed';

		var win1 = Titanium.UI.createWindow();
		win1.addEventListener("focus", function() {
			win1state = 'win1 focused';
			nav.openWindow(win2);
		});
		win1.addEventListener("blur", function() {
			win1state = 'win1 blurred';
		});

		var nav = Titanium.UI.iOS.createNavigationWindow({
			window: win1
		});
		var win2 = Titanium.UI.createWindow();
		win2.addEventListener("focus", function() {
			win2state = 'win2 focused';
			nav.closeWindow(win2);
		});
		win2.addEventListener("close", function() {
			win2state = 'win2 closed';
		});

		setTimeout(function() {
			should(win1state).be.eql('win1 focused');
			should(win2state).be.eql('win2 closed');
			finish();
		}, 5000);
		nav.open();
	});

	//TIMOB-9502
	it("openAndFocusOnFirstWindow", function(finish) {
		this.timeout(5000);
		if ("iphone" !== Ti.Platform.osname && "ipad" !== Ti.Platform.osname) {
			return finish();
		}

		var win = Ti.UI.createWindow({
			height: 100,
			width: 100,
			url: "win/window.js",
			layout: "vertical"
		});
		var nav = Ti.UI.iOS.createNavigationWindow({
			window: win
		});
		var mainWin = Ti.UI.createWindow();
		var openEvent = 0;
		var focusEvent = 0;
		win.addEventListener("open", function() {
			openEvent += 1;
		});
		win.addEventListener("focus", function() {
			focusEvent += 1;
			should(openEvent).be.eql(1);
			should(focusEvent).be.eql(1);
			finish();
		});
		mainWin.addEventListener("open", function() {
			nav.open();
		});
		mainWin.open();
	});

	//TIMOB-9100
	it("removeChildren", function(finish) {
		this.timeout(1e4);
		var win = Ti.UI.createWindow({
			width: 100,
			height: 100
		});
		var view = Ti.UI.createView();
		win.add(view);
		win.addEventListener("focus", function() {
			should(win.children.length).be.eql(1);
			should(function() {
				win.remove(win.children[0]);
			}).not.be.throw();
			finish();
		});
		win.open();
	});

	//TIMOB-8976 , TIMOB-9262 , TIMOB-9483
	it("parentwindowFocus", function(finish) {
		var win1 = Titanium.UI.createWindow();
		var firstWinFocusEvent = 0;
		var firstWinBlurEvent = 0;
		var secondWinBlurEvent = 0;
		var secondWinFocusEvent = 0;
		var tabGroup = Titanium.UI.createTabGroup();
		var tab1 = Titanium.UI.createTab({
			window: win1
		});
		tabGroup.addTab(tab1);
		win1.addEventListener("focus", function() {
			firstWinFocusEvent += 1;
			if (1 == firstWinFocusEvent) {
				win2.open();
				win2.close();
			} else {
				should(firstWinFocusEvent).be.eql(2);
				should(secondWinFocusEvent).be.eql(1);
				should(firstWinBlurEvent).be.eql(1);
				should(secondWinBlurEvent).be.eql(1);
				finish();
			}
		});
		win1.addEventListener("blur", function() {
			firstWinBlurEvent += 1;
		});
		var win2 = Ti.UI.createWindow();
		win2.addEventListener("focus", function() {
			secondWinFocusEvent += 1;
		});
		win2.addEventListener("blur", function() {
			secondWinBlurEvent += 1;
		});
		tabGroup.open();
	});

	//TIMOB-4947
	it("closeEventHW", function(finish) {
		var win = Ti.UI.createWindow();
		var win2 = Ti.UI.createWindow({
			modal: true,
			backgroundColor: "red"
		});
		win.addEventListener("open", function() {
			win2.open();
			setTimeout(function() {
				win2.close();
			}, 1e3);
		});
		win2.addEventListener("close", function() {
			finish();
		});
		win.open();
	});

	//TIMOB-4759
	it("openHW", function(finish) {
		var win = Ti.UI.createWindow({
			modal: true,
			layout: "vertical"
		});
		win.open();
		should(function() {
			win.open();
		}).not.be.throw();
		finish();
	});

	//TIMOB-1827
	it("numberOfFireCloseEvent", function(finish) {
		this.timeout(10000);
		var tabGroup = Titanium.UI.createTabGroup();
		var win1 = Titanium.UI.createWindow();
		var tab1 = Titanium.UI.createTab({
			window: win1
		});
		tabGroup.addTab(tab1);

		var closecount = 0;
		win1.addEventListener("open", function() {
			var win2 = Ti.UI.createWindow({
				fullscreen: true,
				layout: "vertical"
			});
			win2.addEventListener("open", function() {
				win2.close();
			});
			win2.addEventListener("close", function() {
				closecount += 1;
			});

			win2.open();

			should(win2.fullscreen).be.true;
			should(win2.layout).be.eql("vertical");

			setTimeout(function() {
				should(closecount).be.eql(1);
				finish();
			}, 5000);
		});
		tabGroup.open();
	});

	//TIMOB-6891
	it("windowPropertyOfTab", function(finish) {
		should(function() {
			Ti.UI.createTab({
				window: Ti.UI.createWindow()
			}).window.addEventListener("focus", function() {});
		}).not.be.throw();
		finish();
	});

	//TIMOB-8030
	it("numberOfOpenEventFire", function(finish) {
		var win = Ti.UI.createWindow({
			top: 10,
			right: 0,
			bottom: 10,
			left: 0
		});
		var num = 0;
		win.addEventListener("open", function() {
			num += 1;
			should(win.top).be.eql(50);
			should(win.bottom).be.eql(50);
		});
		setTimeout(function() {
			should(num).be.eql(1);
			finish();
		}, 1e3);
		win.top = 50;
		win.bottom = 50;
		win.open({
			top: 50,
			bottom: 50,
			duration: 0
		});
	});

	//TIMOB-9387
	it("closeMethodInOpenEvent", function(finish) {
		var win = Ti.UI.createWindow({
			exitOnClose: true,
			navBarHidden: false
		});
		win.addEventListener("open", function() {
			should(win.exitOnClose).be.eql(1);
			should(win.navBarHidden).be.eql(0);
			win.close();
		});
		win.addEventListener("close", function() {
			finish();
		});
		win.open();
	});

	//TIMOB-10136
	this.postLayoutEventInParentView = function(testRun) {
		var win = Ti.UI.createWindow({
			layout: "vertical",
			navBarHidden: true
		});
		var view = Ti.UI.createView({
			width: 200,
			height: 200
		});
		win.add(view);
		var viewEvent = 0;
		var winEvent = 0;
		view.addEventListener("postlayout", function() {
			viewEvent += 1;
		});
		win.addEventListener("postlayout", function() {
			winEvent += 1;
		});
		setTimeout(function() {
			should(viewEvent).be.eql(2);
			should(winEvent).be.eql(1);
			finish();
		}, 3e3);
		win.open();
	};

	//TIMOB-5047
	it("barimageForNavbar", function(finish) {
		if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
			var tabGroup = Titanium.UI.createTabGroup();
			var win1 = Titanium.UI.createWindow({
				height: 100,
				width: 100
			});
			var tab1 = Titanium.UI.createTab({
				window: win1
			});
			tabGroup.addTab(tab1);
			tabGroup.addEventListener("focus", function() {
				should(function() {
					win1.setBarImage("gradient.png");
				}).not.be.throw();
				should(win1.height).be.eql(100);
				should(win1.width).be.eql(100);
				finish();
			});
			tabGroup.open();
		} else finish();
	});

	//TIMOB-7569
	it("openEventOfNormalwindow", function(finish) {
		this.timeout(10000);
		var modalwindow = Ti.UI.createWindow({
			backgroundColor: "red",
			modal: true
		});
		var normalwindowCount = 0;
		var normalwindow = Ti.UI.createWindow();
		var win = Ti.UI.createWindow({
			height: 100,
			width: 100,
			backgroundColor: "green"
		});
		win.addEventListener("open", function() {
			modalwindow.open();
			normalwindow.open();
			normalwindow.close();
			modalwindow.close();
		});
		normalwindow.addEventListener("open", function() {
			normalwindowCount += 1;
		});
		setTimeout(function() {
			should(win.height).be.eql(100);
			should(win.width).be.eql(100);
			should(normalwindowCount).be.eql(1);
			finish();
		}, 5000);
		win.open();
	});
});