window.swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    // simulateTouch: false,
    spaceBetween: 16,
    // grabCursor: false,
    grabCursor: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    onlyExternal: true, // to disable touch sliding on small screens IgorKiev 2016-04-29
    breakpoints: {
        // when window width is <= 1200px IgorKiev 2016-04-29
        1200: {
            spaceBetweenSlides: 10
        }
    }
});

var Utils = {
    Layout: {
        init: function() {
            var height = $('body').height() - $('.app-top').outerHeight() - $('.app-footer').outerHeight();
            $('.app-content').css('height', height);

            var resultsContainerH = height - $('.sidebar-left-nav').outerHeight() - $('.sidebar-left-subnav').outerHeight() - $('.left-sidebar-section-title').outerHeight() - 50;

            $('.results-container').css('height', resultsContainerH);


            // Layout 2016-04-04 IgorKiev
            var appMiddle = $('.app-content .app-middle'),
                currentSlideDiv = appMiddle.find('.current-slide'),
                availHeight = appMiddle.height(),
                availWidth = ($(window).width() < 1299) ? $(window).width() : $(window).width() - $('.sidebar-left').width() - $('.sidebar-right').width(),
                containerAspectRatio = availWidth / availHeight,
                browserAspectRatio = $(window).width() / $(window).height();


            if ($(window).width() > 1299) {
                if (browserAspectRatio > 1.80) {
                    currentSlideDiv.css({ 'height': availHeight, 'width': availHeight * 16 / 9 });
                } else {
                    currentSlideDiv.css({ 'height': availHeight * 0.8, 'width': availHeight * 16 / 9 * 0.8 });
                }
                // 2016-04-08 for audio main panel in the left sidebar
                if (browserAspectRatio > 2) {
                    $('#main-audio .nav-buttons > li:gt(1)').css({ 'width': '' });
                } else {
                    $('#main-audio .nav-buttons > li:gt(1)').css({ 'width': '100%' });
                }
            } else {
                if (containerAspectRatio > 16 / 9) {
                    currentSlideDiv.css({ 'height': availHeight, 'width': availHeight * 16 / 9 });
                } else {
                    currentSlideDiv.css({ 'width': availWidth, 'height': availWidth * 9 / 16 });
                }
            }

            // Left sidebar elements height
            var customScrollbarHeight = $('.sidebar-left').height(),
                minus1 = $('.sidebar-left-nav').outerHeight(),
                minus2 = 65, //empirically found
                minus3 = ( $('#main-elements .btn.fs18').length ) ? 80 :  0;
                minus4 = ( $('#main-elements #dropzone_icon').length ) ? 80 :  0;
                // console.log($('#main-elements .btn.fs18').length);
            $('#main-elements .custom-scrollbar, #main-audio .custom-scrollbar').height(customScrollbarHeight - minus1 - minus2 - minus3 - minus4);

            // Right sidebar fix for drag and drop
            var rightSidebarWidth = Math.round($('.sidebar-right').width());
            // console.log(rightSidebarWidth);
            $('.sidebar-right .hold-asp-ratio').width(rightSidebarWidth - 70);
        },
        showHideSidebars: function() {
            var info = {
                left: {
                    space: 350,
                    shown: false
                },
                right: {
                    space: 300,
                    shown: false
                },
                easing: 'easeInCubic',
                time: 300
            };

            function showHideBars(side) {
                var amount = (info[side].shown) ? -info[side].space : 0,
                    animateParam = {};
                animateParam[side] = amount;
                $('.sidebar-' + side).animate(animateParam, info.time, info[side].easing, function() {
                    info[side].shown = !info[side].shown;
                });
            }

            $('#show-sidebar-left').on('click', function() { showHideBars('left') });
            $('#show-sidebar-right').on('click', function() { showHideBars('right') });
        },
        // popoversPosition: function() {
        //     $('.text-editor').on('shown.bs.popover', function() {
        //         var openedPopover = $('.popover.in');
        //         if (openedPopover.offset().top < 0) { openedPopover.css('top', 10); }
        //     });
        // }
        // ,modalsHeight: function() {
        //     $('.modal').on('shown.bs.modal', function() {
        //         console.log('modal fires');
        //     });
        // }
    },
    filterToggle: function() {
        if ($(window).width() < 1200) {
            $('.filter-container').slideToggle()
        }
    }
};

$(document).ready(function() {
    Utils.Layout.init();
    Utils.Layout.showHideSidebars(); //2016-04-07 IgorKiev
    // Utils.Layout.popoversPosition(); //2016-04-18 IgorKiev

    $(window).on('resize orientationchange', function() {
        Utils.Layout.init();
    });


    if(typeof UserVideosId != 'undefined')
        $('#videos-name').val(video_name);

    // IgorKiev 2016-04-27

    $(".custom-scrollbar").not('.sidebar-right .custom-scrollbar, .user-images-scrollbar, .sidebar-left .custom-scrollbar,#images-search___modal .custom-scrollbar,#video-search___modal .custom-scrollbar').mCustomScrollbar({
        theme: "rounded-dots",
        scrollInertia: 400
    });

    $(".sidebar-right .custom-scrollbar, .sidebar-left .custom-scrollbar").mCustomScrollbar({
        alwaysShowScrollbar: 1,
        theme: "rounded-dots",
        scrollInertia: 400
    });

    // IgorKiev  for blinking glitch
    // $(".custom-scrollbar").mCustomScrollbar({
    //     alwaysShowScrollbar: 1,
    //     // contentTouchScroll: false, //disables touch scroll
    //     theme: "rounded-dots",
    //     scrollInertia: 400
    // });


});
