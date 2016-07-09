/**
 * Created by aleksa on 2/16/16.
 */

$("document").ready(function(){

    $('#image___crop').on("shown.bs.modal",function(){
        crop.uploadPopUp.modal('hide');
        $("html").find("#loader-wrapper").remove();
    })

    $('#image___oldCrop').on("shown.bs.modal", function(){
        crop.cropPopUp.modal('hide');
        // crop.uploadPopUp.modal('hide');
    })


    if(typeof InsertedTempladeData == 'undefined'){
        InsertedTempladeData = {};
        DefaultInsertedTempladeData = {};
        $.each(TemplateData,function(i,v){
            InsertedTempladeData[i]={};
            InsertedTempladeData[i][i]={};
            DefaultInsertedTempladeData[i]={};
            DefaultInsertedTempladeData[i][i]={};
        });
    }else{
        DefaultInsertedTempladeData = {};
        $.each(InsertedTempladeData,function(positon_id,slide){
            $.each(slide,function(slide_id,v){
                if(typeof InsertedTempladeData[positon_id][slide_id]['inputs'] != 'undefined'){
                    DefaultInsertedTempladeData[positon_id]={};
                    DefaultInsertedTempladeData[positon_id][slide_id]={};
                    DefaultInsertedTempladeData[positon_id][slide_id]['inputs']={};

                    $.each(InsertedTempladeData[positon_id][slide_id]['inputs'],function(input_id,text){
                        DefaultInsertedTempladeData[positon_id][slide_id]['inputs'][input_id]={};
                        DefaultInsertedTempladeData[positon_id][slide_id]['inputs'][input_id]['value']=text.value;
                    });
                }
            });
        });
        peercents();
        selected_slide();
    }

    $("#add-to-canvas").click(function(){

        var data=crop.data,
            img=crop.get_selected_image();
            if(!img){
                alert('Please select image!');
                return false;
            }

        //Crop.prototype.saveIsertData = function(slide_id,img_id,data_name,data_path){
        crop.saveIsertData(data.pk,data.imgpk,img);
        $('#image___upload').modal('hide');


    });

    $(".swiper-slide-active").removeClass("disabled");

    $('.current-slide > img ').attr('src', $('.slider-images .image-container:first-of-type > img').attr('src'));
    $('.current-slide').hide();
    $('.current-slide[data-id="1"]').addClass('active-slide').show();

    var slideId = 0;
    $(document).on("click", "a.text-editor", function(){
        slideId = $(this).data('pk');

        // IgorKiev 2016-05-14
        console.log('a.text-editor click');
        var inpLength = $(this).data('maxlength'),
            openedPopover = $('.popover.in');

        // to limit popover's text input max length
        openedPopover.find('.form-control').attr('maxlength', inpLength);

        // If popover goes out of the top screen edge
        if (openedPopover.offset().top < 0) { openedPopover.css('top', 10); }
    });

    $(document).on('click', '.edit', function(){
        $('body').append('<div id="loader-wrapper" style="opacity: 0.8"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
        if($(crop.uploadPopUp).find('.thumb-img.selected img').length == 0){
            $('.image-error').html('Please select image.').fadeIn('slow');
            setTimeout(function(){ $('.image-error').fadeOut('slow'); }, 2000);
        }else{
            var img_url = $('.all_pic div.selected img').attr('src');
            crop.cropPopUp.attr('data-pk',crop.uploadPopUp.attr('data-pk'));
            $('#image___crop .modal-dialog').css({'max-width':'95%', 'margin': "0 auto" });
            $('#image___crop .modal-footer').css('background', 'rgba(0,0,0,0.7)');
            $('#image___crop img#old').attr('src', img_url);
            $('#image___crop').modal('show');
            $('#image___upload').modal('hide');
            crop.cropingPopUp();
            //$('#loader-wrapper').remove();
        }
    });

    $(document).on('click', '.addToCanvas', function(){
        if($(crop.uploadPopUp).find('.thumb-img.selected img').length == 0){
            $('.image-error').html('Please select image.').fadeIn('slow');
            setTimeout(function(){ $('.image-error').fadeOut('slow'); }, 2000);
        }else{
            var img_id = crop.uploadPopUp.attr('data-pk'),
                slide_id = $('.current-slide.active-slide').data('id'),
                data_path = 'public'+$(crop.uploadPopUp).find('.thumb-img.selected img').attr('src'),
                data_name = $(crop.uploadPopUp).find('.thumb-img.selected img').attr('src').replace('/upload/','');
                crop.saveIsertData(slide_id,img_id,data_path);
                crop.uploadPopUp.modal('hide');
        }

    });




    $(document).on('click', '.get-back', function(){
        $('body').append('<div id="loader-wrapper" style="opacity: 0.8"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
        if(!$(this).attr('data-back')){
            crop.uploadingPopUp();
            $('#loader-wrapper').remove();
        }else{
            $('#loader-wrapper').remove();
            crop.cropPopUp.modal('hide');
            crop.oldCrop.modal('hide');
            $('#images-search___modal').modal("show");
        }
    });
    $(document).on('click','.all_pic .thumb-img',function(){
        $('.all_pic .thumb-img').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on('click','.thumb-add',function(){
        $('#origin_img').click();
    });
    $(document).on('change','#origin_img',function(){
        var form_data = new FormData($('#origin_img_form').get(0));
        form_data.append('template_id', $("#video-editor").data('templateid'));
        crop.checkImageSize(this,form_data);
    });




    window.editor = new Editor($('.text-editor'));

    $('.text-editor').on('shown',function(e, editable){
        editor.show(e,editable);
    });

    $('.text-editor').on('hidden',function(e, reason){
        editor.hide();
    });

    $(document).on('input','.editable-input .form-control',function(e){
        editor.charChanges(e);
    });

    $(document).on('click','.editable-clear-x',function(e){
        editor.inputClear(e);
    });




    window.slider = new Slider($('.swiper-wrapper'));

    $('.image-container[data-id=1] .slide-img > img').addClass('active-swiper-slide');

    $(document).on('click', '.image-container', function(){

        var id = $(this).attr('data-id');
        var active_slide_id = $('.current-slide.active-slide').attr('data-id');

        if (id !== active_slide_id){
            slider.changeSlide(id);
        }

        // $('.current-slide').hide();
        // $('.current-slide[data-id="'+id+'"]').show();
    });

    $(document).on('click','.delete_slide',function(e){
        var element = $(this).parents('.image-container'),
            slideId = element.data('id'),
            slide_id = false,
            slid = $('.current-slide[data-id="'+slideId+'"]');

        element.remove();
        $('.app-middle').find('div[data-id="'+slideId+'"]').remove();
        delete_slide(slideId);
        if(slider.currentSlideId == slideId){
            if($('.image-container[data-id="'+slideId+'"]').length){
                slider.changeSlide(slider.currentSlideId);
            }else{
                slider.changeSlide($('.image-container').last().data('id'));
            }

            var slid = $('.current-slide[data-id="'+slideId+'"]');
            if($(slid.prev()).length == 0){
                slide_id = $(slid.next()).data('id');
                // slider.changeSlideById(slide_id);
            }else{
                slide_id = $(slid.prev()).data('id');
                // slider.changeSlideById(slide_id);
            }
        }
        if(slide_id){
            slider.changeSlide(slide_id);
        }
        e.stopPropagation();
    });

    $('.example___video').click(function(){
        $('#example___video').modal('show');
    });

    // var voice = new Voice();

    $(document).on('click','.image___voice',function(){
        $('#voice___upload').modal('show');
        $('#voice___upload').attr('data-voicepk',$(this).attr('data-voicepk'));
    })

    $('#voice___upload').on('hide.bs.modal', function (e) {
        voice.closePopUp();
    })

    $(document).on("click", "#record:not(.disabled)", function(e){
        voice.record(e);
    });

    $(document).on("click", "#play:not(.disabled)", function(e){
        voice.stop(e);
    });

    $(document).on("click", "#pause:not(.disabled)", function(e){
        if($(this).hasClass("resume")){
            voice.resume();
            $(this).replaceWith('<a class="btn button one" id="pause">Pause</a>');
        }else{
            voice.pause();
            $(this).replaceWith('<a class="btn button one resume" id="pause">Resume</a>');
        }
    });

    $(document).on('click', '.confirm-voice-trimming-static', function(e){
        var selected_music = $('#audio-start___modal .music-list').find('.music-selected-static');
        if(selected_music.length){
            var music_id = selected_music.attr('data-music-id');
                music_url = $('#user-music-wavesurfer-'+music_id).attr('data-music-url');

            $('#audio-start___modal').modal('hide');
            $('#music-wraper .modal-window-music').show();
            musicTrim.trimingPopUp(music_url);
        }else{
            voice.confirm();
        }
    })

    window.music = new Music();

    $(document).on('click','#audio-search___modal-button',function(){
        // $('#audio-search___modal').modal('show');
        $('#audio-start___modal').modal('show');
    })

    $('#audio-search___modal').on('shown.bs.modal', function (e) {
        music.load();
    })

    $('#audio-start___modal').on('shown.bs.modal', function (e) {
        music.userMusicLoad();
    })

    $('#audio-search___modal').on('hide.bs.modal', function (e) {
        music.closePopUp();
    })

    $(document).on('click','.pause-icon,.play-icon',function(){
        music.playPause($(this).attr('data-music-id'));
    })

    // $(document).on('click','.add_music', function(e){
    //     if($(this).find('.fa-times').length){
    //         $(this).parents('.search-section').find('.fa-times').removeClass('fa-times').addClass('fa-plus-circle');
    //         $(this).parents('.search-section').find('.music-hover').remove();
    //         $(this).removeClass('music-selected-static');
    //         delete InsertedTempladeData['music'];
    //     }else{
    //         $(this).parents('.search-section').find('.fa-times').removeClass('fa-times').addClass('fa-plus-circle');
    //         $(this).find('em').removeClass('fa-plus-circle').addClass('fa-times');
    //         $(this).parents('.search-section').find('.music-hover').remove();
    //         $(this).parents('.item').append('<div class="music-hover"></div>');
    //         $(this).parents('.search-section').find('.add_music').removeClass('music-selected-static');
    //         $(this).addClass('music-selected-static');
    //     }
    // })

    // $(document).on('click','.select_music', function(e){
    //     if($(this).find('.fa-times').length){
    //         $(this).parents('.user-audio').find('.fa-times').removeClass('fa-times').addClass('fa-plus-circle');
    //         $(this).parents('.user-audio').find('.music-hover').remove();
    //         $(this).removeClass('music-selected-static');
    //     }else{
    //         $(this).parents('.user-audio').find('.fa-times').removeClass('fa-times').addClass('fa-plus-circle');
    //         $(this).find('em').removeClass('fa-plus-circle').addClass('fa-times');
    //         $(this).parents('.user-audio').find('.music-hover').remove();
    //         $(this).parents('.item').append('<div class="music-hover"></div>');
    //         $(this).parents('.user-audio').find('.select_music').removeClass('music-selected-static');
    //         $(this).addClass('music-selected-static');
    //     }
    // })

    $(document).on('click','.confirm-music-static',function(e){
        var music_id = $('#audio-search___modal').find('.music-selected-static').attr('data-music-id');
        InsertedTempladeData['music'] = music_id;
        $('#audio-search___modal').modal('hide');
    })
});

function Music(){
    this.element = $('.music-chart');
    this.wavesurfer = {};
    this.loaded = false;
    this.userMusicLoaded = false;
    this.wavesurfer['music'] = {};
    this.init();
}

Music.prototype.init = function(){
    var _this = this;

    $.each(this.element,function(i,v){
        var id = $(v).attr('id'),
            url = $(v).data('music-url');

        if(typeof _this.wavesurfer['music'][id] == 'undefined'){
            _this.wavesurfer['music'][id] = WaveSurfer.create({
                    container: '#'+id,
                    waveColor: '#48B2CE',
                    progressColor: '#2F8298'
                });
        }
    })

};

Music.prototype.load = function(){
    var _this = this;

    if(!this.loaded){
        $.each(this.element,function(i,v){
            var id = $(v).attr('id'),
                url = $(v).data('music-url');

            if(!$(v).hasClass('user-music')){
                _this.wavesurfer['music'][id].load(url);
                _this.wavesurfer['music'][id].on('finish',function(){
                    _this.finish(_this.wavesurfer['music'][id])   ;
                });
                _this.wavesurfer['music'][id].on('pause',function(){
                    _this.pause(_this.wavesurfer['music'][id])   ;
                });
                _this.wavesurfer['music'][id].on('play',function(){
                    _this.play(_this.wavesurfer['music'][id])   ;
                });
            }
        })

        this.loaded = true;
    }else{
        $.each(_this.wavesurfer['music'],function(i,v){
            if(v.getDuration()){
                v.zoom(0);
            }
        })
    }
};

Music.prototype.userMusicLoad = function(){
    var _this = this;

    if(!this.userMusicLoaded){
        $.each(this.element,function(i,v){
            var id = $(v).attr('id'),
                url = $(v).data('music-url');

            if($(v).hasClass('user-music')){
                _this.wavesurfer['music'][id].load(url);
                _this.wavesurfer['music'][id].on('finish',function(){
                    _this.finish(_this.wavesurfer['music'][id])   ;
                });
                _this.wavesurfer['music'][id].on('pause',function(){
                    _this.pause(_this.wavesurfer['music'][id])   ;
                });
                _this.wavesurfer['music'][id].on('play',function(){
                    _this.play(_this.wavesurfer['music'][id])   ;
                });
                _this.wavesurfer['music'][id].on('ready',function(e){
                    _this.wavesurfer['music'][id].zoom(0);
                });
            }
        })

        this.userMusicLoaded = true;
    }else{
        $.each(_this.wavesurfer['music'],function(i,v){
            if(v.getDuration()){
                v.zoom(0);
            }
        })
    }
};

Music.prototype.addById = function(id, url){
    var _this = this;

    _this.wavesurfer['music'][id] = WaveSurfer.create({
            container: '#'+id,
            waveColor: '#48B2CE',
            progressColor: '#2F8298'
        });

    _this.wavesurfer['music'][id].load(url);
    _this.wavesurfer['music'][id].on('finish',function(){
        _this.finish(_this.wavesurfer['music'][id])   ;
    });
    _this.wavesurfer['music'][id].on('pause',function(){
        _this.pause(_this.wavesurfer['music'][id])   ;
    });
    _this.wavesurfer['music'][id].on('play',function(){
        _this.play(_this.wavesurfer['music'][id])   ;
    });
};

Music.prototype.playPause = function(id){
    this.wavesurfer['music'][id].playPause();
};

Music.prototype.finish = function(e){
    $('[data-music-id="'+$(e.container).attr('id')+'"]').removeClass('pause-icon').addClass('play-icon');
};

Music.prototype.play = function(e){
    var _this = this;

    $.each(_this.wavesurfer['music'],function(i,v){
        if(v.isPlaying() && $(e.container).attr('id') != $(v.container).attr('id'))
            v.pause();
    })
    $('[data-music-id="'+$(e.container).attr('id')+'"]').removeClass('play-icon').addClass('pause-icon');
};

Music.prototype.pause = function(e){
    $('[data-music-id="'+$(e.container).attr('id')+'"]').removeClass('pause-icon').addClass('play-icon');
};

Music.prototype.closePopUp = function(){
    $.each(this.wavesurfer['music'],function(i,v){
        if(v.getCurrentTime()){
            v.stop();
        }
    })

    if(!InsertedTempladeData['music']){
        $('#audio-search___modal').find('.music-selected-static').removeClass('music-selected-static');
        $('#audio-search___modal').find('.music-hover').remove();
        $('#audio-search___modal').find('.fa-times').removeClass('fa-times').addClass('fa-plus-circle');
    }
};


function Voice(){
    this.pop_up = $('#audio-start___modal');
    this.audio = $("#audio");
    this.video = document.getElementById("voice_video");
    this.voiceStartedBool = false;
    this.voiceStopedBool = false;
    this.blob = '';
    this.slider = $('.video-slide').find('.main-slide');

    this.init();
}

Voice.prototype.init = function(element){
    var _this = this;
    this.video.addEventListener('ended',function(){_this.ended(_this)}, false);
};

Voice.prototype.ended = function(voice){
    voice.stop();
};

Voice.prototype.record = function(element){
    var _this = this;

    Fr.voice.record(false, function(data){
        _this.video.play();
        _this.voiceStartedBool = true;
        _this.voiceStopedBool = false;
        $(element.target).addClass("disabled");
        $(".one").removeClass("disabled");
    });
};

Voice.prototype.restore = function(element){
    $("#record, #live").removeClass("disabled");
    $("#pause").replaceWith('<a class="btn button one" id="pause">Pause</a>');
    $(".one").addClass("disabled");
    this.video.pause();
    this.voiceStop();
};

Voice.prototype.stop = function(element){
    var _this = this;

    Fr.voice.export(function(url,blob){
        _this.voiceStopedBool = true;
        _this.restore();
        _this.blob = blob;
        _this.audio.attr("src", url);
        _this.audio[0].play();
    }, "URL");
};

Voice.prototype.pause = function(){
    Fr.voice.pause();
};

Voice.prototype.resume = function(){
    this.video.play();
    Fr.voice.resume();
};

Voice.prototype.voiceStop = function(){
    Fr.voice.stop();
};

Voice.prototype.voiceStarted = function(){
    return this.voiceStartedBool;
};

Voice.prototype.closePopUp = function(){
    if(!this.voiceStopedBool)
        this.stop();

    this.audio[0].pause();
    this.video.pause();
};

Voice.prototype.confirm = function(){
    // if(!this.voiceStopedBool)
    //     this.stop();

    var _this = this,
        // slide_id = this.slider.slick('slickCurrentSlide') + 1,
        slide_id = 1,
        // voice_id = this.pop_up.attr('data-voicepk');
        voice_id = 1;

    var formData = new FormData();
    formData.append('file', this.blob);
    formData.append('template_id', 17);
    formData.append('slide_id', slide_id);
    formData.append('voice_id', voice_id);

    $.ajax({
        url: "/editor/voice-upload",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(data) {
            var slide_id = data.slide_id,
                voice_id = data.voice_id;

            // if('success' in data){
            //     _this.pop_up.modal('hide');
            //     _this.closePopUp();

            //     if(slide_id && voice_id) {
            //         if (InsertedTempladeData[slide_id] == undefined) {
            //             InsertedTempladeData[slide_id] = {};
            //         }
            //         if (InsertedTempladeData[slide_id]["voice"] ==  undefined) {
            //             InsertedTempladeData[slide_id]["voice"] = {};
            //         }
            //         if (InsertedTempladeData[slide_id]["voice"][voice_id] == undefined) {
            //             InsertedTempladeData[slide_id]["voice"][voice_id] = {};
            //         }

            //         InsertedTempladeData[slide_id]["voice"][voice_id]['name'] = data.name;
            //         InsertedTempladeData[slide_id]["voice"][voice_id]['path'] = data.path;

            //         _this.slider.find('[data-slick-index='+(slide_id - 1)+'] [data-voicepk='+voice_id+']')
            //             .removeClass('empty')
            //             .addClass('exist');
            //     }else{
            //         alert('Serve error , Please try again later!')
            //     }
            // }else{
            //     alert('Serve error , Please try again later!')
            // }
        }
    });
};

function Editor(element){
    this.elememt = element;
    this.init()
}

Editor.prototype.init = function(){
    $.fn.editable.defaults.mode = '';
    this.elememt.editable({
        name: 'slide[]',
        success:this.success
    });
};

Editor.prototype.success = function(response,newValue) {
    var slide_position = $(this).data('pk'),
        text_color = $('#chars-length').attr('data-color'),
        element = $(".image-container[data-id="+slide_position+"] .validate-inputs"),
        input_id = $(this).data('inputposition'),
        slide_id=$(".image-container[data-id="+slide_position+"]").data('slideid');
    if(!slide_position || !input_id) {throw('no slide positon or input id')}
    if(newValue.length ){
        if (!InsertedTempladeData[slide_position] )InsertedTempladeData[slide_position] = {};
        if (!InsertedTempladeData[slide_position][slide_id] )InsertedTempladeData[slide_position][slide_id] = {};
        if (!InsertedTempladeData[slide_position][slide_id]["inputs"] ) InsertedTempladeData[slide_position][slide_id]["inputs"] = {};
        if (!InsertedTempladeData[slide_position][slide_id]["inputs"][input_id]) InsertedTempladeData[slide_position][slide_id]["inputs"][input_id] = {};
        InsertedTempladeData[slide_position][slide_id]["inputs"][input_id]['value'] = newValue;
        InsertedTempladeData[slide_position][slide_id]["inputs"][input_id]['color'] = text_color;

        if (!DefaultInsertedTempladeData[slide_position] )DefaultInsertedTempladeData[slide_position] = {};
        if (!DefaultInsertedTempladeData[slide_position][slide_id] )DefaultInsertedTempladeData[slide_position][slide_id] = {};
        if (!DefaultInsertedTempladeData[slide_position][slide_id]["inputs"] ) DefaultInsertedTempladeData[slide_position][slide_id]["inputs"] = {};
        if (!DefaultInsertedTempladeData[slide_position][slide_id]["inputs"][input_id]) DefaultInsertedTempladeData[slide_position][slide_id]["inputs"][input_id] = {};
        DefaultInsertedTempladeData[slide_position][slide_id]["inputs"][input_id]['value'] = newValue;
    }


    var count = Object.keys(InsertedTempladeData[slide_position][slide_id]["inputs"]).length,
        max_count = Object.keys(TemplateData[slide_id]["inputs"]).length;

    element.html(count + "/" + max_count);
    $(this).css('color',text_color);
    $(this).data('color',text_color);
    peercents();
    selected_slide();

    }


Editor.prototype.show = function(e,editable) {

    var editable_input = $('.editable-input'),
        editable_buttons = $('.editable-container .editable-buttons'),
        maxlength = $(e.target).data('maxlength'),
        existing_color = ($(e.target).css('color'))?this.rgb2hex($(e.target).css('color')):"#0000ff";
    editable_input.find('input').css('color',$(e.target).data('color'));
    editable_input.attr('data-maxlength',maxlength);
    editable_input.parent().after('<div id="chars-length" class="help-block">'+editable.value.length+'/'+maxlength+'</div>');
    editable_buttons.append('<button type="button" id="colorSelector" class="btn red btn-c btn-sm editable-cancel"><i class="fa fa-tint"></i></button>');

    $('#colorSelector').ColorPicker({
        color: existing_color,
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('#chars-length').attr('data-color','#'+hex);
            editable_input.find('.form-control').css('color','#'+hex);
        }
    });
};

Editor.prototype.hide = function() {
        $('.colorpicker').hide();
        if($('.colorpicker').length >= 2)
            $('.colorpicker:eq(0)').remove();
};

Editor.prototype.rgb2hex = function(orig) {
    var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
};

Editor.prototype.charChanges = function(e) {
    var maxlength = $(e.target).parent().data('maxlength'),
        chsrts = $(e.target).val(),
        chartDiv = $('#chars-length');

    if (chsrts.length > maxlength) {
        chartDiv.parent().addClass('has-error');
    }else{
        chartDiv.parent().removeClass('has-error');
    }

    chartDiv.html(chsrts.length + '/' + maxlength);
};

Editor.prototype.inputClear = function(e) {
    var maxlength = $(e.target).parent().data('maxlength'),
        chartDiv = $('#chars-length');

    chartDiv.html('0/'+maxlength);
    chartDiv.parent().removeClass('has-error');
};



function Slider(silder){
    this.slider = silder;
    this.currentSlideId = 1;
    this.activeSlide = silder.find('[data-id=1]');
    // this.init();
}

Slider.prototype.changeSlideById = function(slideId) {

    $(".swiper-slide[data-slideid="+slideId+"]").removeClass("disabled");
    // this.saveSlideAllValue();
    $('.current-slide').hide().removeClass('active-slide');
    $('.current-slide[data-id="'+slideId+'"]').show().addClass('active-slide');
    this.currentSlideId = slideId;
    this.activeSlide = $(this.silder).find('[data-id='+slideId+']');
}

Slider.prototype.changeSlide = function(slideId) {
     var checkSlideId,
         active_slide_id;
         active_slide_id = $('.current-slide.active-slide').attr('data-id');
         if (slideId > active_slide_id){
            checkSlideId = active_slide_id;
         }else if(slideId < active_slide_id){
            checkSlideId = slideId;
         }

     if(this.validation(checkSlideId) && slideId == parseInt(checkSlideId, 10) + 1)
     {
        this.changeSlideById(slideId);
        $(".swiper-slide[data-id="+checkSlideId+"] .slide-img > img").removeClass("active-swiper-slide");
        $(".swiper-slide[data-id="+slideId+"] .slide-img > img").addClass("active-swiper-slide");
    //}
    }else if(parseInt(slideId, 10) <= parseInt(checkSlideId, 10)){
        this.changeSlideById(slideId);
        $(".swiper-slide[data-id="+active_slide_id+"] .slide-img > img").removeClass("active-swiper-slide");
        $(".swiper-slide[data-id="+slideId+"] .slide-img > img").addClass("active-swiper-slide");
     }else if(parseInt(slideId, 10) > parseInt(checkSlideId, 10) && (this.validation(parseInt(slideId, 10) - 1))){
        this.changeSlideById(slideId);
        $(".swiper-slide[data-id="+active_slide_id+"] .slide-img > img").removeClass("active-swiper-slide");
        $(".swiper-slide[data-id="+slideId+"] .slide-img > img").addClass("active-swiper-slide");
     }
}



Slider.prototype.validation = function(slide_id) {return true;
    if(slide_id == 0)
        return true;

    var bool = true,
        _this = this;

    if(typeof InsertedTempladeData[slide_id][slide_id] == 'undefined'
        || typeof InsertedTempladeData[slide_id][slide_id]['inputs'] == 'undefined') {

        this.showTextError(slide_id, 0);
        bool = false;
        alert("a");
    }else{
        var InsertedInputs = InsertedTempladeData[slide_id][slide_id]['inputs'],
            TemplateInputs = TemplateData[slide_id]['inputs'];

        $.each(TemplateInputs,function(index,vlaue){
            if( InsertedInputs[index] == undefined
                || InsertedInputs[index]['value'] == ''
                || InsertedInputs[index]['value'].length > TemplateInputs[index]['max']
            ){
                _this.showTextError(slide_id,index);
                bool = false;
            }
        });
    }
    if(typeof TemplateData[slide_id]['images'] != 'undefined' && TemplateData[slide_id]['images']){
        if(typeof InsertedTempladeData[slide_id][slide_id] == 'undefined'
            || typeof InsertedTempladeData[slide_id][slide_id]['images'] == 'undefined') {

            this.showImagesError(slide_id, 0);
            bool = false;
            alert("c");
        }else{
            var InsertedImages = InsertedTempladeData[slide_id][slide_id]['images'],
                TemplateImages = TemplateData[slide_id]['images'];

            $.each(TemplateImages,function(index,vlaue){
                if( InsertedImages[index] == undefined
                    || InsertedImages[index]['name'] == ''
                    || InsertedImages[index]['path'] == ''
                ){
                    _this.showImagesError(slide_id,index);
                    bool = false;
                }
            });
        }
    }
    if(typeof TemplateData[slide_id]['video'] != 'undefined' && TemplateData[slide_id]['video']){
        if(typeof InsertedTempladeData[slide_id][slide_id] == 'undefined'
            || typeof InsertedTempladeData[slide_id][slide_id]['video'] == 'undefined') {

            this.showVideosError(slide_id, 0);
            bool = false;
        }else{
            var InsertedVideo = InsertedTempladeData[slide_id][slide_id]['video'],
                TemplateVideo = TemplateData[slide_id]['video'];

            $.each(TemplateVideo,function(index,vlaue){
                if( InsertedVideo[index] == undefined
                    || InsertedVideo[index]['name'] == ''
                    || InsertedVideo[index]['path'] == ''
                ){
                    _this.showVideosError(slide_id,index);
                    bool = false;
                }
            });
        }
    }

    if(bool)
        return true;
    else
        return false;
}

Slider.prototype.saveSlideValue = function(slideId) {
    if (InsertedTempladeData[slideId] == undefined) {
        return false;
    }

    var data = {
        'templateData':JSON.stringify(InsertedTempladeData[slideId]),
        'template_id':$('.app').data('template-id'),
        'slide_id':slideId
    };
/*
    $.ajax({
        method:"POST",
        url: '/editor/silde-data-upload',
        data: data,
        success:function(data, status){
            if('success' in data)
            {
            }else{
                alert('Serve error , Please try again later!');
            }
        },
        error:function(err){
            console.log(err);
        }
    })*/
}

Slider.prototype.saveSlideAllValue = function() {return false;
    var data = {
        'templateData':JSON.stringify(InsertedTempladeData),
        'template_id':$('.app').data('template-id'),
        'UserVideosId':UserVideosId
    };

    $.ajax({
        method:"POST",
        url: '/editor/silde-all-data-update',
        data: data,
        success:function(data, status){
            if('success' in data)
            {
            }else{
                alert('Serve error , Please try again later!');
            }
        },
        error:function(err){
            console.log(err);
        }
    })
}

Slider.prototype.showTextError = function(slide_id,input_id) {
    var slideSelector = '.item-form a[data-pk="'+slide_id+'"]',
        i = 0;

    if(input_id == 0){
        $(slideSelector).addClass('editable-empty');

        var initiInterval = setInterval(function(){

            i++;
            $(slideSelector).addClass('editable-error');
            setTimeout(function(){  $(slideSelector).removeClass('editable-error'); }, 300);

            if(i == 3)
                clearInterval(initiInterval);

        },500);

    }else{

        $(slideSelector+'[data-inputposition="'+input_id+'"]').addClass('editable-empty');

        var initiInterval = setInterval(function(){
            i++;
            $(slideSelector+'[data-inputposition="'+input_id+'"]').addClass('editable-error');
            setTimeout(function(){$(slideSelector+'[data-inputposition="'+input_id+'"]').removeClass('editable-error'); }, 300);

            if(i == 3)
                clearInterval(initiInterval);

        },500);
    }
}


Slider.prototype.showImagesError = function(slide_id, image_id) {
    var slideSelector = '.item-form .image___file[data-pk="'+slide_id+'"]',
        i = 0;

    if(image_id == 0){
        $(slideSelector).addClass('empty');

        var initiInterval = setInterval(function(){

            i++;
            $(slideSelector+' div').addClass('editable-error');
            setTimeout(function(){  $(slideSelector+' div').removeClass('editable-error'); }, 300);

            if(i == 3)
                clearInterval(initiInterval);

        },500);

    }else{

        $(slideSelector+'[data-imgpk="'+image_id+'"]').addClass('empty');

        var initiInterval = setInterval(function(){
            i++;
            $(slideSelector+'[data-imgpk="'+image_id+'"] div').addClass('editable-error');
            setTimeout(function(){$(slideSelector+'[data-imgpk="'+image_id+'"] div').removeClass('editable-error'); }, 300);

            if(i == 3)
                clearInterval(initiInterval);

        },500);
    }
}

Slider.prototype.showVideosError = function(slide_id, video_id) {
    var slideSelector = '.item-form .video___file[data-pk="'+slide_id+'"]',
        i = 0;

    if(video_id == 0){
        $(slideSelector).addClass('empty');

        var initiInterval = setInterval(function(){

            i++;
            $(slideSelector+' div').addClass('editable-error');
            setTimeout(function(){  $(slideSelector+' div').removeClass('editable-error'); }, 300);

            if(i == 3)
                clearInterval(initiInterval);

        },500);

    }else{

        $(slideSelector+'[data-vidpk='+video_id+']').addClass('empty');

        var initiInterval = setInterval(function(){
            i++;
            $(slideSelector+'[data-vidpk='+video_id+'] div').addClass('editable-error');
            setTimeout(function(){$(slideSelector+'[data-vidpk='+video_id+'] div').removeClass('editable-error'); }, 300);

            if(i == 3)
                clearInterval(initiInterval);

        },500);
    }
}



$("#dropzone-music").dropzone({
    dictDefaultMessage: "DROP YOUR IMAGES HERE OR CLICK TO UPLOAD",
    previewTemplate:"",
    url:"/editor/dropzon-upload-music",
    acceptedFiles:"audio/*",
    addedfile: function (file) {
        // jQuery('#dropzone-music').append(jQuery("<input type='hidden' name='template_id' value='"+$('.app').attr('data-template-id')+"'>"));
    },
    thumbnail: function (file, dataUrl) {
       // $('#user-images-con').append('<div class="thumb-img"><i class="loding fa fa-circle-o-notch fa-spin"></i><img src="'+dataUrl+'"></div>');

      //  $('#user-images-con').find('ul').append('<li><div class="item"><div class="thumb thumb-img"> ' +
        //    '><i class="loding fa fa-circle-o-notch fa-spin"></i><img class="image_picker_image mCS_img_loaded" src="'+dataUrl+'"></div></div></li>');

       // console.log(dataUrl)
    },
    uploadprogress: function (file, progress, bytesSent) {
        //console.log(progress)
    },
    success:function(file,success){
        if(success.success){
            var ul_element = $('#audio-start___modal .user-audio ul'),
                li_count = parseInt(ul_element.find('>li:last .select_music').attr('data-music-id'));

            ul_element.append('<li style="width:247px;min-height: 128px;"><div class="item"><div id="user-music-wavesurfer-'+(li_count+1)+'" data-music-url="'+success.path+'" class="thumb music-chart user-music"></div><div class="tools"><div class="col1"> <span>'+success.original_name+'</span></div><div class="col2"><a href="#"><span><em class="fa fa-cog"></em></span></a><a data-music-id="'+(li_count+1)+'" class="select_music"><span><em class="fa fa-plus-circle"></em></span></a></div></div><div data-music-id="user-music-wavesurfer-'+(li_count+1)+'" class="play-icon"></div></div></li>');
            music.addById('user-music-wavesurfer-'+(li_count+1), success.path);
        }else{
            alert("server error")
        }


    },
    sending:function(file,data,token){
    }




})

