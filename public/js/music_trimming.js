$("document").ready(function(){

	window.musicTrim = new MusicTrim();

	$('.music_back_tim_10').click(function(){
		var currentTime = musicTrim.currentTime-10;
			if(currentTime <= 0)
				currentTime = 0;

		musicTrim.currentTime = currentTime;
		$( "#music-slider" ).slider({value:1000*currentTime/musicTrim.videoLengthFull,max:1000});
		musicTrim.ui = 1000*currentTime/musicTrim.videoLengthFull;
		musicTrim.srroll_player();
		musicTrim.timer();
        musicTrim.musicChart.play();
	});

	$('.music_back_tim_1').click(function(){
		var currentTime = musicTrim.currentTime-1;
			if(currentTime <= 0)
				currentTime = 0;

		musicTrim.currentTime = currentTime;
		$( "#music-slider" ).slider({value:1000*currentTime/musicTrim.videoLengthFull,max:1000});
		musicTrim.ui = 1000*currentTime/musicTrim.videoLengthFull;
		musicTrim.srroll_player();
		musicTrim.timer();
        musicTrim.musicChart.play();
	});

	$('.music_next_tim_10').click(function(){
		if(musicTrim.currentTime+10 <= musicTrim.videoLengthFull-musicTrim.musicLength){
			var currentTime = musicTrim.currentTime+10;
		}else{
			var currentTime = musicTrim.videoLengthFull-musicTrim.musicLength;
		}

		musicTrim.currentTime = currentTime;
		$( "#music-slider" ).slider({value:1000*currentTime/musicTrim.videoLengthFull,max:1000});
		musicTrim.ui = 1000*currentTime/musicTrim.videoLengthFull;
		musicTrim.srroll_player();
		musicTrim.timer();
        musicTrim.musicChart.play();
	});

	$('.music_next_tim_1').click(function(){
		if(musicTrim.currentTime+1 <= musicTrim.videoLengthFull-musicTrim.musicLength){
			var currentTime = musicTrim.currentTime+1;
		}else{
			var currentTime = musicTrim.videoLengthFull-musicTrim.musicLength;
		}

		musicTrim.currentTime = currentTime;
		$( "#music-slider" ).slider({value:1000*currentTime/musicTrim.videoLengthFull,max:1000});
		musicTrim.ui = 1000*currentTime/musicTrim.videoLengthFull;
		musicTrim.srroll_player();
        musicTrim.timer();
		musicTrim.musicChart.play();
	});

	$('.music_triming_popu_clos').click(function(){
		$('.modal-window-music').hide();
		musicTrim.hidePopu(); 
	});

    $('.music_triming_popu_back').click(function(){
        $('.modal-window-music').hide();
        musicTrim.hidePopu();
        $('#audio-start___modal').modal('show');
    });

	$('.music-continue').click(function(){
		var data = {
			src:musicTrim.MusicData,
			start_time:musicTrim.toHHMMSS(musicTrim.currentTime),
			duration:musicTrim.musicLength,
		};

		// $('body').append('<div id="lodaingGif" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; background: black; opacity: 0.3;"><i class="fa fa-circle-o-notch fa-spin" style="position: relative; top: 10%; left: 24%; font-size: 100px;margin-top: 130px;margin-left: 350px;color: #fff;"></i></div>');
		// $.post( "/editor/music-trim",data).done(function( data ) {
		// 	var data = JSON.parse(data);

  //           $('#lodaingGif').remove();
  //           $('.close-po-up.music_triming_popu_clos').trigger( "click" );

		// 	if(data.success == true ){
		// 		musicTrim.InsertedTempladeData(data.url)
  //           }else{
		// 		alert('Error')
		// 	}
		// });

        globalOptions['music_url'] = musicTrim.MusicData;
        globalOptions['music_start_time'] = musicTrim.toHHMMSS(musicTrim.currentTime);
        globalOptions['music_duration'] = musicTrim.musicLength;
        $('.close-po-up.music_triming_popu_clos').trigger( "click" );
	});
});


function MusicTrim(){
    this.MusicData = '';
    this.currentTime = 0;
    this.videoLengthFull = false;
    this.ui = false;
    this.musicChart = '';
    this.setInterval = 0;
    this.musicLength = 0;
    this.cropEditor = $('.music-container');
    this.slider = $('.app-middle');
}

MusicTrim.prototype.initMusicChart = function() {
    var _this = this;

    this.musicChart = WaveSurfer.create({
        container: '#music-trim-container',
        waveColor: '#48B2CE',
        progressColor: '#2F8298'
    });
}

