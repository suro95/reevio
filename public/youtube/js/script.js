
function Youtube()
{
	this.keyword = '';

	this.type = 'video';

	this.sortorder = '';

	this.videoduration = 'any';

	var _this = this;

	this.search = function(){

		if(typeof _this.type == typeof undefined ){
			_this.type = 'video';
		}

		var data = {};

		data.type = _this.type;

		data.keyword = _this.keyword;

		data.sortorder = _this.sortorder;

		//data.count = _this.count;
		
		if($('#load_youtube').length == 0){
			$('#video_search_table').hide();
			$('.video-search-result').prepend('<div id="load_youtube" class="row"><img src="../img/loading_youtube.gif" ></div>');
		}

		$.post("/youtube/youtube-video-search", data, function(data, status){
			
			$('#video_search_table').hide();
			if(status == "success"){

				$('.video-search-result').css("display", "block");	

				var result = JSON.parse(data).result;
				var stat = JSON.parse(data).data;

				var items = stat;

				console.log(items);

				if(_this.type == "video"){
					$('#video_search_table').show();
					$('#video_search_table tbody').empty();

					for(var i = 0; i < items.length; i++){

						var item = stat[i].items[0];
						var st = stat[i].items[0].statistics;

						var append = $("<tr></tr>");

						append.append("<td class='thumb ribbon'><img src='"+item.snippet.thumbnails.default.url+"'></td>");
						append.append("<td>"+item.snippet.title+"&nbsp;<a target='_blank' href='http://www.youtube.com/channel/"+item.snippet.channelId+"' id='open-channel' class='btn btn-xs red'><em class='fa fa-youtube-play'>Channel</em></a>&nbsp;<a data-url='"+item.id+"' class='play-video btn btn-xs btn-theme'><em class='fa fa-play'></em>Play</a></td>");
						append.append("<td>"+st.viewCount+"</td>");
						append.append("<td>"+st.likeCount+"</td>");
						append.append("<td>"+st.dislikeCount+"</td>");
						append.append("<td>"+st.commentCount+"</td>");						
						append.append("<td>"+item.snippet.publishedAt.slice(0, item.snippet.publishedAt.indexOf('T'))+"</td>");

						$('#load_youtube').remove();
						$('#search-field').val('');
						$('#video_search_table tbody').append(append);


					}					
				}
			}else{
				$('.video-search-result').css("display", "none");	
			}
		})

	}

	this.searchChannel = function(){

		_this.type = "channel";

		console.log(_this.type);

		var data = {};

		data.type = _this.type;

		data.keyword = _this.keyword;
		
		if($('#load_youtube').length == 0){
			$('.channel-search-table tbody').html('');
			$('.video-search-result').prepend('<div id="load_youtube" class="row"><img src="../img/loading_youtube.gif" ></div>');
		}
		

		$.post("/youtube/youtube-video-search", data, function(data, status){

			if(status == "success"){

				$('.video-search-result').css("display", "block");

				var result = JSON.parse(data).result;

				var items = result.items;

				var stat = JSON.parse(data).data;

				console.log(JSON.parse(data));

				if(_this.type == "channel"){

					$('.channel-search-table tbody').empty();

					for(var i = 0; i < items.length; i++){

						// var item = items[i];

						var item = stat[i].items[0];

						var st = stat[i].items[0].statistics;

						var append = $("<tr></tr>");
						var date = item.snippet.publishedAt.substring(0, 10)
						append.append("<td class='thumb ribbon'><img src='"+item.snippet.thumbnails.default.url+"'></td>");
						append.append("<td><a target='_blank' href='http://www.youtube.com/channel/"+item.id+"'>"+item.snippet.title+"</a></td>");
						append.append("<td>"+st.viewCount+"</td>");
						append.append("<td>"+st.subscriberCount+"</td>");
						append.append("<td>"+st.subscriberCount+"</td>");
						append.append("<td>"+st.videoCount+"</td>");						
						append.append("<td>"+date+"</td>");

						$('#load_youtube').remove();
						$('.channel-search-table tbody').append(append);

					}					
				}
			}
		})



	}

	this.setType = function(type){

		this.type = type;
	}

	this.init = function(){

		$('.video-search-result').css("display", "none");	


		//load events

		$(document).on('click', '#search-button.video', function(){

			_this.keyword = $('#search-field').val();

			_this.search();			

		})


		$(document).on('click', '#search-button.channel', function(){

			_this.keyword = $('#search-field').val();

			_this.searchChannel();			

		})


		$(document).on("click", ".play-video", function(){

			var url = $(this).attr('data-url');
			console.log(url);
			var video = $("<iframe width='570' height='400' src='http://www.youtube.com/embed/"+url+"?autoplay=1'></iframe>");
			$('#myModal .modal-body').empty().append(video);
			$('#myModal').modal();

		})		

		$(document).on('keydown', '#search-field', function(e){
			if(e.keyCode == '13'){

				_this.keyword = $(this).val();

				if($(this).hasClass("video")){
					_this.search();
				}else if($(this).hasClass("channel")){
					_this.searchChannel();
				}
				return false;
			}
		})

		$(document).on('change', '.selectpicker.form-control.sortvideo', function(){

			if($(this).val()){
				_this.sortorder = $(this).val();
				_this.search();
			}
		})

		$(document).on('change', '.selectpicker.form-control.videoduration', function(){

			if($(this).val()){
				_this.videoduration = $(this).val();
				_this.search();
			}
		})


		$('#myModal').on("hidden.bs.modal", function(){

			$(this).find(".modal-body").empty();
		})

		$(document).on('click', '.template-listing .template-item .col.col2 a', function(){
			$('.template-listing .template-item .col.col2 a').removeClass('active');
			$(this).addClass('active');
		})

	  	$(document).on('click','.delet-users-video',function(e){
	        $('#delete-video').data('id',$(this).data('id')).attr('data-id',$(this).data('id'));
	        $('#delete-video').modal('show');
    	})
	    $(document).on('click','.delete-ok',function(e){
	        var _this = this;
	        $.post('/users/delete-user-video',{id: $('#delete-video').data('id')}).done(function( data ) {
	            if(data.success){
	                $('#delete-video').modal('hide');
	                $('.delet-users-video[data-id="'+data.id+'"]').parent().parent().remove();
	            }else{
	                alert('Server Error! Please try again later!')
	            }
	        })
	    });

	}
}

var youtube = new Youtube();

youtube.init();

