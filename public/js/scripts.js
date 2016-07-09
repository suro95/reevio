/*!
 *
 * Angle - Bootstrap Admin App
 *
 * Version: 3.1.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

(function ($) {
    'use strict';

    if (typeof $ === 'undefined') {
        throw new Error('This site\'s JavaScript requires jQuery');
    }

    // cache common elements
    var $win = $(window);
    var $doc = $(document);
    var $body = $('body');
    var $width = $win.width();


    //slick slider

    $('.template-view').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.template-list',
        infinite: false,
        draggable: false
    });
    $('.template-list').slick({
        slidesToShow: 5,
        asNavFor: '.template-view',
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        infinite: false,
        swipeToSlide: true
    });

    $('.slick-slide').click(function () {
        $(this).siblings('.slick-current').removeClass('slick-current');
        $(this).addClass('slick-current');

        $('div.slide-fields').hide();
        $('div#slide-fields-'+ $(this).data('slide')).show();
    });


    //custom scrollbar
    $('.sound_selector .tab-pane').mCustomScrollbar({
        setHeight: 230,
        axix: "y",
        theme: "3d-thick"
    });

    // audio button upload
    $('#upload_audio_btn').click(function () {
        var $pills = $('.sound_selector .nav-pills');

        $pills.find('.active').removeClass('active');
        $pills.find('.audio').addClass('active');
    });

    // show video pop-up
    $(document).on("click",".fa-eye",function(e){
        $.each( $('.thumb-list video'), function( key, value ) {
            var id = $(value).attr('id');

            if(document.getElementById(id).paused == false || document.getElementById(id).currentTime > 0){
                document.getElementById(id).pause();
            }
        });
        var src = $(this).parents('.thumb').find('source').attr('src');
        $('#show-video .modal-body').html('<video  autoplay="true" preload="auto" controls width="100%" height="100%"><source src="'+src+'" type="video/mp4"></video>');
        $('#show-video').modal('show');
    });

    // hide video pop-up
    $(document).on("hidden.bs.modal", "#show-video ", function(){
        $('#show-video .modal-body').html('');

    });
    $(document).on('click','.delet-users-video',function(e){
        $('#delete-video').data('id',$(this).data('id')).attr('data-id',$(this).data('id'));
        $('#delete-video').modal('show');
    })

    $(document).on('click','.delete-ok',function(e){
        var _this = this;
        $.post('/users/delete-user-video',{id: $('#delete-video').data('id')}).done(function( data ) {
            if(data.success){
                $('#delete-video').modal('hide');
                $('li[data-id="'+data.id+'"]').remove();
            }else{
                alert('Server Error! Please try again later!')
            }
        })
    });

    $(document).on("click", '.filtr_category', function() {
        var category_id = $(this).data('id');

        if(category_id == 0){
            userVideos.search('',['category_id']);
            if(($('.thumb-list li ').length/3) % 1 != 0){
                window.scroll = false
            }
        }else{
            userVideos.search(category_id,['category_id']);
            if(($('.thumb-list li ').length/3) % 1 != 0){
                window.scroll = false
            }
        }
        update_page();
        $('.link-custom').click();
        refreshPagination();
    });

    $(document).on("click", '.filtr_status', function() {
        var category_id = $(this).data('id');

        if(category_id == 0){
            userVideos.search('',['status']);
            if(($('.thumb-list li ').length/3) % 1 != 0){
                window.scroll = false
            }
        }else{
            userVideos.search(category_id,['status']);
            if(($('.thumb-list li ').length/3) % 1 != 0){
                window.scroll = false
            }
        }

        update_page();
        refreshPagination();
    });

    $(document).on("change", '.sort', function() {
        if($(this).val() == 'recent'){
            userVideos.sort('recent', { order: "desc" });
            update_page();
            if(($('.thumb-list li ').length/3) % 1 != 0){
                window.scroll = false
            }
            refreshPagination();
        }
    });

    $(document).on("submit", '#my-video-kw', function(e) {
        e.preventDefault();
        var search = $('.search').val();
            userVideos.search(search,['name']);
        update_page();
        refreshPagination();
        return false;
    });

    window.scroll = true
    $(window).scroll(function() {
        // if(window.location.pathname == '/users/my-videos' && window.scroll){
        //     if ($(this).scrollTop() + $(this).innerHeight() >= $('body')[0].scrollHeight-300) {
        //         window.scroll = false;

        //         var start = $('.grid.thumb-list.list .li').length
        //         var i = 0;
        //         $.each(userVideos.matchingItems, function(key, value) {
        //             if(key >= start && key < start+3){
        //              $('.grid.thumb-list.list').append(value.elm);
        //              $('.grid.thumb-list.list .li').eq(key).hide();
        //             }
        //             i++;
        //            if(i=3 || Object.keys(userVideos.matchingItems).length == $('.grid.thumb-list.list .li').length){
        //                 window.scroll = true;
        //                 $('.grid.thumb-list.list .li').show();
        //                 update_page();
        //            }
        //         })
        //     }
        // }
    });

    function update_page(){
        videosName();
        $.each($('.thumb-list li'), function(key, value) {
            if($(value).find('canvas').length){
                if($(value).find('canvas').attr('class') != 'js-is-in-view'){
                    var i = $(value).attr('data-count');
                    $('li[data-count="'+i+'"] canvas').each(initClassyLoader);
                }
            }
            if($(value).find('video').length){
                if($(value).find('div.video-js').length == 0){
                    var video_id = $(value).find('video').attr('id');
                    //videojs(video_id, { "controls": true, "autoplay": false, "preload": "auto" });
                }
            }
        })

        window.scroll = true;
        if($('.thumb-list .li ').length == my_videos_count){
            window.scroll = false
        }

    }

    //share youtube datas
    $("[data-target='#share-youtube-video']").on("click",function(e){
        $("#share-youtube-video .modal-body .video_name").val($(this).data('name'));
    });


    // Matchheight
    if ($width > 992) {
        $('.matchHeight').matchHeight();
    }
    ;

    $win.resize(function () {
        $('.matchHeight').matchHeight();
    });


    //sho currend slide text fields
    (function () {
        $('div#slide-fields-'+ $('.template-list div.slick-current').data('slide')).show();
    })();

    $('.btn-fields-form').click(function (e) {
        $('#fields-form').submit();
        e.preventDefault();
    });


    // setup global config
    // window.wow = (
    //     new WOW({
    //     mobile: false
    //   })
    // ).init();




})(window.jQuery);