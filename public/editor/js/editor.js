$( document ).ready(function() {

	window.globalOptions = {};

	var PIXABAY_API_KEY = '1026292-59296bc45312c991bda7e77ad',
		plugin_is_changed = false;

	window.imgur = new Imgur();

	function get_pixabay_images(serarch_kw){
		$('.loading-icon').show();
		$('#loader-wrapper').remove();
		// loding icon
		if($("#image___upload.in").length)
			$('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index:99999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');

		PixabayURL = "https://pixabay.com/api/?key="+PIXABAY_API_KEY+"&q="+encodeURIComponent(serarch_kw)+"&per_page=50"+"&page="+count+"&image_type=photo&category"+$('#pluginsCategory').val(),
		$.getJSON(PixabayURL, function(data){
			if (parseInt(data.totalHits) > 0){
				$('#image___upload').modal('hide');

				var lodaed_count = 1,
				images_count = (data.totalHits >= 50)?50:data.totalHits;

				$.each(data.hits, function(i, hit){
					$('#images-search___modal .image-list-section').append('<div data-url="'+hit.webformatURL+'" class="image-wrapper" style="display: inline-block;"><a><img class="plugin-images"  src="'+hit.previewURL+'"></a><div class="tools"><a class="add-to-lolipop"><span><em class="fa fa-gear"></em> Edit</span></a><a class="add-image" href="#addtolibrary"><span><em class="fa fa-plus-circle"></em> Add to canvas</span></a></div></div>')
				});

				$('.plugin-images').on('load',function(){
					lodaed_count++;
					if(lodaed_count == images_count){
						// 	$('.image-list-section').show();

						$('#loader-wrapper').remove();
						$('.loading-icon').hide();

						// $('.image-wrapper').show();
						if(($("#images-search___modal").data('bs.modal') || {}).isShown){
							collage();
						}else{
							$('#images-search___modal').modal('show');
						}
						// $('.plugin-images').show();
					}
				}).error(function(e){
					lodaed_count++;
					if(lodaed_count == images_count){
						// 	$('.image-list-section').show();

						$('#loader-wrapper').remove();
						$('.loading-icon').hide();

						if(($("#images-search___modal").data('bs.modal') || {}).isShown){
							collage();
						}else{
							$('#images-search___modal').modal('show');
						}
						$('.plugin-images').show();
					}
					$(this).parents('.image-wrapper').remove();
				})
			}else{
	            $('#loader-wrapper').remove();
	            $('.loading-icon').hide();

				alert('No result, Please try again.');
			}
		}).fail(function(){
			pluginOwerfloid = false
            $('#loader-wrapper').remove();
            $('.loading-icon').hide();
		});
	}

	function get_youzing_images(serarch_kw){
		$('#loader-wrapper').remove();
		if($("#image___upload.in").length){
			$('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index:9999"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
		}
		$('.loading-icon').show();

        $.ajax({
            type:"POST",
            url: "/editor/youzing",
            dataType:'json',
            success:function(data){
				$('#image___upload').modal('hide');
            	if(data.length>0){
					var bool = true;

	                $('#images-search___modal .image-list-section').html('');
	                for(i in data)
	                {
						$('#images-search___modal .image-list-section').append('<div data-url="'+data[i]['image_src'][0]+'" class="image-wrapper" style="display: inline-block;"><a><img class="plugin-images" src="'+data[i]['image_sizes']['user-avatar-large'][0]+'"></a><div class="tools"><a class="add-to-lolipop" ><span><em class="fa fa-gear"></em> Edit</span></a><a class="add-image" ><span><em class="fa fa-plus-circle"></em> Add to canvas</span></a></div></div>')
	                }

					$('.plugin-images').last().on('load',function(){
						if(bool){
							// remove loding icon
				            $('#loader-wrapper').remove();
							// $('.image-list-section').show();

							bool = false;
							$('#images-search___modal').modal('show');
							$('.loading-icon').hide();
							if(modal.parents('#images-search___modal').length)
								collage();
						}
					})
            		pluginOwerfloid = false;
            	}else{
            		pluginOwerfloid = false;
		            $('#loader-wrapper').remove();
		            $('.loading-icon').hide();
					alert('No result, Please try again.');
            	}
            },
            error:function(err){
        		pluginOwerfloid = false;
	            $('#loader-wrapper').remove();
	            $('.loading-icon').hide();
                console.log(err);
            }
        });
	}

	function get_photofinish_images(serarch_kw){
		$('.loading-icon').show();
		$('#loader-wrapper').remove();
		if($("#image___upload.in").length)
			$('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index:9999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');

		$.ajax({
			type:"POST",
			url: "/editor/photofinish",
			data:{kw:serarch_kw,page:count,folder_id:$('#pluginsCategory').val()},
			dataType:'json',
			success:function(data){
				if(data.length>0){
					$('#image___upload').modal('hide');

					var lodaed_count = 1,
					images_count = (data.length >= 50)?50:data.length;

					if(data.length < 50)
            			pluginOwerfloid = false;

					for(i in data)
					{
						$('#images-search___modal .image-list-section').append('<div data-url="'+data[i]['originalUrl']+'" class="image-wrapper" style="display: inline-block;"><a><img class="plugin-images"  src="'+data[i]['largeThumbnail']+'"></a><div class="tools"><a class="add-to-lolipop"><span><em class="fa fa-gear"></em> Edit</span></a><a class="add-image"><span><em class="fa fa-plus-circle"></em> Add to canvas</span></a></div></div>')
					}

					$('.plugin-images').on('load',function(){
						lodaed_count++;
						if(lodaed_count == images_count){
							// $('.image-list-section').show();

							$('#loader-wrapper').remove();
							$('.loading-icon').hide();

							if(($("#images-search___modal").data('bs.modal') || {}).isShown){
								collage();
							}else{
								$('#images-search___modal').modal('show');
							}
							// $('.plugin-images').show();
						}
					}).error(function(e){
						lodaed_count++;
						if(lodaed_count == images_count){
							// $('.image-list-section').show();

							$('#loader-wrapper').remove();
							$('.loading-icon').hide();

							if(($("#images-search___modal").data('bs.modal') || {}).isShown){
								collage();
							}else{
								$('#images-search___modal').modal('show');
							}
							// $('.plugin-images').show();
						}
						$(this).parents('.image-wrapper').remove();
					})
				}else{
            		pluginOwerfloid = false;
					$('#loader-wrapper').remove();
					$('.loading-icon').hide();
					alert('No result, Please try again.');
				}
			},
			error:function(err){
        		pluginOwerfloid = false;
				$('#loader-wrapper').remove();
				$('.loading-icon').hide();
				console.log(err);
			}
		})
	}

	$(document).on('change','.plugin-type',function(e){
		var plugin = $(this).val();

		if(plugin == 'photofinish'){
			showPhotoFinishCategories();
		}else if(plugin == 'pixabay'){
			showPixabayCategories();
		}else{
			$("#pluginsCategory").html('<option value="">Categories</option>');
			$('#pluginsCategory').selectpicker('refresh');
		}
	})

	function showPhotoFinishCategories(){
		$.ajax({
			type:"POST",
			url: "/editor/photofinishCategory",
			dataType:'json',
			success:function(data){
				if(data){
					$("#pluginsCategory").html('');
					$.each(data,function(i,v){
						$("#pluginsCategory").append('<option value="'+v.id+'">'+v.name+'</option>');
					})
					$('#pluginsCategory').selectpicker('refresh');
				}
			},
			error:function(err){
				pluginOwerfloid = false;
				$('#loader-wrapper').remove();
				$('.loading-icon').hide();
				console.log(err);
			}
		})
	}

	function showPixabayCategories(){
		var pixabayCategories = ['fashion', 'nature', 'backgrounds', 'science', 'education', 'people', 'feelings', 'religion', 'health', 'places', 'animals', 'industry',
								 'food', 'computer', 'sports', 'transportation', 'travel', 'buildings', 'business', 'music'];
		$("#pluginsCategory").html('');
		$.each(pixabayCategories,function(i,v){
			$("#pluginsCategory").append('<option value="'+v+'">'+v+'</option>');
		})
		$('#pluginsCategory').selectpicker('refresh');
	}

	$(document).on('click','.image-search1',function(){
		window.modal = $(this).parents('.modal-body'),
			images_search = $('#images-search___modal'),
			serarch_kw = modal.find('.search1').val(),
			plugin = modal.find('.dropdownMenuPlugin').val(),
			is_start_modal = (modal.parents('#image___upload').length)?true:false;
			count = 1,
			pluginOwerfloid = true;

		// loading icon
		$('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index:99999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');

		// $('#image___upload').modal('hide');
		images_search.find('.search1').val(serarch_kw);
		images_search.find('.dropdownMenuPlugin option[value="'+plugin+'"]').attr('selected',true);
		$('.selectpicker').selectpicker('refresh');

		$('#images-search___modal .image-list-section').html('');
		// $('.image-list-section').hide();

		if(plugin == 'photofinish'){
			if(is_start_modal || plugin_is_changed){
				plugin_is_changed = false;
				showPhotoFinishCategories();
			}
		}else if(plugin == 'pixabay'){
			if(is_start_modal || plugin_is_changed){
				plugin_is_changed = false;
				showPixabayCategories();
			}
		}else{
			$("#pluginsCategory").html('<option value="">Categories</option>');
			$('#pluginsCategory').selectpicker('refresh');
			plugin_is_changed = true;
		}


		if(plugin == 'pixabay'){

            $('#loader-wrapper').remove();
			get_pixabay_images(serarch_kw);
			count++;
		}else if(plugin == 'youzing'){
            $('#loader-wrapper').remove();
			get_youzing_images(serarch_kw);
			count++;
		}else if(plugin == 'splashbase'){
			$('.loading-icon').show();
			// $('#loader-wrapper').remove();
			SplashbaseURL = "http://www.splashbase.co/api/v1/images/search?query="+encodeURIComponent(serarch_kw),
			$.getJSON(SplashbaseURL, function(data){
				if (data.images.length > 0){
					var bool = true;
					var lodaed_count = 1,
					images_count = (data.images.length >= 50)?50:data.images.length;
					$('#image___upload').modal('hide');

					$('#images-search___modal .image-list-section').html('');
					$.each(data.images, function(i, hit){
						$('#images-search___modal .image-list-section').append('<div data-url="'+hit.url+'" class="image-wrapper" style="display: inline-block;"><a><img class="plugin-images" src="'+hit.url+'" height="180"></a><div class="tools"><a class="add-to-lolipop"><span><em class="fa fa-gear"></em> Edit</span></a><a class="add-image" ><span><em class="fa fa-plus-circle"></em> Add to canvas</span></a></div></div>')
					});

					$('.plugin-images').on('load',function(){
						lodaed_count++;
						if(lodaed_count == images_count){
							// $('.image-list-section').show();

							$('#loader-wrapper').remove();
							$('.loading-icon').hide();

							if(($("#images-search___modal").data('bs.modal') || {}).isShown){
								collage();
							}else{
								$('#images-search___modal').modal('show');
							}
							// $('.plugin-images').show();
						}
					}).error(function(e){
						lodaed_count++;
						if(lodaed_count == images_count){
							// $('.image-list-section').show();

							$('#loader-wrapper').remove();
							$('.loading-icon').hide();

							if(($("#images-search___modal").data('bs.modal') || {}).isShown){
								collage();
							}else{
								$('#images-search___modal').modal('show');
							}
							// $('.plugin-images').show();
						}
						$(this).parents('.image-wrapper').remove();
					})
				}else{
		            $('#loader-wrapper').remove();
		            $('.loading-icon').hide();

					alert('No result, Please try again.');
				}
			})
    		pluginOwerfloid = false;
		}else if(plugin == 'imgflip'){
			if($("#image___upload.in").length)
				$('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index:99999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
			$('.loading-icon').show();
			$('#loader-wrapper').remove();
			ImgflipURL = "https://api.imgflip.com/get_memes",
			$.getJSON(ImgflipURL, function(data){
				if (data.success){
					var bool = true,
						images_count = data.data.memes.length,
						lodaed_count = 1;
					$('#image___upload').modal('hide');

					$('#images-search___modal .image-list-section').html('');
					$.each(data.data.memes, function(i, hit){
						$('#images-search___modal .image-list-section').append('<div data-url="'+hit.url+'" class="image-wrapper" style="display: inline-block;margin-right: 5px;margin-bottom: 5px;"><a><img class="plugin-images" src="'+hit.url+'" height="160"></a><div class="tools"><a class="add-to-lolipop"><span><em class="fa fa-gear"></em> Edit</span></a><a class="add-image"><span><em class="fa fa-plus-circle"></em> Add to canvas</span></a></div></div>')
					});

					$('.plugin-images').on('load',function(){
						lodaed_count++;
						if(lodaed_count == images_count){
							// $('.image-list-section').show();
							$('#loader-wrapper').remove();
							$('.loading-icon').hide();

							if(($("#images-search___modal").data('bs.modal') || {}).isShown){
								setTimeout(function(){
									collage();
								},300)
							}else{
								$('#images-search___modal').modal('show');
							}
						}
					}).error(function(e){
						lodaed_count++;
						if(lodaed_count == images_count){
							// $('.image-list-section').show();
							$('#loader-wrapper').remove();
							$('.loading-icon').hide();

							if(($("#images-search___modal").data('bs.modal') || {}).isShown){
								setTimeout(function(){
									collage();
								},300)
							}else{
								$('#images-search___modal').modal('show');
							}

						}
						$(this).parents('.image-wrapper').remove();
					})
				}else{
		            $('#loader-wrapper').remove();
		            $('.loading-icon').hide();

					alert('No result, Please try again.');
				}
			})
    		pluginOwerfloid = false;
		}else if(plugin == 'photofinish'){
            $('#loader-wrapper').remove();
			get_photofinish_images(serarch_kw);
			count++;
		}else if(plugin == 'imgur'){
			imgur.getAccess();
		}else if(plugin == 'videocloudsuite'){
			$('.loading-icon').show();
			$.ajax({
				type:"POST",
				url: "/editor/videocloudsuite",
				data:{kw:serarch_kw},
				dataType:'json',
				success:function(data){
					if(data.length>0){
						$('#image___upload').modal('hide');

						$('#images-search___modal .image-list-section').html('');
						$.each(data, function(i, hit){
							if(data[i]['extension'] == 'mp4') {
								$('#images-search___modal .image-list-section').append('<div class="image" style="width:19%;height:180px"><video style="width:100%;height:100%" controls="" preload="none" class="video-js center-play"><source src="'+data[i]['absoluteUrl']+'"></video></div>')
							}
						});
						// remove loding icon
			            $('#loader-wrapper').remove();
						// $('.image-list-section').show();

						collage();
					}else{
			            $('#loader-wrapper').remove();

						alert('No result, Please try again.');
					}
					$('.loading-icon').hide();
				},
				error:function(err){
					$('#loader-wrapper').remove();
					$('.loading-icon').hide();
					console.log(err);
				}
			})
    		pluginOwerfloid = false;
		}

	})

	$(document).on('click','.left-bar #tab3 #submit',function(){
		var SplashbaseURL = "http://www.splashbase.co/api/v1/images/latest?videos_only=true";

		$.getJSON(SplashbaseURL, function(data){
			if (data.images.length > 0){
				$('#images-modal .image-list-section').html('');
				$.each(data.images, function(i, hit){
					$('#images-modal .image-list-section').append('<div class="image" style="width:19%;height:180px"><video style="width:100%;height:100%" controls="" preload="none" poster="'+hit.url+'" class="video-js center-play"><source src="'+hit.large_url+'"></video></div>')
				});

				// $('#images-modal').modal('show');
			}else{
				alert('No result, Please try again.');
			}
		})
	})

	$(document).on('click','#images-search',function(){
		$('#images-modal').modal('show');
	})



$(".text-editor").each(function(i,e){
		$(e).parents('.current-slide').css({ position: "absolute", visibility: "hidden", display: "block" });
		var font_num=parseInt($(e).parent().height());
		var fontSize = font_num+"px";

		$(e).parents('.current-slide').css({ position: "", visibility: "", display: "none" });
		$(this).css('font-size', fontSize);
		$('.app-middle .active-slide').css({ display: "block" });
	})

	$( window ).resize(function() {
		console.log('resize')
		$(".text-editor").each(function(i,e){
			$(e).parents('.current-slide').css({ position: "absolute", visibility: "hidden", display: "block" });
			var font_num=parseInt($(e).parent().height());
			var fontSize = font_num+"px";

			$(e).parents('.current-slide').css({ position: "", visibility: "", display: "none" });
			$(this).css('font-size', fontSize);
		})
		$('.app-middle .active-slide').css({ display: "block" });
	})
	// $(".text-editor").each(function(i,e){
	// 	var font_num=parseInt($(e).parent().height());
	// 	//alert(font_num);
	// 	//if(font_num>20)font_num-=20;
	// 	var fontSize = font_num+"px";
	// 	$(this).css('font-size', fontSize);



	// })


	// $( window ).resize(function() {
	// 	console.log('resize')
	// 	$(".text-editor").each(function(i,e){
	// 		//alert(font_num);
	// 		//if(font_num>20)font_num-=20;
	// 		$(e).parents('.current-slide').css({ position: "absolute", visibility: "hidden", display: "block" });
	// 		var font_num=parseInt($(e).parent().height());
	// 		var fontSize = font_num+"px";

	// 		$(e).parents('.current-slide').css({ position: "", visibility: "", display: "none" });
	// 		$(this).css('font-size', fontSize);
	// 		// console.log($(this).find("::after"));
	// 	})
	// 	$('.app-middle .active-slide').css({ display: "block" });
	// })

	// $(document).on('click','.add_music', function(e){
	$(document).on('click','.select_music', function(e){
		if($(this).find('.fa-times').length){
			$(this).parents('ul').find('.fa-times').removeClass('fa-times').addClass('fa-plus-circle');
			$(this).parents('ul').find('.music-hover').remove();
			delete InsertedTempladeData['music'];
		}else{
			$(this).parents('ul').find('.fa-times').removeClass('fa-times').addClass('fa-plus-circle');
			$(this).find('em').removeClass('fa-plus-circle').addClass('fa-times');
			$(this).parents('ul').find('.music-hover').remove();
			$(this).parents('.item').append('<div class="music-hover"></div>');
			var music_id = $(this).attr('data-music-id');
			InsertedTempladeData['music'] = document.location.origin+$('#music-wavesurfer-'+music_id).data('music-url');
			if($('#audio-start___modal li .pause-icon').length)
				$('#audio-start___modal li .pause-icon').click();
			$('#audio-start___modal').modal('hide');
			// $('#audio-search___modal').modal('hide');
		}
	})

	$(document).on('click','.reset_image', function(e){
		var my_InsertedTempladeData = {};
		$.each(InsertedTempladeData,function(slide_position,value){
			$.each(value,function(slide_id,val){
				my_InsertedTempladeData[slide_position] = val;
			})
		});

		$.each(TemplateData,function(i,e){
			if(typeof my_InsertedTempladeData[i] != 'undefined'){
				if(typeof my_InsertedTempladeData[i]['images'] != 'undefined'){
					$.each(e.images,function(key,val){
						$('.current-slide[data-id="'+i+'"] .image___file[data-imgpk="'+key+'"]').addClass('empty');
						$('.current-slide[data-id="'+i+'"] .image___file[data-imgpk="'+key+'"]').removeClass('exist');
						$('.current-slide[data-id="'+i+'"] .image___file[data-imgpk="'+key+'"]').css('background-image','');
						delete my_InsertedTempladeData[i]['images'];
						var count_images = Object.keys(TemplateData[i]["images"]).length;
						$(".image-container[data-id="+i+"] .steps .validate-imgs").text('0/'+count_images);
					})
				}
			}
		})
		peercents();
		selected_slide();
	});

	$('#images-search___modal .custom-scrollbar').mCustomScrollbar({
		theme: "rounded-dots",
		scrollInertia: 400,
		callbacks:{
			onScroll:function(){
				if((-this.mcs.top) > $(this).find('section').height() - $(this).height() && pluginOwerfloid){
					if( plugin == 'pixabay' ){
						$('.loading-icon').show();
						get_pixabay_images(serarch_kw);
					}else if(plugin == 'photofinish'){
						$('.loading-icon').show();
						get_photofinish_images(serarch_kw);
					}
					count++;
					$(this).mCustomScrollbar("scrollTo","bottom",{timeout:0});
				}
			}
		}
	});

	window.userimages = new UserImages();

	$('.user-images-scrollbar').mCustomScrollbar({
		theme: "rounded-dots",
		scrollInertia: 400,
		live: true,
		advanced:{
			autoExpandVerticalScroll:true,
			updateOnContentResize:true
		},
		 callbacks:{
			 onTotalScroll:function(){

				//if((-this.mcs.top) > $(this).find('ul').height() - $(this).height()-20){
					//console.log(true);
					 userimages.getImages();
				//}
			}
		}
	});

	$('#image___upload').on('shown.bs.modal',function(e){
		userimages.openModal();
	})


	$('.background-slide').ColorPicker({
		color: '#000',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500).css('z-index',999999999);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			var position_id = slider.currentSlideId,
				slide_id = Object.keys(InsertedTempladeData[position_id])[0];

			InsertedTempladeData[position_id][slide_id]['slide-background-color'] = hex;
		}
	});

	$(document).on('click','.selcet-music',function(){
		var hasClass = $(this).parents('li').hasClass('music-activ');

		$(this).parents('ul').find('li').removeClass('music-activ');
		$(this).parents('ul').find('.selcet-music').html('SELECT');
		if(hasClass){
			delete InsertedTempladeData['music'];
		}else{
			$(this).html('SELECTED');
			$(this).parents('li').addClass('music-activ');
			InsertedTempladeData['music'] = $(this).attr('data-music-id');
		}
	})

	$(document).on('click','.play-icon-list.play',function(){
		var audio_id = $(this).data('music-id'),
			audio = document.getElementById(audio_id),
			hasClass = $(this).hasClass('music-play');

		$.each($('.music-play'),function(i,v){
			var element = document.getElementById($(v).data('music-id'));

			if(!element.paused)
				element.pause();
		})

		$(this).parents('ul').find('.play-icon-list').removeClass('music-play');
		if(!hasClass){
			$(this).addClass('music-play');
			audio.play();
		}
	})


	$(window).load(function() {

		// Open 'name your video' modal in 2.5seconds after window loads
		setTimeout(function() {
			$('#name-your-video').modal('show');
		}, 100);

		// An action for button in 'name your video' modal
		$(document).on('click', '#video-name-submit', function(e) {
			e.preventDefault();
			$('#name-your-video').modal('hide');
			if($('#videos-name').val().length>0)
				video_name = $('#videos-name').val();
		});

		$(document).on('input','#videos-name',function(e){
			if($(this).val().length > 42){
				$(this).parent('div').addClass('wrong');
			}else{
				$(this).parent('div').removeClass('wrong');
			}
		})
	});

	$(document).on('click','.show-slide-video',function(){
		var video_url = $(this).data('video-url');

		$('#user-video-modal .modal-body').html("<video src='"+video_url+"' style='width:100%;' controls></video>");
		$('#user-video-modal').modal('show');
	})

	$('#user-video-modal').on('hidden.bs.modal', function () {
		$('#user-video-modal video').get(0).pause();
		$('#user-video-modal .modal-body').html('');
	})
});
function UserImages(){
	this.ajaxStarted = false;
	this.overfloid = false;
	this.page = 0;
	this.userImageUrl = '/editor/user-images';
	this.loadingIcon = $('#image___upload #loader');
	this.isModalOpened = false;
}

