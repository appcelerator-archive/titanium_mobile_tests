/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("media", function() {
	it("constants", function(finish) {
		should(Ti.Media).not.be.null;
		// Video Scaling
		should(Ti.Media.VIDEO_SCALING_NONE).not.be.null;
		should(Ti.Media.VIDEO_SCALING_ASPECT_FILL).not.be.null;
		should(Ti.Media.VIDEO_SCALING_ASPECT_FIT).not.be.null;
		should(Ti.Media.VIDEO_SCALING_MODE_FILL).not.be.null;
		finish();
	});

	it("soundAPIs", function(finish) {
		should(Ti.Media.createSound).be.a.Function;
		var sound = Ti.Media.createSound({
			url: "sound.wav"
		});
		should(sound).not.be.null;
		should(sound.getTime).be.a.Function;
		should(sound.setTime).be.a.Function;
		should(sound.time).be.a.Number;
		should(sound.isLooping).be.a.Function;
		should(sound.setLooping).be.a.Function;
		should(sound.looping).be.Boolean;
		should(sound.isPaused).be.a.Function;
		should(sound.paused).be.Boolean;
		should(sound.isPlaying).be.a.Function;
		should(sound.playing).be.Boolean;
		should(sound.pause).be.a.Function;
		should(sound.play).be.a.Function;
		should(sound.release).be.a.Function;
		should(sound.reset).be.a.Function;
		should(sound.stop).be.a.Function;
		finish();
	});

	// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/2586
	it("audioPlayerAPIs", function(finish) {
		should(Ti.Media.createAudioPlayer).be.a.Function;
		var player = Ti.Media.createAudioPlayer();
		should(player).not.be.null;
		should(player.pause).be.a.Function;
		should(player.start).be.a.Function;
		should(player.setUrl).be.a.Function;
		should(player.stop).be.a.Function;
		should(player.paused).be.Boolean;
		if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
			should(player.stateDescription).be.a.Function;
			should(player.idle).be.Boolean;
			should(player.state).be.a.Number;
			should(player.waiting).be.Boolean;
			should(player.bufferSize).be.a.Number;
		}
		finish();
	});

	it("videoPlayerAPIs", function(finish) {
		should(Ti.Media.createVideoPlayer).be.a.Function;
		var player = Ti.Media.createVideoPlayer();
		should(player).not.be.null;
		should(player.add).be.a.Function;
		should(player.pause).be.a.Function;
		should(player.play).be.a.Function;
		// this is the documented way to start playback.
		should(player.start).be.a.Function;
		// backwards compat.
		should(player.stop).be.a.Function;
		if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
			should(player.setUrl).be.a.Function;
		}
		should(player.hide).be.a.Function;
		should(player.setMediaControlStyle).be.a.Function;
		should(player.getMediaControlStyle).be.a.Function;
		should(player.getScalingMode).be.a.Function;
		should(player.setScalingMode).be.a.Function;
		finish();
	});

	it("audioTimeValidation", function(finish) {
		this.timeout(5e3);
		var sound = Ti.Media.createSound({
			url: "sound.wav"
		});
		var initial_pos = 3e3;
		sound.time = initial_pos;
		sound.setTime(initial_pos);
		should(sound.getTime()).be.eql(initial_pos);
		should(sound.time).be.eql(initial_pos);
		sound.play();
		setTimeout(function(e) {
			var time = sound.getTime();
			Ti.API.info("PROGRESS: " + time);
			should(time).be.greaterThan(initial_pos);
			// assume we get an event in < 2 seconds.
			should(time).be.lessThan(initial_pos + 3e3);
			sound.stop();
			sound = null;
			finish();
		}, 1e3);
	});

	it("screenshot", function(finish) {
		this.timeout(2e3);
		should(function() {
			Titanium.Media.takeScreenshot(function(e) {
				should(e).be.Object;
				should(e.media).be.Object;
				should(e.media.mimeType).be.String;
				should(e.media.mimeType.substr(0, 5)).be.eql("image");
				finish();
			});
		}).not.be.throw();
	});

	//TIMOB-6809
	it("Media_Android_scanMediaFiles", function(finish) {
		this.timeout(6e4);
		if ("android" !== Ti.Platform.osname) {
			return finish();
		}

		var win = Titanium.UI.createWindow({
			exitOnClose: true
		});
		var lbl = Ti.UI.createLabel({
			height: "80dp",
			left: "5dp",
			right: "5dp"
		});
		win.add(lbl);
		win.addEventListener("open", function() {
			var f = Ti.Filesystem.getFile("image.png");
			f.copy("appdata://image.png");
			f = Ti.Filesystem.getFile("appdata://image.png");
			should(function() {
				Ti.Media.Android.scanMediaFiles([ f.nativePath ], null, function(e) {
					lbl.text = e.uri;
				});
			}).not.be.throw();
			finish();
		});
		win.open();
	});

	//TIMOB-7365
	it("getUrlMethod", function(finish) {
		this.timeout(6e4);
		var audioPlayer = Ti.Media.createAudioPlayer({
			url: "www.example.com/podcast.mp3",
			allowBackground: true
		});
		should(audioPlayer.getUrl()).not.be.null;
		finish();
	});

	//TIMOB-2135
	it("changeState", function(finish) {
		this.timeout(1e5);
		if ("iphone" !== Ti.Platform.osname && "ipad" !== Ti.Platform.osname) {
			return finish();
		}

		var win = Ti.UI.createWindow();
		Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;
		var streamer = Ti.Media.createAudioPlayer({
			url: "http://www.archive.org/download/jungle_book_mh_0808_librivox/junglebook_kipling_01.mp3"
		});
		win.addEventListener("open", function() {
			streamer.start();
			setTimeout(function() {
				streamer.stop();
			}, 5e3);
		});
		var starting = false;
		var waiting_for_data = false;
		var waiting_for_queue = false;
		var playing = false;
		var stopping = false;
		var stopped = false;
		streamer.addEventListener("change", function(e) {
			if (1 == e.state) {
				starting = true;
			} else if (2 == e.state) {
				waiting_for_data = true;
			} else if (3 == e.state) {
				waiting_for_queue = true;
			} else if (4 == e.state) {
				playing = true;
			} else if (6 == e.state) {
				stopping = true;
			} else if (7 == e.state) {
				stopped = true;
				should(stopped).be.true;
				should(stopping).be.true;
				should(playing).be.true;
				should(waiting_for_data).be.true;
				should(starting).be.true;
				should(waiting_for_queue).be.true;
				finish();
			}
		});
		win.open();
	});
});