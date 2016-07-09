$("document").ready(function(){
	$(document).on('click','.child',function(){
		slide_child($(this));
	})
});
	function updateIds(){
		var items = document.querySelectorAll("#videos-list li");
		var ind = null;
		var row = null;
		$('#videos-list li').each(function(index, item){
			if(index < items.length - 1 && item.getAttribute("data-id") == items[index + 1].getAttribute('data-id')){			

				ind = index  + 1;
				items[ind-1].setAttribute("data-fix", "ok");
				row = parseInt(items[ind-1].getAttribute("data-row"));
				return;
			}
		})

		// if(ind != null){

			var count = 1;
			$('#videos-list li').each(function(index, item){
				var item = $(this);
			
				// if(item.attr('data-id') >= ind && typeof item.attr('data-fix') == "undefined"){
					// var i = parseInt(item.attr('data-id'));
					var i = index;

					item.attr('data-row', row + 1);					

					// item.attr('data-id', i + 1);

					count++;

					if(count > 4){
						row++;
						count = 1;
					}

				// }
			})
		// }
	}
	function show_grid(id){
		// console.log(id);
		var video_id = id;
	  	var timestamp = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
	  	var images_count = 0;
		var video_count = 0;
		var date = "";

		$.ajax({
			type: 'POST',
			url: "/show_grid",
			data: { id: video_id },
			success: function(data){
				if (data.success) {
					if(typeof data.data[0] !== 'undefined' ){
						var result = data.data[0];
						try {
							var json = JSON.parse(result.json_data);
							$.each(json, function(key, value) {
								if(typeof value.images != 'undefined'){
									images_count+= Object.keys(value.images).length;
								}
								if(typeof value.video != 'undefined'){
									video_count+= Object.keys(value.video).length;
								}
							})
						} catch (err) {
							console.log(err)
							images_count = 0;
							video_count = 0;
						}

						date = new Date(result.date).getTime();
						if (timestamp > date){
							$(".thumb-expand-section[data-video='" + result.id + "']").find('.ribbon').hide();
						}else{
							$(".thumb-expand-section[data-video='" + result.id + "']").find('.ribbon').show();
						}
					}
					$('.asp-content video').remove();
					$('.asp-content .cover-image').show();

					var cover_image = $(".thumb-expand-section[data-video='" + result.id + "'] .cover-image");
					video = document.createElement("VIDEO");
					video.src = cover_image.data('video-src');
					video.preload = 'auto';

					video.addEventListener('loadedmetadata', function() {
			          video_duration=this.duration;
			          $(".thumb-expand-section[data-video='" + result.id + "'] .video_duration").text(''+parseInt(video_duration)+' Sec');
			          $('.mg-targets div[data-video="'+video_id+'"] .similar-videos-section >.inner .duration').html(parseInt(video_duration));
			        });

			        var category = '';
			        if(data.data[0].category){
						$.each(data.data[0].category, function(key, value) {
							category+= value.name+', ';
						})
					}
					$(".thumb-expand-section[data-video='" + video_id + "']").find('.images_count span').text(images_count);
					$(".thumb-expand-section[data-video='" + video_id + "']").find('.video_count span').text(video_count);

					$(".thumb-expand-section[data-video='" + video_id + "'] .default .images_count").html(images_count);
					$(".thumb-expand-section[data-video='" + video_id + "'] .default .video_count").html(video_count);
					$(".thumb-expand-section[data-video='" + video_id + "'] .default>").attr('data-video-count',video_count).attr('data-img-count',images_count).attr('data-category',category);
					$(".thumb-expand-section[data-video='" + video_id + "']").show();

					images_count = 0;
					video_count = 0;
					date = "";

					if(Object.keys(data.child).length){
						$('.mg-targets div[data-video="'+video_id+'"] .similar-videos-section >.inner>.child_template').remove();
						$.each(data.child, function(key, value) {
							var type = 'Fixed';
							if(value.type == 'dynamic')
								type = 'Modular';
							var child_images_count = 0;
							var child_video_count = 0;
							try {
								$.each(JSON.parse(value.json_data), function(key, val) {
									if(typeof val.images != 'undefined'){
										child_images_count += Object.keys(val.images).length;
									}
									if(typeof val.video != 'undefined'){
										child_video_count+= Object.keys(val.video).length;
									}
								})
							} catch (err) {
								console.log(err)
							}
							var category_cilde = '';
							if(value.category){
								$.each(value.category, function(key, value) {
									category_cilde+= value.name+', ';
								})
							}
							$('.mg-targets div[data-video="'+video_id+'"] .similar-videos-section').css('display','block');
							$('.mg-targets div[data-video="'+video_id+'"] .similar-videos-section >.inner').append('<div class="col-sm-3 child_template templates-child"><div class="inner child" data-video-id="preview-player'+value.id+'" data-video-src="/templates'+value.file_name+'" data-img-src="/templates'+value.cover_photo+'" data-type="'+type+'" data-video-count="'+child_video_count+'" data-img-count="'+child_images_count+'" data-name="'+value.name+'" data-id="'+value.id+'" data-price="'+value.price+'" data-category="'+category_cilde+'"><img src="/templates/'+value.cover_photo+'" style="width:100%"><div class="item-details"><div class="col"><div class="title"><em class="fa fa-clock-o"></em></div><div class="meta duration"></div></div><div class="col"><div class="meta"><span> <em class="fa fa-image"></em>'+child_images_count+'</span><span> <em class="fa fa-film"></em>'+child_video_count+'</span></div></div><div class="col"><div class="meta type">'+type+'</div></div></div></div></div>');
						})
					}

				}
			},
			async:false
		});
	}

	function slide_child(_this){
		var video_id = _this.attr('data-video-id'),
			video_src = _this.attr('data-video-src'),
			img_src = _this.attr('data-img-src'),
			type = _this.find('.type').text(),
			video_count = _this.attr('data-video-count'),
			img_count = _this.attr('data-img-count'),
			name = _this.attr('data-name'),
			price = _this.attr('data-price'),
			category = _this.attr('data-category'),
			id = _this.attr('data-id');

		var video = _this.parents('.thumb-expand-section').find('.asp-content video'),
			img = _this.parents('.thumb-expand-section').find('.asp-content img'),
			video_count_change = _this.parents('.thumb-expand-section').find('.video_count span'),
			img_count_change = _this.parents('.thumb-expand-section').find('.images_count span'),
			name_change = _this.parents('.thumb-expand-section').find('.item-info .title h1'),
			play_button = _this.parents('.thumb-expand-section').find('.asp-content .play_button span'),
			type_change = _this.parents('.thumb-expand-section').find('.type'),
			price_change = _this.parents('.thumb-expand-section').find('.price'),
			make_my_video_change = _this.parents('.thumb-expand-section').find('.video-url'),
			category_change = _this.parents('.thumb-expand-section').find('.category');

			if(video.length){
				img.show();
				video.remove();
				play_button.html('<i class="fa fa-play"></i>');
			}

			img.attr('src',img_src);
			img.attr('data-video-src',video_src);
			img.attr('data-img-src',img_src);
			video_count_change.html(video_count);
			img_count_change.html(img_count);
			name_change.html(name);
			type_change.html(type);
			price_change.html(price+' credits');
			make_my_video_change.attr('href','/editor/'+id);
			category_change.html(category);

	}