UserImages.prototype.openModal = function(){
	if(!this.isModalOpened){
		this.isModalOpened = true;
		this.getImages();
	}
}

UserImages.prototype.getImages = function(){
	var _this = this;

	if(!this.ajaxStarted ){
		this.ajaxStarted = true;
		_this.loadingIcon.show();

        $.ajax({
            type:"POST",
            url: this.userImageUrl,
            dataType:'json',
            data:{page:_this.page},
            success:function(data){
				_this.loadingIcon.hide();
            	if(!data.images.length)return false;
				for(var i in data.images) {
						$('.user-images-scrollbar ul').append('<li><div class="item"><div class="thumb thumb-img"><i data-id="'+data.images[i]['id']+'" class="fa fa-trash delete-user-images" aria-hidden="true" style="position: absolute;right: 4px; top: 4px;z-index: 999; font-size: 1.5em;"></i><img data-original-image="'+data.images[i]['path']+'" src="'+data.images[i]['cover_image']+'" alt="Image Thumbnail" style=" " class="mCS_img_loaded users-dynamic-images"></div></div></li>')
	                }
				$('.users-dynamic-images').error(function(e){
						$(this).parents('li').remove();
					})

				_this.page++;
				_this.ajaxStarted = false;

				//$('.user-images-scrollbar').mCustomScrollbar("update");
            },
            error:function(err){
				_this.loadingIcon.hide();
				_this.ajaxStarted = false;
            }
        });
	}else{
		_this.loadingIcon.hide();
	}
}


