$("document").ready(function(){

    var video = new Video();
    video.VideocloudsuiteCategories();

    $(document).on('click','.add-new-videos-input',function(e){
        $('#video-start___modal').modal('show');
        video.videoLength =  $(this).parent().data('time');
        video.slide_id = $(this).parents('.current-slide').data('id');
        video.video_id = $(this).parent().data('vidpk');
        video.mixed = false;
        var i = 1;
        if(user_videos.length > 0){

            $.each( user_videos, function( key, value ) {

                // $('#video-start___modal .user-videos ul').append('<li style="display:none;"><div class="item"><div class="thumb"><video id="video_'+value.id+'" style="height:130px;width:100%" preload="metadata"><source src="'+value.path+'"></source></video></div><div class="tools"><a href="#" class="modal-play"><span class="fa fa-play"></span><span class="duration"></span></a><a href="#addtolibrary" class="open"><span class="fa fa-eye"></span><span>Open</span></a><a href="#addtolibrary" class="add-to-cnavans-start"><span class="fa fa-plus-circle"></span><span>Add To <br>Canvas</span></a></div></div></li>');
                $('#video-start___modal .user-videos ul').append('<li class="hold-asp-ratio" style="display:none;" data-id="'+value.id+'"><div class="item asp-content"><div class="thumb"><video id="video_'+value.id+'" style="height:auto;width:100%" preload="metadata"><source src="'+value.path+'"></video></div><div class="tools"><a href="#" class="modal-play"><span class="fa fa-play"></span><span class="duration"></span></a><a href="#addtolibrary" class="open"><span class="fa fa-eye"></span><span>Open</span></a><a href="#addtolibrary" class="add-to-cnavans-start"><span class="fa fa-plus-circle"></span><span>Add To<br>Canvas</span></a></div></div></li>');
                var videos = document.getElementById('video_'+value.id+'');
                videos.addEventListener('loadedmetadata', function() {
                    $(videos).parent().next().find('.duration').text(video.toMMSS(videos.duration));
                    if(i == user_videos.length){
                        $('#video-start___modal').find('.loding').hide();
                        $('#video-start___modal .user-videos li').show();
                    }
                    i++;
                });
            });
        }else{
            $('#video-start___modal .loding').hide();
        }
    });

    $(document).on('click','.multi_element_video',function(e){
        $('#video-start___modal').modal('show');
        video.videoLength =  $(this).parent().data('time');
        video.slide_id = $(this).parents('.current-slide').data('id');
        video.video_id = $(this).parent().data('vidpk');
        video.mixed = true;
        var i = 1;
        if(user_videos.length > 0){

            $.each( user_videos, function( key, value ) {

                // $('#video-start___modal .user-videos ul').append('<li style="display:none;"><div class="item"><div class="thumb"><video id="video_'+value.id+'" style="height:130px;width:100%" preload="metadata"><source src="'+value.path+'"></source></video></div><div class="tools"><a href="#" class="modal-play"><span class="fa fa-play"></span><span class="duration"></span></a><a href="#addtolibrary" class="open"><span class="fa fa-eye"></span><span>Open</span></a><a href="#addtolibrary" class="add-to-cnavans-start"><span class="fa fa-plus-circle"></span><span>Add To <br>Canvas</span></a></div></div></li>');
                $('#video-start___modal .user-videos ul').append('<li class="hold-asp-ratio" style="display:none;" data-id="'+value.id+'"><div class="item asp-content"><div class="thumb"><video id="video_'+value.id+'" style="height:auto;width:100%" preload="metadata"><source src="'+value.path+'"></video></div><div class="tools"><a href="#" class="modal-play"><span class="fa fa-play"></span><span class="duration"></span></a><a href="#addtolibrary" class="open"><span class="fa fa-eye"></span><span>Open</span></a><a href="#addtolibrary" class="add-to-cnavans-start"><span class="fa fa-plus-circle"></span><span>Add To<br>Canvas</span></a></div></div></li>');
                var videos = document.getElementById('video_'+value.id+'');
                videos.addEventListener('loadedmetadata', function() {
                    $(videos).parent().next().find('.duration').text(video.toMMSS(videos.duration));
                    if(i == user_videos.length){
                        $('#video-start___modal').find('.loding').hide();
                        $('#video-start___modal .user-videos li').show();
                    }
                    i++;
                });
            });
        }else{
            $('#video-start___modal .loding').hide();
        }
    });

    $('.example___video').click(function(){
        $('#example___video').modal('show');
        document.getElementById('editor_video').play();
    });

    $('#example___video').on('hide.bs.modal', function (e) {
        document.getElementById('editor_video').pause();
    });
    $('#user-video-modal').bind('hidden.bs.modal', function () {
        $('#user-video-modal .modal-body').html('');
    });

    $('#video-start___modal').bind('hidden.bs.modal', function () {
        $.each( $('.user-videos video'), function( key, value ) {
            var id = $(value).attr('id');

            if(document.getElementById(id).paused == false || document.getElementById(id).currentTime > 0){
                document.getElementById(id).pause();
                $('.user-videos .item .tools .modal-play .fa').removeClass('fa-pause').addClass('fa-play');
            }
        });
    });

    $(document).on('click','.modal-play',function(e){
        $(this).parents('.tools').prev('.thumb').removeClass('selected');
        var play = true;
        if($(this).find('.fa.fa-pause').length == 1){
            play = false;
        }

        $.each( $('.user-videos video'), function( key, value ) {
            var id = $(value).attr('id');

            if(document.getElementById(id).paused == false || document.getElementById(id).currentTime > 0){
                document.getElementById(id).pause();
                $('.user-videos .item .tools .modal-play .fa').removeClass('fa-pause').addClass('fa-play');
            }
        });

        if(play){
            var id = $(this).parents('.item').find('video').attr('id');
            document.getElementById(''+id+'').play();
            $(this).find('.fa').removeClass('fa-play').addClass('fa-pause');
        }
    });

    $(document).on('click','.user-videos .open',function(e){
        $.each( $('.user-videos video'), function( key, value ) {
            var id = $(value).attr('id');

            if(document.getElementById(id).paused == false || document.getElementById(id).currentTime > 0){
                document.getElementById(id).pause();
                $('.user-videos .item .tools .modal-play .fa').removeClass('fa-pause').addClass('fa-play');
            }
        });

        $('#user-video-modal').modal('show');
        var src = $(this).parents('.item').find('video source').attr('src');
        $('#user-video-modal .modal-body').html('<div class="loding" style="width: 65px;height: 55px; margin: auto; position: absolute;top: 0; left: 0;right: 0;bottom: 0;"><div data-loader="circle-side"></div></div><video id="userVideos" autoplay="true" preload="auto" controls width="100%" height="515"  style="display:none;"><source src="'+src+'" type="video/mp4"></video>');
        document.getElementById('userVideos').addEventListener('loadeddata',function(){
            $('#userVideos').css('display','block');
            $('#user-video-modal .loding').remove();
        })
    });

    $(document).on('click','.user-videos .add-to-cnavans-search',function(){
        var src = $(this).parents('.item').find('video source').attr('src');
        // $('#video-search___modal').modal('hide');
        video.modal = 'search';
        video.handleFileSelect(src);
    });

    $(document).on('click','.user-videos .add-to-cnavans-start',function(){
        var src = $(this).parents('.item').find('video source').attr('src');
        // $('#video-start___modal').modal('hide');
        video.modal = 'start';
        video.handleFileSelect(src);
    });

    $('.back_tim_10').click(function(){
        clearInterval(video.setInterval);
        var currentTime = video.currentTime-10;
        if(currentTime <= 0)
            currentTime = 0;
        video.currentTime = currentTime;
        $( "#slider" ).slider({value:1000*currentTime/video.videoLengthFull,max:1000});
        video.ui = 1000*currentTime/video.videoLengthFull;
        video.srroll_player();
        video.timer();
    });

    $('.back_tim_1').click(function(){
        clearInterval(video.setInterval);
        var currentTime = video.currentTime-1;
        if(currentTime <= 0)
            currentTime = 0;
        video.currentTime = currentTime;
        $( "#slider" ).slider({value:1000*currentTime/video.videoLengthFull,max:1000});
        video.ui = 1000*currentTime/video.videoLengthFull;
        video.srroll_player();
        video.timer();
    });

    $('.next_tim_10').click(function(){
        if(video.currentTime+10 <= video.videoLengthFull-video.videoLength){
            var currentTime = video.currentTime+10;
            console.log(currentTime);

        }else{
            var currentTime = video.videoLengthFull-video.videoLength;
            console.log(currentTime);
        }
        clearInterval(video.setInterval);
        video.currentTime = currentTime;
        $( "#slider" ).slider({value:1000*currentTime/video.videoLengthFull-10,max:1000});
        video.ui = 1000*currentTime/video.videoLengthFull;
        video.srroll_player();
        video.timer();
    });

    $('.next_tim_1').click(function(){
        if(video.currentTime+1 <= video.videoLengthFull-video.videoLength){
            var currentTime = video.currentTime+1;
            $( "#slider" ).slider({value:1000*currentTime/video.videoLengthFull-10,max:1000});
        }else{
            video.currentTime
            var currentTime = video.videoLengthFull-video.videoLength;
        }

        video.currentTime = currentTime;
        clearInterval(video.setInterval);
        video.ui = 1000*currentTime/video.videoLengthFull;
        video.srroll_player();
        video.timer();
    });

    $('.triming_popu_clos').click(function(){
        $('.modal-window').hide();
        video.hidePopu();
        clearInterval(video.setInterval);
        if(video.modal == 'start'){
            video.start_modal.modal('show');
        }else if(video.modal == 'search'){
            video.search_modal.modal('show');
        }

    });

    $('.continue').click(function(){
        var data = {
            src:video.VideoData,
            start_time:video.toHHMMSS(video.currentTime),
            duration:video.videoLength,
            template_id:$('.app').data('template-id')
        };

        var _this = video;
        var canvas = _this.slider.find('[data-id='+_this.slide_id+'] [data-vidpk="'+_this.video_id+'"]');
        if(canvas.find('canvas').length)
            canvas.find('canvas').remove();
        canvas.append('<canvas id="thecanvas'+_this.slide_id+'.'+_this.video_id+'" width="'+canvas.width()+'" height="'+canvas.height()+'" style="visibility:hidden"></canvas>');
        var thecanvas = document.getElementById('thecanvas'+_this.slide_id+'.'+_this.video_id+'');
        var context = thecanvas.getContext('2d');
        context.drawImage(_this.videoId, 0, 0, canvas.width(), canvas.height());

        var slide_position = video.slide_id,
            video_id = video.video_id;
            if(_this.mixed == true){
                element = $('.current-slide[data-id="'+slide_position+'"] .multi___element[data-vidpk="'+video_id+'"]');
                element.find('.add_mixed_media').css('visibility','hidden');
                element.append('<div class="loding"><div data-loader="circle-side-uplod" style="width: 35px;height: 35px;"></div></div>');
            }else{
                element = $('.current-slide[data-id="'+slide_position+'"] .video___file[data-vidpk="'+video_id+'"]');
                element.find('.add-new-videos-input').css('visibility','hidden');
                element.append('<div class="loding"><div data-loader="circle-side-uplod" style="width: 35px;height: 35px;"></div></div>');
            }
        video.hidePopu();
        uploadprogress();
        $('.modal-window').hide();
        var path = '';
        if(video.modal == 'start'){
            video.InsertedTempladeData(window.location.origin+data.src,data.start_time,data.duration);
        }else if(video.modal == 'search'){
            video.InsertedTempladeData(data.src,data.start_time,data.duration);
        }
        $('#lodaingGif').remove();
        element.find('.add-new-videos-input').css('visibility','');
        element.find('.add_mixed_media').css('visibility','');
        element.find('canvas').css('visibility','');
        element.find('.loding').remove();
        uploaddone();
    });

    $(document).on('click','.video-search1',function(){
        var modal = $(this).parents('.modal-body'),
            serarch_kw = modal.find('.search_video_input').val(),
            plugin = modal.find('#api').val(),
            categories = $(this).parents('.modal').find('#categories').val();

        video.recursion = false;
        video.start_modal.modal('hide');
        video.search_modal.find('.video-search-list ul').html('');
        video.search_modal.modal('show');
        video.search_modal.find('.loding').show();
        video.search_modal.find('.search_video_input').val(serarch_kw);
        video.search_modal.find('.user-videos ul').attr('data-lalibrary',plugin);

        // $('.selectpicker').selectpicker('refresh');

        if(plugin == 'pixabay'){

            video.getVideoPixabay(serarch_kw,1,categories);

        }else if(plugin == 'videocloudsuite'){

            video.Videocloudsuite(serarch_kw,1,categories);

        }else{
            video.search_modal.find('.loding').hide();
            alert("This API haven't been integrated yet");
        }
    });

    $(document).on('change','#video-search___modal #api,#video-start___modal #api',function(){
        var id = $(this).parents('.modal').attr('id');
                var api = ['videocloudsuite', 'pixabay'];
            if(id == 'video-start___modal'){
                video.search_modal.find('#api option').removeAttr('selected');
                video.search_modal.find('#api option[value="'+$(this).val()+'"]').attr('selected',true);
                $('#video-search___modal #api').selectpicker('refresh');
            }else{
                video.start_modal.find('#api option').removeAttr('selected');
                video.start_modal.find('#api option[value="'+$(this).val()+'"]').attr('selected',true);
                $("#video-search___modal #api").selectpicker('refresh');
            }

        if($(this).val() == 'pixabay'){
            video.PixabayCategories();
        }else{
            video.VideocloudsuiteCategories();
        }
    });

    $(document).on('click','#video-start___modal li .thumb',function(){
        var  id = $(this).find('video').attr('id');
        if(document.getElementById(id).paused == false || document.getElementById(id).currentTime > 0){
            document.getElementById(id).pause();

            $(this).next('.tools').find('.modal-play .fa').removeClass('fa-pause').addClass('fa-play');
        }
        $('#video-start___modal li .thumb').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on('click','#delete-video',function(){
        var element = $('#video-start___modal li .thumb.selected');

        if(element.length){
            $('#modal_delete_video').modal('show');
        }
    });

    $(document).on('click','#yes_delete_image',function(){
        $('#modal_delete_video').modal('hide');
        var element = $('#video-start___modal li .thumb.selected');
        if(element.length){
            var id = element.parents('li').attr('data-id');
            var url = element.find('video source').attr('src');
            $.post( '/editor/delete-user-upload-video',{id:id,url:url}).done(function( data ) {
                if(data.success){
                    $('#video-start___modal li[data-id="'+id+'"]').remove();
                }else{
                    alert("server error")
                }
            })
        }
    });

    $('#video-search___modal .custom-scrollbar').mCustomScrollbar({
        theme: "rounded-dots",
        scrollInertia: 400,
        callbacks:{
            onScroll:function(){
                if((-this.mcs.top) > $(this).find('.user-videos ').height() - $(this).height() -10){
                    if(video.scroll){
                        var serarch_kw = $('#video-search___modal .search_video_input').val(),
                            ul = $('#video-search___modal .user-videos ul'),
                            count = ul.data('count'),
                            library = $('#video-search___modal .dropdownMenuPlugin').val();
                        ul.data('count',count+1);
                        video.scroll = false;
                        if(library == 'pixabay'){
                            $('#video-search___modal').find('.loding').show();
                            video.getVideoPixabay(serarch_kw,count+1,$('#video-search___modal #categories').val());
                        }else if(library == 'videocloudsuite'){
                            $('#video-search___modal').find('.loding').show();
                            video.Videocloudsuite(serarch_kw,count+1,$('#video-search___modal #categories').val());
                        }
                    }
                }
            }
        }
    });

    $("#dropzone_video").dropzone({
        dictDefaultMessage: "DROP YOUR VIDEO HERE OR CLICK TO UPLOAD",
        previewTemplate:"",
        url:"/editor/dropzon-upload-video",
        acceptedFiles:"video/*",
        addedfile: function (file) {},
        thumbnail: function (file, dataUrl) {},
        uploadprogress: function (file, progress, bytesSent) {
            $("#custom").html('');
            $("#custom").percircle({
                percent: parseInt(progress)
            });
        },
        success:function(file,success){
          $('#video-start___modal').find('.user-videos ul li').last().remove();
            if(success.success){
                // $('#video-start___modal .user-videos ul').append('<li><div class="item"><div class="loding" style="margin: 35px auto;"><div data-loader="circle-side"></div></div><div class="thumb" style="display:none;"><video id="video_'+success.id+'" style="height:130px;width:100%" preload="metadata"><source src="'+success.url+'"></source></video></div><div class="tools" style="display:none;"><a href="#" class="modal-play"><span class="fa fa-play"></span><span class="duration"></span></a><a href="#addtolibrary" class="open"><span class="fa fa-eye"></span><span>Open</span></a><a href="#addtolibrary" class="add-to-cnavans-start"><span class="fa fa-plus-circle"></span><span>Add To <br>Canvas</span></a></div></div></li>');
                $('#video-start___modal .user-videos ul').append('<li class="hold-asp-ratio" data-id="'+success.id+'"><div class="item asp-content"><div class="loding" style="margin:77px auto;"><div data-loader="circle-side"></div></div><div class="thumb" style="display:none;"><video id="video_'+success.id+'" style="height:auto;width:100%" preload="metadata"><source src="'+success.url+'"></video></div><div class="tools" style="display:none;"><a href="#" class="modal-play"><span class="fa fa-play"></span><span class="duration"></span></a><a href="#addtolibrary" class="open"><span class="fa fa-eye"></span><span>Open</span></a><a href="#addtolibrary" class="add-to-cnavans-start"><span class="fa fa-plus-circle"></span><span>Add To<br>Canvas</span></a></div></div></li>');
                var videos = document.getElementById('video_'+success.id+'');
                videos.addEventListener('loadedmetadata', function() {
                    $(videos).parent().next().find('.duration').text(video.toMMSS(videos.duration));
                    var element_last = $('#video-start___modal .user-videos ul li').last();
                    element_last.find('.tools').show();
                    element_last.find('.thumb').show();
                    element_last.find('.loding').remove();
                });
            }else{
                alert("server error")
            }
        },
        sending:function(file,data,token){
            $('#video-start___modal').find('.user-videos ul').append('<li><div class="item"><div class="page" style="margin: 60px auto; width:80px;"> <div class="clearfix"><div id="custom" class=" dark blue small animate"></div></div></div></div></li>');
        }
    })


    $.each($('.element-color'),function(key,value){
       element_color(value);
    });


    $( window ).resize(function() {
        $(".video___file").each(function(i,e){
            var canvas = $(e).find('canvas');
            if(canvas.length){
                $(e).parents('.current-slide').css({ position: "absolute", visibility: "hidden", display: "block" });
                canvas.css('width',$(e).width());
                $(e).parents('.current-slide').css({ position: "", visibility: "", display: "none" });
            }
        });
        $('.app-middle .active-slide').css({ display: "block" });
    })
});


function Video(){
    this.modal = '',
    this.VideoData = '';
    this.currentTime = 0;
    this.videoLengthFull = false;
    this.ui = false;
    this.setInterval = 0;
    this.videoLength = 0;
    this.cropEditor = $('.video-container');
    this.slider = $('.app-middle');
    this.videocloudsuite = {};
    this.scroll = false;
    this.start_modal = $('#video-start___modal');
    this.search_modal = $('#video-search___modal');
    this.recursion = true;
}

Video.prototype.trimingPopUp = function() {
    var video_url=this.VideoData,
        _this = this;

    if(video_url){
        if(_this.modal == 'search'){
            _this.search_modal.modal('hide');
        }else if(_this.modal == 'start'){
            _this.start_modal.modal('hide');
        }

        $('.modal-window').show();
        $('.video-trimmer .loding').show();
        // var srt ='<video id="preview-player" preload="auto" style="width:100%;height:400px;display:none;">'+ /* IgorKiev 2016-05-05 */
        var srt ='<video id="preview-player" preload="auto" autoplay="false" style="width:100%;height:100%;display:none;padding: 0 20px;">'+
            '<source src="'+video_url+'" type="video/mp4">'+
            '</source>'+
            '</video>';
        this.cropEditor.prepend(srt);
        _this.videoId = document.getElementById('preview-player');
        _this.videoId.addEventListener('loadeddata', function(){
            if(_this.videoId.duration >= _this.videoLength){
                _this.videoLengthFull = Math.round(_this.videoId.duration);
                _this.get_play();
            }else{
                alert('The duration of this video is smaller than required');
                $('.triming_popu_clos').click();
            }
        }, false);

    }else{
        alert('Error');
    }
};

Video.prototype.handleFileSelect = function(blob){
    this.VideoData = blob;
    this.trimingPopUp();
};

Video.prototype.hidePopu = function(){
    clearInterval(this.setInterval);
    this.cropEditor.find('#preview-player').remove();
    if($('#progressbar span').length)
        $('#progressbar').progressbar("destroy");
    if($('#slider span').length)
        $('#slider').slider("destroy");
    this.ui = 0;
    this.currentTime = 0;
    $('#video_file').val('');
};

Video.prototype.get_play = function() {
    var _this = this;
    var  width = Math.round(100*this.videoLength/this.videoLengthFull)+1;
    this.video_editor();

    $('.ui-slider-handle').addClass('select-segment')
        .append('<i class="fa fa-circle fa-lg left"></i>')
        .append('<i class="fa fa-circle fa-lg right"></i>')
        .css('width',width+'%').css('top','-8px').css('cursor','-webkit-grab');
    this.timer();
    this.Width = width*10;
    this.srroll_player();
    $('#preview-player').css('display','block');
};

Video.prototype.video_editor = function() {
    var _this = this;
    _this.scrollbar = $( "#slider" ).slider({
        value:0,
        max: 1000,
        stop: function( event, ui ) {
            _this.currentTime = Math.round((ui.value*_this.videoLengthFull)/1000);
            _this.ui = ui.value;
            _this.srroll_player();
            _this.timer();
        },
        start:function(event, ui){
            clearInterval(_this.setInterval);
            _this.videoId.pause();

        },
        change: function( event, ui ) {
        },
        slide: function( event, ui ) {
            var x =ui.value - (_this.Width/2);
            if(x > 0 && x <= 1000-_this.Width){
                $( "#slider" ).slider({value:x,max:1000});
                return false;
            }else if(x > 1000-_this.Width){
                $( "#slider" ).slider({value:1000-_this.Width,max:1000});
                return false;
            }else{
                $( "#slider" ).slider({value:0,max:1000});
                return false;
            }
        }
    });
};

Video.prototype.srroll_player = function() {
    $('.video-trimmer .loding').show();
    $( "#slider" ).slider( "disable" );
    $('.disable').css('z-index','1');
    var timelistener;
    var _this = this;
    var sett = this.videoLength*1000/this.Width;
    var i = 1;
    if(_this.videoId){
        _this.videoId.currentTime = _this.currentTime;
        _this.videoId.play();
        _this.videoId.addEventListener('timeupdate', function() {
            if(i == 1){
               $('.video-trimmer .loding').hide();
                $( "#slider" ).slider( "enable" );
                $('.disable').css('z-index','-1');

                var progress = _this.ui;
                _this.setInterval = setInterval(function(){
                    $("#progressbar" ).progressbar({value: progress, max:1000,});
                    progress++;
                    if(progress == _this.ui+_this.Width-10){
                        clearInterval(_this.setInterval);
                        _this.videoId.pause();
                    }
                },sett);
            };
            i++;
        },false);
    }else{
        return false;
    }
};

Video.prototype.timer = function(){
    $('.time_position p').text(this.toHHMMSS(this.currentTime));
    $('.triming_tim').text(this.toHHMMSS(this.currentTime)+'/'+this.toHHMMSS(this.currentTime+this.videoLength));
};

Video.prototype.toHHMMSS = function (time) {
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

Video.prototype.InsertedTempladeData = function(url,start_time,duration){
    var slide_position = this.slide_id,
        video_id = this.video_id,
        slide_id = $(".image-container[data-id="+slide_position+"]").data('slideid');
    if(this.mixed == true){
        if(!slide_position || !video_id) {throw('no slide positon or video id')}
        if(url.length ){
            if (!InsertedTempladeData[slide_position] )InsertedTempladeData[slide_position] = {};
            if (!InsertedTempladeData[slide_position][slide_id] )InsertedTempladeData[slide_position][slide_id] = {};
            if (!InsertedTempladeData[slide_position][slide_id]["mixed-media"] ) InsertedTempladeData[slide_position][slide_id]["mixed-media"] = {};
            if (!InsertedTempladeData[slide_position][slide_id]["mixed-media"][video_id]) InsertedTempladeData[slide_position][slide_id]["mixed-media"][video_id] = {};
            InsertedTempladeData[slide_position][slide_id]["mixed-media"][video_id]['value'] = url;
            InsertedTempladeData[slide_position][slide_id]["mixed-media"][video_id]['start_time'] = start_time;
            InsertedTempladeData[slide_position][slide_id]["mixed-media"][video_id]['duration'] = duration;
        }else{
            delete  InsertedTempladeData[slide_position][slide_id]["mixed-media"][video_id];
        }
    }else{
        var element = $(".image-container[data-id="+slide_position+"] .validate-video");
        if(!slide_position || !video_id) {throw('no slide positon or video id')}
        if(url.length ){
            if (!InsertedTempladeData[slide_position] )InsertedTempladeData[slide_position] = {};
            if (!InsertedTempladeData[slide_position][slide_id] )InsertedTempladeData[slide_position][slide_id] = {};
            if (!InsertedTempladeData[slide_position][slide_id]["video"] ) InsertedTempladeData[slide_position][slide_id]["video"] = {};
            if (!InsertedTempladeData[slide_position][slide_id]["video"][video_id]) InsertedTempladeData[slide_position][slide_id]["video"][video_id] = {};
            InsertedTempladeData[slide_position][slide_id]["video"][video_id]['value'] = url;
            InsertedTempladeData[slide_position][slide_id]["video"][video_id]['start_time'] = start_time;
            InsertedTempladeData[slide_position][slide_id]["video"][video_id]['duration'] = duration;
        }else{
            delete  InsertedTempladeData[slide_position][slide_id]["video"][video_id];
        }

            var count = Object.keys(InsertedTempladeData[slide_position][slide_id]["video"]).length,
                max_count = Object.keys(TemplateData[slide_id]["video"]).length;
            element.html(count + "/" + max_count);
            this.slider.find('[data-id="'+(slide_position)+'"] [data-vidpk="'+video_id+'"]')
                .removeClass('empty')
                .addClass('exist');
            $('.modal-window').hide();
    }
        peercents();
        selected_slide();
};

Video.prototype.getVideoPixabay = function(serarch_kw,count,categories){
    var _this = this;
    $.ajax({
        type:"POST",
        url: "/editor/pixabay",
        data:{kw:serarch_kw,page:count,categories:categories},
        dataType:'json',
        success:function(data){
            _this.recursion = true;
            if (data.hits.length > 0){
                console.log(data.hits);
                _this.showVideo(data.hits,0,'pixabay',0);
            }else{
                alert('No result, Please try again.');
                _this.search_modal.find('.loding').hide();
            }
        },
        error:function(err){
            console.log(err);
            _this.search_modal.find('.loding').hide();
        }
    })
};

Video.prototype.PixabayCategories =  function(){
    var pixabayCategories = ['fashion', 'nature', 'backgrounds', 'science', 'education', 'people', 'feelings', 'religion', 'health', 'places', 'animals', 'industry','food', 'computer', 'sports', 'transportation', 'travel', 'buildings', 'business', 'music'];
    $("#video-start___modal #categories").html('');
    $("#video-search___modal #categories").html('');
    $("#video-start___modal #categories").append('<option value="">Categories</option>');
    $("#video-search___modal #categories").append('<option value="">Categories</option>');
    $.each(pixabayCategories,function(i,v){
      $("#video-start___modal #categories").append('<option value="'+v+'">'+v+'</option>');
      $("#video-search___modal #categories").append('<option value="'+v+'">'+v+'</option>');
    })

    $("#video-start___modal #categories").selectpicker('refresh');
    $("#video-search___modal #categories").selectpicker('refresh');
}

Video.prototype.Videocloudsuite = function(serarch_kw,count,categories){
    var _this = this;
    $.ajax({
        type:"POST",
        url: "/editor/videocloudsuite",
        data:{kw:serarch_kw,page:count,categories:categories},
        dataType:'json',
        success:function(data){
            _this.recursion = true;
            if(data.length>0){
                _this.showVideo(data,0,'videocloudsuite',0);
            }else{
                _this.search_modal.find('.loding').hide();
            }
        },
        error:function(err){
            _this.search_modal.find('.loding').hide();
            console.log(err);
        }
    })
};

Video.prototype.VideocloudsuiteCategories =  function(){
    $.ajax({
        type:"POST",
        url: "/editor/videocloudsuite-category",
        dataType:'json',
        success:function(data){
            if(data){
                $("#video-start___modal #categories").html('');
                $("#video-search___modal #categories").html('');
                $("#video-start___modal #categories").append('<option value="">Categories</option>');
                $("#video-search___modal #categories").append('<option value="">Categories</option>');

                $.each(data,function(i,v){
                    $("#video-start___modal #categories").append('<option value="'+v.id+'">'+v.name+'</option>');
                    $("#video-search___modal #categories").append('<option value="'+v.id+'">'+v.name+'</option>');
                })

                $("#video-start___modal #categories").selectpicker('refresh');
                $("#video-search___modal #categories").selectpicker('refresh');
            }
        },
        error:function(err){
            console.log(err);
        }
    })
};

Video.prototype.toMMSS = function(time){
    var sec_num = parseInt(time, 10);
    var minutes = Math.floor((sec_num) / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
};

Video.prototype.showVideo = function(object,key,library,count){
    var _this = this;
    if(typeof object[key] != 'undefined' && _this.recursion){
        var id = false;
        var url = false;
        var duration = false;
        var element = $('#video-search___modal .video-search-list ul')
        if(library == 'pixabay' ){
            id = object[key].id;
            url = object[key].videos.small.url;
            duration = object[key].duration;
            poster = 'https://i.vimeocdn.com/video/'+object[key].picture_id+'_295x166.jpg';
            var success = true;
        }else if(library == 'videocloudsuite'){
            id = object[key].id;
            url = object[key].absoluteUrl;
            duration = object[key].duration;
            poster =  object[key].thumbnailUrl;
            var success = true;
        }
        if(id  && url && duration && success){
            element.append('<li style="display:none" class="hold-asp-ratio"><div class="item thumb asp-content"><div class="thumb"><video preload="none" poster="'+poster+'" id="video_'+id+'_'+key+'" style="height:auto;width:100%"><source src="'+url+'"></source></video><div class="tools"><a href="#" class="modal-play"><span class="fa fa-play"></span><span class="duration">'+_this.toMMSS(duration)+'</span></a><a href="#addtolibrary" class="open"><span class="fa fa-eye"></span><span>Open</span></a><a href="#addtolibrary" class="add-to-cnavans-search"><span class="fa fa-plus-circle"></span><span>Add To <br>Canvas</span></a></div></div></li>');
            my_videos = document.getElementById('video_'+id+'_'+key);
            count++;
            if(count <= object.length)
                _this.showVideo(object,key+1,library,count);
        }else{
            count++;
            if(count <= object.length)
                _this.showVideo(object,key+1,library,count);
        }
        if(count == object.length){
            if(element.find('li').length > 0)
                element.find('li').show();
            _this.search_modal.find('.loding').hide();
            this.scroll = true;
        }
    }
};

function element_color(value){
    var slide_id = $(value).parents('.current-slide').attr('data-id'),
        element_name = $(value).parents('.element___file').attr('data-element-name');

    $(value).ColorPicker({
        color: '#'+$(value).parent('.element___file').attr('data-color'),
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            var element_name = $(value).parent('.elements___file').attr('data-colorpk'),
                slide_position = $($(value).parents('.current-slide')).attr('data-id'),
                slide_id =  $(".image-container[data-id="+slide_position+"]").data('slideid');
            if(!slide_position || !element_name) {throw('no slide positon or element id')}
            if(hex.length ){
                $(value).parent('.elements___file').attr('data-color',hex);
                if (!InsertedTempladeData[slide_position] )InsertedTempladeData[slide_position] = {};
                if (!InsertedTempladeData[slide_position][slide_id] )InsertedTempladeData[slide_position][slide_id] = {};
                if (!InsertedTempladeData[slide_position][slide_id]["element"] ) InsertedTempladeData[slide_position][slide_id]["element"] = {};
                if (!InsertedTempladeData[slide_position][slide_id]["element"][element_name]) InsertedTempladeData[slide_position][slide_id]["element"][element_name] = {};
                InsertedTempladeData[slide_position][slide_id]["element"][element_name]['color'] = hex;
            }
        }
    });

}