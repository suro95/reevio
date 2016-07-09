$("document").ready(function() {

	$(window).scroll(function() {
        if(window.location.pathname == '/youtube/my-videos-grid'){
            if ($(this).scrollTop() + $(this).innerHeight() >= $('body')[0].scrollHeight) {
                var id = $('.thumb-list .video_content').last().data('count') + 1;
                if($('.grid.thumb-list').data('scroll')){
                    $('div.loading-icon').show();
                    $.post("/youtube/video-load-more", { id: id }, function(data, status){  
                        if (data.success) {
                            if(data.data.length < 20){
                                $('.grid.thumb-list').data('scroll',false).attr('data-scroll',false);
                            }
                            setTimeout(function() {
                                $('div.loading-icon').hide();
                                    var length = data.data.length - 1;
                                    var i = id;
                                    var str = "";

                                    $.each(data.data, function(key, value) {
                                    	if(value.status == 'pending' || value.status == 'not_done'){
                                    		str += '<li class = "video_content" data-id="' + value.id + '" data-count="' + i + '">';
                                    			str += "<figure>";
                                    			str += '<div class="thumb"><div class="thumbnail pending"><div class="classyLoader customLoader"><canvas data-classyloader data-width="70" data-height="65" data-percentage="15" data-speed="20" data-font-size="14px" data-diameter="30" data-line-color="#23b7e5" data-remaining-line-color="rgba(200,200,200,0.4)" data-line-width="3" data-rounded-line="true"></canvas><span>Unfinished</span></div></div><div class="info"><ul><li><div class="title">STATUS: '+value.status+'</div><div class="project">ID: '+value.id+'</div><div class="status text-warning"></div></li><li class="date"><span>'+value.date+'</span></li></ul><ul><li><div class="template"><em class="fa fa-tags"></em>Template No.'+value.template_id+'</div></li><li class="tools"><a data-toggle="modal" data-target="#show-video" href="javascript:void(0);" class="fa fa-eye">&nbsp;</a><a data-toggle="modal" data-target="#show-video" href="javascript:void(0);" class="fa fa-trash">&nbsp;</a></li></ul></div></div>';
                                    			str += '<figcaption><div class="btn-group btn-group-justified"><a href="#" class="btn btn-xs btn-default">Continue <em class="fa fa-angle-right"></em></a></div></figcaption>';
                                    			str += "</figure>";
                                    		str += "</li>";
                                    	}else{
                                    		str += '<li class = "video_content" data-id="' + value.id + '" data-count="' + i + '">';
                                    			str += "<figure>";
                                    				str += '<div class="thumb"><div class="vd-thumb"><video width="100%" height="100%" controls="" poster="https://archive.org/download/WebmVp8Vorbis/webmvp8.gif"><source src="'+value.file_location+'" type="video/mp4">Your browser doesn"t support HTML5 video tag.</video><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></div><div class="info"><ul><li><div class="title">Purchased 2</div><div class="project">Project '+value.project_id+'</div><div class="status text-info">'+value.status+'</div></li><li class="date"><span>'+value.date+'</span></li></ul><ul><li><div class="template"><em class="fa fa-tags"></em>Template No.'+value.template_id+'</div></li><li class="tools"><a data-toggle="modal" data-target="#show-video" href="javascript:void(0);" class="fa fa-eye">&nbsp;</a><a data-toggle="modal" data-target="#show-video" href="javascript:void(0);" class="fa fa-trash">&nbsp;</a></li></ul></div></div>';
                                    				str += '<figcaption><div class="btn-group btn-tools"><div class="col col1"><a href="/templates/avvo/video/avvo.mp4" title="Download" download="download" class="btn btn-xs btn-info"><em class="fa fa-download"></em></a></div><div class="col col2"><a href="javascript:void(0)" title="Publish" class="btn-publish btn btn-xs blue"><em class="fa fa-facebook"></em></a><a href="javascript:void(0)" data-toggle="modal" data-target="#publish_modal" title="Publish" class="btn-publish btn btn-xs red"><em class="fa fa-youtube"></em></a></div></div></figcaption>';
                                    			str += "</figure>";
                                    		str += "</li>";
                                    	}
                                        var li = $('.thumb-list').append(str);
                                        $('li[data-count="'+i+'"] canvas').each(initClassyLoader);
                                        str = "";
                                        i++;
                                    });
                            }, 500);
                        }else{
                            $('div.loading-icon').hide();
                            $('.grid.thumb-list').data('scroll',false).attr('data-scroll',false);
                        }
                    });
                }
            }
        }
    });
})