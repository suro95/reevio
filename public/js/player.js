$("document").ready(function() {

    $('.video_new').css('cursor', 'pointer');

    window.play = true;
    $(document).on("click", '.video_new,.play_button_v_d', function() {
        $('.play_button').removeAttr("data-hide");
        $(".video-spinner").removeClass("anim");

        if($(this).find('.fa').hasClass('fa-play') && $(this).parents('.asp-content').find('video').length == 0){
            $('.asp-content video').remove();
            $('.asp-content .cover-image').show();

            var cover_images =  $(this).parents('.asp-content').find('.cover-image');
            cover_images.after('<video src="'+cover_images.attr('data-video-src')+'" id="'+cover_images.data('video-id')+'" poster="'+cover_images.attr('src')+'" data-play="false" class="video_new video_new_id" preload="none" type="video/mp4"></video>');
            cover_images.hide();
        }

        /* add loading icon before video plays */
        var video = $(this).prev("video");
        //console.log(video);
        var vid = document.getElementById(video.attr("id"));

        var _this = $(this),
            data_procgress = video.attr('data-procgress');

        $('.video_new').removeAttr("data-procgress");

        _this.parent().find(".video-spinner").addClass("anim");
        _this.parent().find(".play_button").attr("data-hide", "true");            

        $('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');

        vid.ontimeupdate = function(){
            $(this).attr('data-procgress', 'true');
            $(".video-spinner").removeClass("anim");
            $(".play_button").removeAttr("data-hide");
        }
        vid.onpause = function(){
            $(this).attr('data-progress', false);
            $(".video-spinner").removeClass("anim");
            $(".play_button").removeAttr("data-hide");
        }

        window.play = false;
        if ($(this).context.tagName == 'DIV') {
            this_id = $(this).prev().attr('id');
        } else if ($(this).context.tagName == 'VIDEO') {
            this_id = $(this).attr('id');
        }

        $.each($('.video_new'), function(key, value) {
            var id = $(value).attr('id');
            var video = document.getElementById(id);

            if (video.paused == false && id == this_id && video.currentTime > 0) {
                $(value).siblings('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');

                video.pause();

            }else if (video.paused && id == this_id) {
                $(value).siblings('.play_button').find('.fa').removeClass('fa-play').addClass('fa-pause');

                video.play();
                video.addEventListener("timeupdate", function(){
                    window.play = true;
                });
            } else if (video.paused == false && video.currentTime > 0) {
                $(value).siblings('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');

                video.pause();
                video.load();

            }else if (video.currentTime > 0 && id != this_id) {
                $(value).siblings('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');

                video.pause();
                video.load();
            }
        });

        // Change icon after a video ends
        var this_ovarlay = $(this);
        this_ovarlay.siblings('video').on('ended', function() {
        	console.log('video ended');
            var id = this_ovarlay.prev('video').attr('id');
            document.getElementById(id).load();
        	this_ovarlay.find('.fa').removeClass('fa-pause').addClass('fa-play');
        });
    });


    $(document).on("click", '.myvideo-js,.play_button_m_v', function() {
        $('.play_button').removeAttr("data-hide");
        $(".video-spinner").removeClass("anim");

        if($(this).find('.fa').hasClass('fa-play') && $(this).parents('.asp-content').find('video').length == 0){
            $('.asp-content video').remove();
            $('.asp-content .cover-image').show();

            var cover_images =  $(this).parents('.asp-content').find('.cover-image');
            cover_images.after('<video data-setup="'+cover_images.data('setup')+'" src="'+cover_images.attr('data-video-src')+'" id="'+cover_images.data('video-id')+'" poster="'+cover_images.attr('src')+'" data-play="false" class="myvideo-js center-play" preload="none" type="video/mp4"></video>');
            cover_images.hide();
        }

        /* add loading icon before video plays */
        var video = $(this).prev("video");
        var vid = document.getElementById(video.attr("id"));
        var _this = $(this),
            data_procgress = video.attr('data-procgress');

        $('.video_new').removeAttr("data-procgress");

        // if(!video.attr("data-play")){
            _this.parent().find(".video-spinner").addClass("anim");
            _this.parent().find(".play_button").attr("data-hide", "true");

            //pause all
           // $("video").each(function(){
           //   var item = document.getElementById($(this).attr("id"));
           //   if(item.getAttribute("id") != vid.getAttribute("id")){
           //      item.pause();
           //   }
           // })

        // }
        $('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');

        vid.ontimeupdate = function(){
            $(this).attr('data-play', 'true');
            $(".video-spinner").removeClass("anim");

        }
        vid.onpause = function(){
            $(this).attr('data-play', false);
            $(".video-spinner").removeClass("anim");
            $(".play_button").removeAttr("data-hide");
        }



        if ($(this).context.tagName == 'DIV') {
            this_id = $(this).prev().attr('id');
        } else if ($(this).context.tagName == 'VIDEO') {
            this_id = $(this).attr('id');
        }

        $.each($('.myvideo-js'), function(key, value) {
            var id = $(value).attr('id');
            var video = document.getElementById(id);
            if (video.paused == false && id == this_id && video.currentTime > 0) {

                video.pause();

                $(value).siblings('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');
            }else if (video.paused && id == this_id) {

                video.play();
                video.addEventListener("timeupdate", function(){
                    window.play = true;
                });

                $(value).siblings('.play_button').find('.fa').removeClass('fa-play').addClass('fa-pause');
            } else if (video.paused == false && video.currentTime > 0) {

                video.pause();
                video.load();
                $(value).siblings('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');

            }else if (video.currentTime > 0 && id != this_id) {

                video.pause();
                video.load();
                $(value).siblings('.play_button').find('.fa').removeClass('fa-pause').addClass('fa-play');
            }
        });

        var this_ovarlay = $(this);
        this_ovarlay.siblings('video').on('ended', function() {
            console.log('video ended');
            var id = this_ovarlay.prev('video').attr('id');
            document.getElementById(id).load();
            this_ovarlay.find('.fa').removeClass('fa-pause').addClass('fa-play');
        });
    });

        // $(window).scroll(function() {
    //     if(window.location.pathname == '/video-designs'){
    //         if ($(this).scrollTop() + $(this).innerHeight() >= $('body')[0].scrollHeight) {
    //             var id = $('.thumb-list li ').last().find('.thumb').data('count') + 1;
    //             if($('.grid.thumb-list').data('scroll')){
    //                 $('div.loading-icon').show();
    //                 $.post("/video-designs-load-more", { id: count }).done(function(data) {
    //                     if (data.success) {
    //                         if(data.data.length < 20){
    //                             $('.grid.thumb-list').data('scroll',false).attr('data-scroll',false);
    //                         }
    //                         setTimeout(function() {
    //                             $('div.loading-icon').hide();
    //                                 var length = data.data.length - 1;
    //                                 var i = count;
    //                                 $.each(data.data, function(key, value) {
    //                                     // var str = '<li class="li" data-id="' + value.id + '" ><figure><div class="thumb" data-count="' + i + '"><div class="vd-thumb hold-asp-ratio"><div class="asp-content"><video id="preview-player' + value.id + '" data-play="false" preload="none" poster="/templates' + value.cover_photo + '" class="video_new" style="cursor: pointer;"><source src="/templates' + value.file_name + '" type="video/mp4"></video><div class="play_button"><span><i class="fa fa-play"></i></span></div></div></div><div class="info"><div class="inner"><div class="col"><a href="/editor/' + value.id + '" class="name">'+value.name+'</a></div></div></div></div></figure></li>';
    //                                     // var li = $('.thumb-list').append(str);
    //                                     i++;
    //                                     window.count = i;
    //                                     userVideos.add([
    //                                         {id:value.id,thumb:i,video_new_id:'preview-player'+value.id,video_new:'/templates'+value.cover_photo,source:'/templates'+value.file_name,name: value.name,category_id:value.templates_category_id}
    //                                     ]);
    //                                 });
    //                                 //userVideos.reIndex();
    //                         }, 500);
    //                     }else{
    //                         $('div.loading-icon').hide();
    //                         $('.grid.thumb-list').data('scroll',false).attr('data-scroll',false);
    //                     }
    //                 });
    //             }
    //         }
    //     }
    // });
    window.scroll = true;
    var pop_up_div = '';

    $(window).scroll(function() {
        if(window.location.pathname == '/video-designs' && window.scroll){
            if ($(this).scrollTop() + $(this).innerHeight() >= $('body')[0].scrollHeight) {
                var length = $('.thumb-list li ').length;
                $('div.loading-icon').show();
                setTimeout(function() {
                    var video_id = $('.mg-target:visible').data('video');

                    if($('.mg-space.mg-space-open').length)
                        pop_up_div = $('.mg-space.mg-space-open').clone();

                    userVideos.show(0, length+12);
                    row_id = $('.show_grid[data-id="'+video_id+'"] a').parents('.mg-row').attr('data-row');
                    $('#videos-list li[data-row="'+row_id+'"]:last').after(pop_up_div);
                    $('.mg-space.mg-space-open').show();
                    $('div.loading-icon').hide();

                    update_page(length,true);
                    updateIds();
                    videosName();
                },500)


            }
        }
    });

    $(document).on("click", '.filter_category', function() {
        var category_id = $(this).data('id');

        if(category_id == 0){
            userVideos.search('',['category_id']);
            update_page()
        }else{
            userVideos.search(category_id,['category_id']);
            update_page()
        }

        $('.link-custom').click();
        getCategory(category_id);
    });

    $(document).on("submit", '#search-kw', function(e) {
        e.preventDefault();
        var search = $('.search').val();
            userVideos.search(search,['name']);
        update_page();
        return false;
    });

    $(document).on("click", '.sort_newest', function() {
        userVideos.sort('newest', { order: "desc" });
        update_page()
    });

    $(document).on("click", '.sort_all', function() {
        userVideos.sort('newest', { order: "asc" });
        update_page()
    });

    // userVideos.on('updated',function(){
    //     $('div.loading-icon').hide();
    //     console.log(88888888888);
    //     if(($('.thumb-list li ').length/12) % 1 != 0){
    //         window.scroll = false
    //     }
    // });

    function update_page(length,pop_up_div){
        videosName();
        $('.st-header').remove();
        // $('.mg-space-init').mgSpace();
        window.scroll = true;
        if(!length)
            $('div.loading-icon').hide();
        if(($('.thumb-list .li').length/4) % 1 != 0){
            window.scroll = false;
        }

        // $('.mg-target').hide();
        if(!pop_up_div){
            $.each($('.mg-target:visible'),function(i,v){
                var video_id = $(v).data('video');
                $('.show_grid[data-id="'+video_id+'"] a').click();
            })
        }
        $('.sherch-count').html(userVideos.matchingItems.length+' Videos');
    }

    function getCategory(id){
        if(!id) return false;

        $.ajax({
            url: "/editor/get_category",
            type: 'POST',
            data: {category_id : id},
            async:false,
            success: function(data) {
                if('success' in data){
                    $('.container.page-content.pgc-sm.section-template').removeClass (function (index, css) {
                        return (css.match (/st-\S+/g) || []).join(' ');
                    });
                    $('.st-header').remove();
                    var color_class = 'st-'+data.category.color,
                        str = '<div class="st-header"><span class="sth-title">'+data.category.name+'</span><p>'+data.category.description+'</p><a href="#" class="btn btn-default btn-view">View More</a></div>'
                    $('.container.page-content.pgc-sm.section-template').addClass(color_class).prepend(str);
                }
            }
        });
    }

    function tog(v){return v?'addClass':'removeClass';}
    $(document).on('input', '.clearable', function(){
        $(this)[tog(this.value)]('x');
    }).on('mousemove', '.x', function( e ){
        $(this)[tog(this.offsetWidth-55 < e.clientX-this.getBoundingClientRect().left)]('onX');
    }).on('touchstart click', '.onX', function( ev ){
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
        $('.search-btn').click()
    });
})

