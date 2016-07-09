$("document").ready(function() {
    $("#preview-player1").get(0).play();
    $("#preview-player1").siblings('.play_button').find('.fa').removeClass('fa-play').addClass('fa-pause');
    $("#preview-player1").attr('data-play',true);
    $('.video_sales').css('cursor', 'pointer');

    window.play = true;
    $(document).on("click", '.video_sales,.play_button_s', function() {
        alert(12);
        /* add loading icon before video plays */
        var video = $(this).prev("video");
        var vid = document.getElementById(video.attr("id"));
        var _this = $(this);
            _this.parent().find(".video-spinner").addClass("anim");
            // _this.hide();
        if(!video.attr("data-play")){
            _this.parent().find(".play_button").attr("data-hide", "true");

            //pause all
           $("video").each(function(){
             var item = document.getElementById($(this).attr("id"));
             if(item.getAttribute("id") != vid.getAttribute("id")){
                item.pause();
             }
           })

        }

        vid.ontimeupdate = function(){
            $(this).attr('data-play', 'true');
            _this.show();
            $(".video-spinner").removeClass("anim");

        }
        vid.onpause = function(){
            $(this).attr('data-play', false);
            _this.show();
            $(".video-spinner").removeClass("anim");
            $(".play_button").removeAttr("data-hide");
        }



           var  this_id = video.attr("id");
        $.each($('video'), function(key, value) {
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
})