MusicTrim.prototype.trimingPopUp = function(url) {
    var _this = this;

    if(url && video_duration){
        this.MusicData = url;
        this.initMusicChart();
        this.musicChart.load(url);
        this.musicLength = video_duration;
        // this.musicLength = 1;

        this.musicChart.on('ready',function(){
            _this.videoLengthFull = _this.musicChart.getDuration();
            _this.get_play();
        })
    }else{
	    alert('Error');
    }
};

MusicTrim.prototype.hidePopu = function(){
    $( "#music-progressbar" ).progressbar( "value", 0 );
	$('#music-slider').slider("destroy");

    if(this.musicChart.isPlaying())
        this.musicChart.pause();

    this.musicChart.destroy();
	this.ui = 0;
	this.currentTime = 0;
};

MusicTrim.prototype.get_play = function() {
    var timelistener;
    var min = this.musicLength;
    var _this = this;
    this.musicChart.play();
    var i=0;
    $( "#music-progressbar" ).progressbar({
      value: 0,
      max:1000,
    });
    timelistener =  function(){
        var length = Math.round(_this.videoLengthFull),
            width = Math.round(100*min/length);

        if(length < min){
            _this.musicChart.pause();

        	_this.cropEditor.append('<p style="color:red;text-align:center">The video is shorter than required</p>')
        }

        if(i==1){
            _this.music_editor();
            $('.ui-slider-handle').addClass('select-segment');
            $('.ui-slider-handle').append('<i class="fa fa-circle fa-lg left"></i>');
            $('.ui-slider-handle').append('<i class="fa fa-circle fa-lg right"></i>');
            _this.timer();
        }
        if(i==0){
            _this.Width = width*10;
        }
            $('.ui-slider-handle').css('width',width+'%');
        i++;
    }
    this.musicChart.on('audioprocess', function () {
        timelistener();
        var value = (_this.musicChart.getCurrentTime() / _this.videoLengthFull)*1000,
            ui = _this.ui;

        $( "#music-progressbar" ).progressbar( "value", value-11 );
        if(value >= ui+_this.Width){
            _this.musicChart.pause();
        }
    })
};


MusicTrim.prototype.music_editor = function() {
    var _this = this;
    $( "#music-slider" ).slider({
      value:0,
      max: 1000,
      stop: function( event, ui ) {
          _this.currentTime = (ui.value*Math.round(_this.videoLengthFull))/1000;
          _this.ui = ui.value;
          _this.srroll_player();
          _this.timer();
          _this.musicChart.play();
        },
      start:function(event, ui){
        clearInterval(_this.setInterval);
        _this.musicChart.pause();
      },
      change: function( event, ui ) {
      },
      slide: function( event, ui ) {
         if(ui.value > 1000-_this.Width){
            $( "#music-slider" ).slider({value:1000-_this.Width,max:1000})
            return false;
         }
        }
    });
};

MusicTrim.prototype.srroll_player = function() {
    this.musicChart.skip(this.currentTime -this.musicChart.getCurrentTime());
};

MusicTrim.prototype.timer = function(){
	$('.time_position p').text(this.toHHMMSS(this.currentTime));
	$('.triming_tim').text(this.toHHMMSS(this.currentTime)+'/'+this.toHHMMSS(parseInt(this.currentTime)+parseInt(this.musicLength)));
};

MusicTrim.prototype.toHHMMSS = function (time) {
    var sec_num = parseInt(time, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
};

MusicTrim.prototype.InsertedTempladeData = function(url){
    InsertedTempladeData['cropedMusic'] = url;

    // var slide_id = this.slide_id,
    //     video_id = this.video_id;
    // if (InsertedTempladeData[slide_id] == undefined) {
    //     InsertedTempladeData[slide_id] = {};
    // }
    // if (InsertedTempladeData[slide_id]["video"] ==  undefined) {
    //     InsertedTempladeData[slide_id]["video"] = {};
    // }
    // if (InsertedTempladeData[slide_id]["video"][video_id] == undefined) {
    //     InsertedTempladeData[slide_id]["video"][video_id] = {};
    // }
    // InsertedTempladeData[slide_id]["video"][video_id]['url'] = url;

    // this.slider.find('[data-id='+(slide_id)+'] [data-vidpk='+video_id+']')
    //     .removeClass('empty')
    //     .addClass('exist');
    // if(typeof Object.keys(InsertedTempladeData[slide_id]["video"]) != "undefined"){
    //    var current =  $(".image-container[data-id="+slide_id+"] .steps .validate-video").html();
    //    current = Object.keys(InsertedTempladeData[slide_id]["video"]).length + current.substring(current.indexOf("/"));
    //    $(".image-container[data-id="+slide_id+"] .steps .validate-video").html(current);
    // }
    // $('.modal-window').hide();
    // peercents();
    // selected_slide();
};