function Imgur(){
    // this.client_id = 'b0f8383f0294ae6';
    this.client_id = 'b2cd311ab5e52e2';
    this.auth_user = {};
    this.timer = 0;
    this.page = 0;
    this.child_window = '';
}

Imgur.prototype.getAccess = function(query){
	var _this = this;
	this.child_window = window.open("https://api.imgur.com/oauth2/authorize?client_id="+this.client_id+"&response_type=token","Ratting","width=550,height=170,0,status=0,");
	this.timer = setInterval(_this.checkChild.bind(_this), 500);
}

Imgur.prototype.getAllQueryVariable = function(query){
	var vars = query.replace('#','').split("&"),
		GET = {};

	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		GET[pair[0]] = pair[1];
	}

	this.auth_user = GET;
}

Imgur.prototype.checkChild = function(){
	var _this = this;

	if (this.child_window.closed) {
		if(jQuery.isEmptyObject(this.auth_user)){
			$('#loader-wrapper').remove();
			alert('You need to allow for getting images.');
			this.child_window.close();
			clearInterval(this.timer);
		}
	}

	if(!jQuery.isEmptyObject(this.child_window.location)) {
		if(this.child_window.location.search){
			$('#loader-wrapper').remove();
			this.child_window.close();
			alert('You need to allow for getting images.');
		}else{
			this.getAllQueryVariable(this.child_window.location.hash);

			window.settings = {
				"url": "https://api.imgur.com/3/account/"+this.auth_user.account_username+"/images/"+this.page,
				"method": "GET",
				"headers": {
					"Authorization": "Bearer "+this.auth_user.access_token
				}
			}

			$.ajax(settings).done(function (response) {
				_this.appendImages(response);
			});

			this.child_window.close();
			this.page++;
		}
		clearInterval(this.timer);
	}
}

Imgur.prototype.appendImages = function(response){
	if(response.success && response.data.length > 0){
		var lodaed_count = 0,
		data = response.data,
			images_count = (data.length >= 50)?50:data.length;

		if(data.length < 50)
			pluginOwerfloid = false;

		for(i in data)
		{
			$('#images-search___modal .image-list-section').append('<div data-url="'+data[i]['link']+'" class="image-wrapper"><a><img class="plugin-images" src="'+data[i]['link']+'"></a><div class="tools"><a class="add-to-lolipop"><span><em class="fa fa-gear"></em> Edit</span></a><a class="add-image"><span><em class="fa fa-plus-circle"></em> Add to canvas</span></a></div></div>')
		}

		$('.plugin-images').on('load',function(){
			lodaed_count++;
			if(lodaed_count == images_count){
				$('#loader-wrapper').remove();
				$('#images-search___modal').modal('show');
				// imgur.collage();
			}
		}).error(function(e){
			lodaed_count++;
			if(lodaed_count == images_count){
				$('#loader-wrapper').remove();
				$('#images-search___modal').modal('show');
				// imgur.collage();
			}
			$(this).parents('.image-wrapper').remove();
		})
	}else{
		alert("Sorry you have not images.")
	}
}