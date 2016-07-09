
$(document).ready(function(){
	$(".alert").addClass("in").fadeOut(4500);

$('.current-slide[data-id="1"]').addClass('active-slide').show();
/* swap open/close side menu icons */
$('[data-toggle=collapse]').click(function(){
  	// toggle icon
  	$(this).find("i").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
});

	$('.element-name').inlineEdit({
		buttons: '<button class="save"><i class="fa fa-check" aria-hidden="true"></i></button>',
		cancelOnBlur: true,
		save: function(e, data) {
			return templateActions.saveElementName($(this),data.value);
		},
		cancel:function(){
			return false;
		}
	});

	if(typeof addTmplate == 'undefined')
		window.addTmplate = {};
	if(typeof editTmplate == "undefined")
		window.editTmplate = false;
	window.templateActions = new TemplateActions();
	if(editTmplate == true){
		// templateActions.showIconGroup(icon_group)
	}
	if(typeof template_id == "undefined")
		window.template_id = 0;
	window.addTmplateInsert = {};
	var folder_name = '';
	logos = new Array();

	$(document).on('change','.template-data select[name="type"]',function(evt){
		if($(this).val() == 'static'){
			$('.aep').show();
		}else{
			$('.aep').hide();
		}
	});

	$('.add_template').click(function(){

		$('.error').remove();
		var name = $('.template-data input[name="name"]'),
			category = $('.template-data select[name="category"]'),
			success = true,
			form = new FormData($('#upload_form')[0]);

			if(name.val().length == 0){
				name.after('<p class="error" style="color: red;">This value is required.</p>');
				success = false;
			}else{
				addTmplateInsert['name'] = name.val();
			}

			if(success == true){
				$('body').append('<div id="lodaingGif" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999999;"><div class="loding" style="width: 65px;height: 50px;margin: 318px auto;"><div data-loader="circle-side"></div></div></div>');

				$.ajax({
					method:"POST",
					url: '/admin/add-template',
					data: form,
					contentType: false,
					processData: false,
					success: function(data){
						var data = jQuery.parseJSON(data);
						if(data.success == true ){
							$('#lodaingGif').remove();
							template_id = data.template_id;
							folder_name = data.folder;
							$('#img-upload .folder_name').val(folder_name);
							$('#dropzone_icon .folder').val(folder_name);
							$('#dropzone_icon .template_id').val(template_id);
							$('.add_cov').addClass('animate-color');
							if(data.videos_path !=''){
								$('.sidebar-right .custom-scrollbar video').attr('src','/templates'+data.videos_path);
								$('.sidebar-right .custom-scrollbar video').css('visibility','');
							}
							if(data.cov_path !=''){
								$('.sidebar-right .custom-scrollbar img').attr('src','/templates'+data.cov_path);
								$('.sidebar-right .custom-scrollbar img').css('visibility','');
							}
							if(data.slide_timeline_images != ''){
								$.each(data.slide_timeline_images,function(i,v){
									var last_index = Object.keys(addTmplate).length;
									addTmplate[last_index+1] = {'cov':v,'slide_duration':10};
									if(last_index+1 == 1){
										addTmplate[last_index+1]['show-slide'] = true;
									}else{
										addTmplate[last_index+1]['show-slide'] = false;
									}
									$('.swiper-slide.droppable').before('<div data-type="first-upload" data-id="'+(last_index+1)+'" class="swiper-slide slide-item image-container swiper-slide-active" style="margin-right: 16px;"><figure class="slide-img"><div class="hold-asp-ratio"><div class="asp-content"><img src="/templates/'+v+'"><div class="tools"><a href="#" class="slide_data"><span><i aria-hidden="true" class="fa fa-clone fa-lg"></i></span></a><a href="#" class="delete_slide"><span><i aria-hidden="true" class="fa fa-trash-o fa-lg"></i></span></a></div></div></figure></div>');
								})
								swiper.update();
								$('.upload .add-new-images-input').css('visibility','');
							}
							$('#modal_new').modal('hide');
							templateActions.type = data.type;
							$('.upload').data('id',1).attr('data-id',1);
						}else{
							alert('Error')
						}
					}
				})
			};

	});

	$('.edit_template').click(function(){

		$('.error').remove();
		var name = $('.template-data input[name="name"]'),
			category = $('.template-data select[name="category"]'),
			success = true,
			form = new FormData($('#upload_form')[0]);

			if(name.val().length == 0){
				name.after('<p class="error" style="color: red;">This value is required.</p>');
				success = false;
			}else{
				addTmplateInsert['name'] = name.val();
			}

			if(success == true){
				$('body').append('<div id="lodaingGif" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999999;"><div class="loding" style="width: 65px;height: 50px;margin: 318px auto;"><div data-loader="circle-side"></div></div></div>');

				$.ajax({
					method:"POST",
					url: '/admin/update-template',
					data: form,
					contentType: false,
					processData: false,
					success: function(data){
						var data = jQuery.parseJSON(data);
						if(data.success == true ){
							if($('#upload_form select[name="type"]').val() == 'static'){
								$.each(addTmplate,function(i,v){
									delete v['aep'];
									delete v['aep_file'];
								})
							}

							$('#lodaingGif').remove();

							if(data.videos_path !=''){
								$('.sidebar-right .custom-scrollbar video').attr('src','/templates'+data.videos_path);
								$('.sidebar-right .custom-scrollbar video').css('visibility','');
							}
							if(data.cov_path !=''){
								$('.sidebar-right .custom-scrollbar img').attr('src','/templates'+data.cov_path+'?123');
								$('.sidebar-right .custom-scrollbar img').css('visibility','');
							}

							$('#modal_new').modal('hide');
							templateActions.type = data.type;
							templateActions.SlideMaxDuration = data.max_duration;
						}else{
							alert('Error')
						}
					}
				})
			};

	});

	if (window.File && window.FileReader && window.FileList && window.Blob) {
		if(document.getElementById('video'))
			document.getElementById('video').addEventListener('change',handleFileSelectVideo, false);
		if(document.getElementById('cover_photo'))
			document.getElementById('cover_photo').addEventListener('change',handleFileSelectCoverPhoto, false);
		if(document.getElementById('timline_slides'))
			document.getElementById('timline_slides').addEventListener('change',handleFileSelectTimline_slides, false);
		if(document.getElementById('icon-group'))
			document.getElementById('icon-group').addEventListener('change',handleFileSelectIcon, false);
	}

	function handleFileSelectAep(evt){
	    var files = evt.target.files;
	    var file = files[0];

	    if (files && file){
	        var reader = new FileReader();
	        reader.onload = function(readerEvt) {
	            var binaryString = readerEvt.target.result,
					allowedFileTypes = ["aep"],
					file_type = files[0].name.split('.').pop(),
	                base64 = btoa(binaryString);

                    files = document.getElementById("aep_file").files;
	                    if(allowedFileTypes.indexOf(file_type) > -1){
							addTmplateInsert['aep_file'] = base64;
							addTmplateInsert['aep_file_base64'] = true;
	                    }else{
	                        alert('File type is not video');
	                        $('#aep_file').val('')
	                    }
	            }
			};
	        reader.readAsBinaryString(file);
	}

	function handleFileSelectTimline_slides(evt){
	    var files = evt.target.files;

		$.each(files,function(i,file){
	        var reader = new FileReader();
	        reader.onload = function(readerEvt) {
	            var binaryString = readerEvt.target.result,
					allowedFileTypes = ['image/png','image/jpg','image/jpeg'],
	                base64 = btoa(binaryString);

                if(allowedFileTypes.indexOf(file.type) > -1){
					addTmplateInsert['aep_file'] = base64;
					addTmplateInsert['aep_file_base64'] = true;
                }else{
                    alert('File type is not image');
                    $('#timline_slides').val('')
                }
	        }
	        reader.readAsBinaryString(file);
		})
	}

	function handleFileSelectVideo(evt){
	    var files = evt.target.files;
	    var file = files[0];

	    if (files && file){
	        var reader = new FileReader();
	        reader.onload = function(readerEvt) {
	            var binaryString = readerEvt.target.result,
					allowedFileTypes = ["video/mp4","video/webm"],
	                base64 = btoa(binaryString);
                    files = document.getElementById("video").files;
	                    if(allowedFileTypes.indexOf(files[0].type) > -1){
							addTmplateInsert['file_name'] = base64;
							addTmplateInsert['file_name_base64'] = true;
	                    }else{
	                        alert('File type is not video');
	                        $('#video').val('')
	                    }
	            }
			};
	        reader.readAsBinaryString(file);
	}

	function handleFileSelectCoverPhoto(evt){
	    var files = evt.target.files;
	    var file = files[0];

	    if (files && file){
	        var reader = new FileReader();
	        reader.onload = function(readerEvt) {
	            var binaryString = readerEvt.target.result,
					allowedFileTypes = ['image/png','image/jpg','image/jpeg'],
	                base64 = btoa(binaryString);
                    files = document.getElementById("cover_photo").files;
	                    if(allowedFileTypes.indexOf(files[0].type) > -1){
							addTmplateInsert['cover_photo'] = base64;
							addTmplateInsert['cover_photo_base64'] = true;
	                    }else{
	                        alert('File type is not image');
	                        $('#cover_photo').val('')
	                    }
	            }
			};
	        reader.readAsBinaryString(file);
	}

	function handleFileSelectIcon(evt){
		var files = evt.target.files;
		var file = files[0];

		if (files && file){
			var reader = new FileReader();
			reader.onload = function(readerEvt) {
				var binaryString = readerEvt.target.result,
					allowedFileTypes = ['image/png','image/jpg','image/jpeg','application/x-shockwave-flash','video/quicktime'],
					base64 = btoa(binaryString);
					files = document.getElementById("icon-group").files;

					for (var i = 0; i < files.length; i++) {

						if(allowedFileTypes.indexOf(files[i].type) > -1){

						}else{
							alert('File type is not .png .jpg .swf .mov	');
							$('#icon-group').val('');
							return false;
						}
				};
			}
		};
		reader.readAsBinaryString(file);
	}

	function handleFileSelectSlideVideo(evt){
		var files = evt.target.files;
		var file = files[0];

		if (files && file){
			var reader = new FileReader();
			reader.onload = function(readerEvt) {
				var binaryString = readerEvt.target.result,
					allowedFileTypes = ["video/mp4","video/webm"],
					base64 = btoa(binaryString);
					files = document.getElementById("slide-video").files;

					for (var i = 0; i < files.length; i++) {

						if(allowedFileTypes.indexOf(files[i].type) > -1){
							addTmplateInsert['slide_video'] = base64;
							addTmplateInsert['slide_video_base64'] = true;
						}else{
							alert('File type is not .mp4 .webm');
							$('#slide-video').val('');
							return false;
						}
				};
			}
		};
		reader.readAsBinaryString(file);
	}

	$(document).on('click','.add_cov',function(evt){
		if(template_id > 0){
			var slide_id = Object.keys(addTmplate).length;
			// if(slide_id == 0){
			// 	$('#img-upload .image_type').val('cov');
			// 	$('#img-upload .slide_id').val(slide_id+1);
			// 	$('#img-upload').click();
			// }else if(!addTmplate[slide_id+1] && addTmplate[slide_id]['slide']){
				$('#img-upload .image_type').val('cov');
				$('#img-upload .slide_id').val(slide_id+1);
				$('#img-upload').click();
			// }else{

			// 	var input = $(".add-new-images-input");
			// 	input.addClass("animate");
			// 	setTimeout(function(){
			// 		input.removeClass("animate");
			// 	}, 500);
			// }
		}else{
			// $('.modal-window').show();
			$('#modal_new').modal('show');
		}
	});

	$(document).on('click','.add_slide',function(evt){
		// var slide_id = Object.keys(addTmplate).length;
		var slide_id = $(evt.target).parents('.current-slide').data('id');
		$('#modal .modal-content').data('slideId',slide_id).attr('data-slideId',slide_id);
		$('#modal .modal-content').data('name','').attr('data-name','');
		$('#modal .modal-content').data('type','slide').attr('data-type','slide');
		var length = typeof addTmplate[slide_id]['length'] != 'undefined' ? addTmplate[slide_id]['length'] : '';
		var aep = typeof addTmplate[slide_id]['aep'] != 'undefined' ? addTmplate[slide_id]['aep'] : '';
		var background_color = typeof addTmplate[slide_id]['background-color'] != 'undefined' && addTmplate[slide_id]['background-color'] == true ? 'checked' : '';

		if(slide_id != 0 && typeof addTmplate[slide_id]['cov'] != 'undefined' && addTmplate[slide_id]['cov']){
			$('#img-upload .image_type').val('slide');
			$('#img-upload .slide_id').val(slide_id);
			$('#img-upload').click();
		}
	});

	$(document).on('click','.slide_data',function(evt){
		var slide_id = templateActions.activeSlideId;
		var slide_id = $(evt.target).parents('.image-container').data('id');
		$('#modal .modal-content').data('slideId',slide_id).attr('data-slideId',slide_id);
		$('#modal .modal-content').data('name','').attr('data-name','');
		$('#modal .modal-content').data('type','slide').attr('data-type','slide');
		var length = typeof addTmplate[slide_id]['length'] != 'undefined' ? addTmplate[slide_id]['length'] : '';
		var slide_duration = typeof addTmplate[slide_id]['slide_duration'] != 'undefined' ? addTmplate[slide_id]['slide_duration'] : '';
		var category_tag = typeof addTmplate[slide_id]['category_tag'] != 'undefined' ? addTmplate[slide_id]['category_tag'] : '';
		var aep = typeof addTmplate[slide_id]['aep'] != 'undefined' ? addTmplate[slide_id]['aep'] : '';
		var background_color = typeof addTmplate[slide_id]['background-color'] != 'undefined' && addTmplate[slide_id]['background-color'] == true ? 'checked' : '';
		var show_slide = typeof addTmplate[slide_id]['show-slide'] == 'undefined' || addTmplate[slide_id]['show-slide'] == true ? 'checked' : '';

		if(typeof addTmplate[slide_id]['slide'] != 'undefined' && addTmplate[slide_id]['cov']){
			if(templateActions.type == 'static'){
				$('#modal .modal-body').html(' <div class="form-group"><label class="col-sm-12 control-label" for="length">Length</label><div class="col-sm-12"><input type="text" class="form-control" id="length" value="'+length+'"/></div><label class="col-sm-12 control-label" for="background-color">Background Color</label><div class="col-sm-12"><input style="width: 2em;" type="checkbox" class="form-control" id="background-color" '+background_color+'/></div><label class="col-sm-12 control-label" for="slide-video">Slide Video</label><div class="col-sm-12"><input type="file" class="form-control" id="slide-video"/></div></div></div>');
			}else{
				var str = '',
					option_str = '<label class="col-sm-12 control-label" for="length">Slide Duration</label><div class="col-sm-12"><input type="number" class="form-control" id="slide-duration" value="'+slide_duration+'"></div>',
					category_tag_str = '<label class="col-sm-12 control-label" for="length">Category Tags</label><div class="col-sm-12"><select class="form-control" id="category-tag"><option value="">select tag</option>';
					// category_tag_options = ['photo','video','kinetic','text'];

				if(category_tag_options){
					$.each(category_tag_options,function(i,v){
						category_tag_str += '<option value="'+v.id+'" '+( (v.id==category_tag) ? 'selected' : '' )+'>'+v.name+'</option>';
					})
				}
				category_tag_str += '<option value="add-new">Add New</option></select></div>';

				str = '<div class="form-group"><label class="col-sm-12 control-label" for="length">Length</label><div class="col-sm-12"><input type="text" class="form-control" id="length" value="'+length+'"/></div>'+option_str+category_tag_str+'<label class="col-sm-12 control-label" for="background-color">Background Color</label><div class="col-sm-12"><input style="width: 2em;" type="checkbox" class="form-control" id="background-color" '+background_color+'/></div><label class="col-sm-12 control-label" for="slide-video">Slide Video</label><div class="col-sm-12"><input type="file" class="form-control" id="slide-video"/></div><label class="col-sm-12 control-label" for="aep">Aep</label><div class="col-sm-12"><input type="text" class="form-control" id="aep" value="'+aep+'"/></div><label class="col-sm-12 control-label">Aep file</label><div class="col-sm-12"><input type="file" class="form-control" id="aep_file"/></div><label class="col-sm-12 control-label" for="show-slide">Show Slide</label><div class="col-sm-12"><input style="width: 2em;" type="checkbox" class="form-control" id="show-slide" '+show_slide+'/></div></div></div>'
				$('#modal .modal-body').html(str);
			}


			$('#modal').modal('show');
		}else{
			var input = $(".add-new-images-input");
				input.addClass("animate");
				setTimeout(function(){
					input.removeClass("animate");
				}, 500);
		}
		document.getElementById('slide-video').addEventListener('change',handleFileSelectSlideVideo, false);
	});

	$(document).on('change','#aep_file',function(e){
		handleFileSelectAep(e);
	})

	$("#img-upload").dropzone({
        dictDefaultMessage: "DROP YOUR Image HERE OR CLICK TO UPLOAD",
        previewTemplate:"",
        url:"/admin/img-upload",
        acceptedFiles:"image/*",
        addedfile: function (file) {},
		thumbnail: function (file, dataUrl) {},
		uploadprogress: function (file, progress, bytesSent) {
		},
		success:function(file,success){
			if(success.success){
				if(success.image_type == 'cov'){
					addTmplate[success.slide_id] = {};
					addTmplate[success.slide_id]['cov'] = success.path;
					addTmplate[success.slide_id]['slide_duration'] = 10;

					$('.swiper-slide.droppable').before('<div data-id="'+success.slide_id+'" class="swiper-slide slide-item image-container swiper-slide-active" style="margin-right: 16px;"><figure class="slide-img"><div class="number">'+success.slide_id+'</div><div class="hold-asp-ratio"><div class="asp-content"><img src="/templates/'+success.path+'"><div class="tools"><a href="#" class="slide_data"><span><i aria-hidden="true" class="fa fa-clone fa-lg"></i></span></a><a href="#" class="delete_slide"><span><i aria-hidden="true" class="fa fa-trash-o fa-lg"></i></span></a></div></div></figure></div>');
					$('.upload .add-new-images-input').css('visibility','');
					$('.upload').data('id',success.slide_id).attr('data-id',success.slide_id);
					swiper.update();
					templateActions.changeSlideById(success.slide_id);
					// templateActions.submitTemplate('admin');
				}else if(success.image_type == 'slide'){
					addTmplate[success.slide_id]['slide'] = success.path;

					// if(templateActions.type == 'dynamic'){
						if(Object.keys(addTmplate).length == 1){
							addTmplate[success.slide_id]['show-slide'] = true;
						}else if(typeof addTmplate[success.slide_id]['show-slide'] == 'undefined'){
							addTmplate[success.slide_id]['show-slide'] = false;
						}
					// }
					$('.upload').before('<div data-id="'+success.slide_id+'" class="current-slide slide item-form"><div class="refresh-slide"><i class="fa fa-refresh"></i></div><img src="/templates/'+success.path+'" style="width:100%;height:100%"><div class="item-form" style="height:100%"></div></div>')
					$('.upload').data('id',0).attr('data-id',0);

					templateActions.changeSlideById(success.slide_id);
					templateActions.submitTemplate('admin');
				}else if(success.image_type == 'refresh-slide'){
					addTmplate[success.slide_id]['slide'] = success.path;
					$('.current-slide[data-id="'+success.slide_id+'"]').find('img').attr('src','/templates'+success.path);
					templateActions.submitTemplate('admin');
				}
			}
		},
		sending:function(file,data,token){
		}
    });

	$(document).on('click','.placeholder',function(){
		$("#placeholder-upload").click();
	})

	$("#placeholder-upload").dropzone({
		dictDefaultMessage: "DROP YOUR Image HERE OR CLICK TO UPLOAD",
		previewTemplate:"",
		acceptedFiles:"image/*",
		addedfile: function (file) {},
		thumbnail: function (file, dataUrl) {},
		uploadprogress: function (file, progress, bytesSent) {
		},
		success:function(file,success){
		},
		sending:function(file,data,token){
		}
	});

	$(document).on('click', '.image-container', function(){
        var id = $(this).attr('data-id');
		$('.upload').data('id',0).attr('data-id',0);

		if(typeof addTmplate[id] != "undefined" && typeof addTmplate[id]['slide'] == "undefined")
			$('.upload').data('id',id).attr('data-id',id);
        templateActions.changeSlideById(id);
    });

	$(document).on('click', '.delete_slide', function(){

		var element_cov = $(this).parents('.image-container'),
			element_slide = $('.current-slide.slide[data-id="'+element_cov.data('id')+'"]'),
			cov = element_cov.find('img').attr('src'),
			slide = element_slide.length ? element_slide.find('img').attr('src') : false;
            $('#modal_delete').attr('data-id',element_cov.data('id'));
            $('#modal_delete').attr('data-cov',cov);
            $('#modal_delete').attr('data-slide',slide);
            $('#modal_delete').modal('show');
	});


	$(document).on('click','#yes_delete',function(){
		var id = $('#modal_delete').attr('data-id'),
            cov = $('#modal_delete').attr('data-cov'),
            slide = $('#modal_delete').attr('data-slide');
        $('#loader-wrapper').css('opacity','0.7');
		$('#loader-wrapper').show();
        $.post( "/admin/delete-slide",{cov:cov,slide:slide}).done(function( data ) {
			if(data.success){
				if(data.cov)
					$('.image-container[data-id="'+id+'"]').remove();
				if(data.slide)
					$('.current-slide[data-id="'+id+'"]:not(.upload)').remove();

				if($('.image-container').length){
					var NewaddTmplate = {};
					$.each($('.image-container'),function(index,val){
			            NewaddTmplate[index+1] = {};
			            NewaddTmplate[index+1] = addTmplate[$(val).data('id')];

			            $(val).data('id',index+1).attr('data-id',index+1);

					});

					$.each($('.current-slide.slide'),function(index,val){
			            $(val).data('id',index+1).attr('data-id',index+1);
			            $(val).find('>div').data('slide-id',index+1).attr('data-slide-id',index+1);
			            $(val).find('>div a').data('slide-id',index+1).attr('data-slide-id',index+1);
					});

					addTmplate = NewaddTmplate;

				}else{
					addTmplate = {};
					$('.upload').data('id',0).attr('data-id',0);
				}
				templateActions.submitTemplate('admin');

				if($('.current-slide.slide[data-id="'+(id)+'"]').length){
					// templateActions.changeSlideById(id);
					$('.image-container[data-id="'+(id)+'"]').click();
				// }else if($('.current-slide.slide[data-id="'+(id-1)+'"]').length){
				// 	templateActions.changeSlideById(id-1);
				}else{
					$('.image-container[data-id="'+(id - 1)+'"]').click();
					// templateActions.changeSlideById(id - 1);
				}
				swiper.update();
				$('#loader-wrapper').hide();
				$('#loader-wrapper').css('opacity','1');
				$('#modal_delete').modal('hide');
			}
		});
    });

	$(document).on('click', '.add-img', function(e){
		var slide_id = templateActions.activeSlideId;

		if(slide_id != 0 && typeof addTmplate[slide_id]['slide'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov']
			&& typeof addTmplate[slide_id]['slide'] ){

			if(typeof addTmplate[slide_id]['images'] == 'undefined')
				addTmplate[slide_id]['images'] = {};

			var image_id = Object.keys(addTmplate[slide_id]['images']).length + 1,
				image_name = templateActions.getElementName(slide_id,'images');

			obj = {"position":"top:0%;left:0%;","size":"width:10%;height:18%;","desc":"your logo","required":true,"style":"","width":"1920","height":"1080","skip":false,"logo":false};
			addTmplate[slide_id]['images'][image_name] = obj;

			$('.current-slide[data-id="'+slide_id+'"] .item-form').append('<div data-image-name="'+image_name+'" data-slide-id="'+slide_id+'" style="z-index: 999;position: absolute;top: 0;width:50px;height:50px;border:1px solid #D84A38;" class="field image___file empty"><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="images" data-element-name="'+image_name+'" class="fa fa-times element-remove"></i><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="images" data-element-name="'+image_name+'" class="fa fa-clone element-clone"></i><i aria-hidden="true" class="element-name" data-element-name="'+image_name+'" data-element-type="images">'+image_name+'</i><div class="btn add-new-images-inputs"></div></div>');
			$('[data-image-name="'+image_name+'"]')
			.draggable({
				containment: "parent",
				stop: function(event, ui){
					var percent = templateActions.PxToPercent($(ui.helper[0]));

					addTmplate[slide_id]['images'][image_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
				}
			})
			.resizable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.element[0]));

					addTmplate[slide_id]['images'][image_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
				}
			});
		}
	})

	// $(document).on('click', '.add-graph', function(e){
	// 	var slide_id = templateActions.activeSlideId;

	// 	if(slide_id != 0 && typeof addTmplate[slide_id]['slide'] != 'undefined'
	// 		&& typeof addTmplate[slide_id]['cov'] != 'undefined'
	// 		&& typeof addTmplate[slide_id]['cov']
	// 		&& typeof addTmplate[slide_id]['slide'] ){

	// 		if(typeof addTmplate[slide_id]['graphs'] == 'undefined')
	// 			addTmplate[slide_id]['graphs'] = {};

	// 		var image_id = Object.keys(addTmplate[slide_id]['graphs']).length + 1,
	// 			graph_name = templateActions.getElementName(slide_id,'graphs');

	// 		obj = {"position":"top:0%;left:0%;","size":"width:10%;height:18%;","desc":"your graph","required":true,"style":"","width":"","height":""};
	// 		addTmplate[slide_id]['graphs'][graph_name] = obj;

	// 		$('.current-slide[data-id="'+slide_id+'"] .item-form').append('<div data-graph-name="'+graph_name+'" data-slide-id="'+slide_id+'" style="z-index: 999;position: absolute;top: 0;width:50px;height:50px;border:1px solid #D84A38;" class="field image___graph empty"><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="graphs" data-element-name="'+graph_name+'" class="fa fa-times element-remove"></i><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="graphs" data-element-name="'+graph_name+'" class="fa fa-clone element-clone"></i><i aria-hidden="true" class="element-name" data-element-name="'+graph_name+'" data-element-type="graphs">'+graph_name+'</i><div class="btn add-new-images-inputs"></div></div>');
	// 		$('[data-graph-name="'+graph_name+'"]')
	// 		.draggable({
	// 			containment: "parent",
	// 			stop: function(event, ui){
	// 				var percent = templateActions.PxToPercent($(ui.helper[0]));

	// 				addTmplate[slide_id]['graphs'][graph_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
	// 			}
	// 		})
	// 		.resizable({
	// 			containment: "parent",
	// 			stop: function( event, ui ) {
	// 				var percent = templateActions.PxToPercent($(ui.element[0]));

	// 				addTmplate[slide_id]['graphs'][graph_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
	// 			}
	// 		});
	// 	}
	// })

	$(document).on('click', '.add-video', function(e){
		var slide_id = templateActions.activeSlideId;

		if(slide_id != 0 && typeof addTmplate[slide_id]['slide'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov']
			&& typeof addTmplate[slide_id]['slide'] ){

			if(typeof addTmplate[slide_id]['video'] == 'undefined' || !addTmplate[slide_id]['video'])
				addTmplate[slide_id]['video'] = {};

			var video_id = Object.keys(addTmplate[slide_id]['video']).length + 1,
				video_name = templateActions.getElementName(slide_id,'video');

			obj = {"desc":"video","position":"top:0%;left:0%;","required":true,"size":"width:10%;height:18%;","style":"","time":1};
			addTmplate[slide_id]['video'][video_name] = obj;

			$('.current-slide[data-id="'+slide_id+'"] .item-form').append('<div data-video-name="'+video_name+'" data-slide-id="'+slide_id+'"  style="z-index: 999;position: absolute;top: 0;width:50px;height:50px;border:1px solid #D84A38;" class="field video___file empty"><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="video" data-element-name="'+video_name+'" class="fa fa-times element-remove"></i><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="video" data-element-name="'+video_name+'" class="fa fa-clone element-clone"></i><i aria-hidden="true" class="element-name" data-element-name="'+video_name+'" data-element-type="video">'+video_name+'</i><div class="btn add-new-videos-input"></div></div>');
			$('.app-middle .current-slide .video___file[data-video-name="'+video_name+'"]')
			.draggable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.helper[0])),
						position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
						size = 'width:'+percent.width+'%;height:'+percent.height+'%;';

					addTmplate[slide_id]['video'][video_name]["position"]=position;
					addTmplate[slide_id]['video'][video_name]["size"]=size;
				}
			})
			.resizable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.element[0]));
						position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
						size = 'width:'+percent.width+'%;height:'+percent.height+'%;';

					addTmplate[slide_id]['video'][video_name]["position"]=position;
					addTmplate[slide_id]['video'][video_name]["size"]=size;
				}
			});
		}
	});

	$(document).on('click', '.add-element', function(e){
		var slide_id = templateActions.activeSlideId;

		if(slide_id != 0 && typeof addTmplate[slide_id]['slide'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov']
			&& typeof addTmplate[slide_id]['slide'] ){

			if(typeof addTmplate[slide_id]['element'] == 'undefined')
				addTmplate[slide_id]['element'] = {};

			var element_name = templateActions.getElementName(slide_id,'element');

			obj = {"position":"top:0%;left:0%;","size":"width:12%;height:20%;","desc":"element ","style":"","color":"FFFFFF"};
			addTmplate[slide_id]['element'][element_name] = obj;

			$('.current-slide[data-id="'+slide_id+'"] .item-form').append('<div data-element-name="'+element_name+'" data-slide-id="'+slide_id+'" style="position: absolute;top: 0;width:12%;height:20%;border:1px solid #D84A38;" class="field element___file empty"><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="element" data-element-name="'+element_name+'" class="fa fa-times element-remove"></i><i aria-hidden="true" data-type="element"  class="fa fa-clone element-clone"></i><i aria-hidden="true"  data-type="element"  class="fa fa-paint-brush element-paint"></i><i aria-hidden="true" data-type="element" class="fa fa-arrows-alt element-style"></i><i aria-hidden="true" class="element-name" data-element-name="'+element_name+'" data-element-type="element">'+element_name+'</i><div class="btn add-new-element"></div></div>');

			$('.element___file[data-element-name="'+element_name+'"] .element-paint').ColorPicker({
		        color: '#'+addTmplate[slide_id]['element'][element_name]['color'],
		        onShow: function (colpkr) {
		            $(colpkr).fadeIn(500);
		            return false;
		        },
		        onHide: function (colpkr) {
		            $(colpkr).fadeOut(500);
		            return false;
		        },
		        onChange: function (hsb, hex, rgb) {
		           $('.element___file[data-element-name="'+element_name+'"]').css('background-color','#'+hex);
		            addTmplate[slide_id]['element'][element_name]['color'] = hex;
		        }
		    });

			$('.element___file[data-element-name="'+element_name+'"]')
			.draggable({
				containment: "parent",
				stop: function(event, ui){
					var percent = templateActions.PxToPercent($(ui.helper[0]));

					addTmplate[slide_id]['element'][element_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
				}
			})
			.resizable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.element[0]));

					addTmplate[slide_id]['element'][element_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
				}
			});
		}
	});

	$(document).on('click', '.add-icon', function(e){
		var slide_id = templateActions.activeSlideId;

		if(slide_id != 0 && typeof addTmplate[slide_id]['slide'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov']
			&& typeof addTmplate[slide_id]['slide'] ){

			if(typeof addTmplate[slide_id]['graphics'] == 'undefined')
				addTmplate[slide_id]['graphics'] = {};

			var icon_name = templateActions.getElementName(slide_id,'graphics');

			obj = {"position":"top:0%;left:0%;","size":"width:12%;height:20%;","desc":"icon ","style":""};
			addTmplate[slide_id]['graphics'][icon_name] = obj;

			$('.current-slide[data-id="'+slide_id+'"] .item-form').append('<div data-element-name="'+icon_name+'" data-slide-id="'+slide_id+'" style="position: absolute;top: 0;width:12%;height:20%;border:1px solid #D84A38;" class="field icon___file empty"><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="graphics" data-element-name="'+icon_name+'" class="fa fa-times element-remove"></i><i aria-hidden="true" data-type="graphics"  class="fa fa-clone element-clone"></i><i aria-hidden="true" class="element-name" data-element-name="'+icon_name+'" data-element-type="graphics">'+icon_name+'</i><div class="btn add-new-element"></div></div>');

			$('.icon___file[data-element-name="'+icon_name+'"]')
			.draggable({
				containment: "parent",
				stop: function(event, ui){
					var percent = templateActions.PxToPercent($(ui.helper[0]));

					addTmplate[slide_id]['graphics'][icon_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
				}
			})
			.resizable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.element[0]));

					addTmplate[slide_id]['graphics'][icon_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
				}
			});
		}
	});

	$(document).on('click', '.add-input', function(e){
		var slide_id = templateActions.activeSlideId;

		if(slide_id != 0 && typeof addTmplate[slide_id]['slide'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov']
			&& typeof addTmplate[slide_id]['slide'] ){

			if(typeof addTmplate[slide_id]['inputs'] == 'undefined')
				addTmplate[slide_id]['inputs'] = {};

			var video_id = Object.keys(addTmplate[slide_id]['inputs']).length + 1,
				input_name = templateActions.getElementName(slide_id,'inputs');

			obj = {"desc":"text","max":20,"name":"mini-explainer","required":true,"type":"text","value":"TEXT","text_style":"color:#000;justify-content:center;","style":"position:absolute;top: 0%;left: 0%;width: 29%;height: 14%;"};
			addTmplate[slide_id]['inputs'][input_name] = obj;

			$('.current-slide[data-id="'+slide_id+'"] .item-form').append('<div data-input-name="'+input_name+'" data-slide-id="'+slide_id+'" style="white-space: nowrap; z-index: 999;position: absolute;top: 0;width:150px;height:50px;outline:1px solid #D84A38;" class="field text dark-t"><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="inputs" data-element-name="'+input_name+'" class="fa fa-times element-remove"></i><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="inputs" data-element-name="'+input_name+'" class="fa fa-clone element-clone"></i><i aria-hidden="true" class="element-name" data-element-name="'+input_name+'" data-element-type="inputs">'+input_name+'</i><a class="text-editor" style="justify-content: center;align-items: center;white-space: nowrap;display: flex;font-size:40px;height:100%;" data-slide-id="'+slide_id+'" data-input-name="'+input_name+'" data-maxlength="20"  data-type="text"></a></div>');
			templateActions.editable();


			$('div[data-input-name="'+input_name+'"]')
			.draggable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.helper[0])),
						style = 'position:absolute;top: '+percent.top+'%;left: '+percent.left+'%;width: '+percent.width+'%;height: '+percent.height+'%;';

					addTmplate[slide_id]['inputs'][input_name]["style"]=style;
				}
			})
			.resizable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.helper[0])),
						style = 'position:absolute;top: '+percent.top+'%;left: '+percent.left+'%;width: '+percent.width+'%;height: '+percent.height+'%;';

					addTmplate[slide_id]['inputs'][input_name]["style"]=style;

					$('div[data-input-name="'+input_name+'"] .text-editor').each(function(i,e){
						var font_num=parseInt($(ui.element[0]).height());
						// var fontSize = (font_num-(font_num/10))+"px";
						var fontSize = font_num+"px";

						// $(this).css('height', fontSize);
						$(this).css('font-size', fontSize);
						// $(this).css('line-height', fontSize);
					})
				}
			});
		}
	});

	$(document).on('click', '.add-multi-element', function(e){
		var slide_id = templateActions.activeSlideId;

		if(slide_id != 0 && typeof addTmplate[slide_id]['slide'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov'] != 'undefined'
			&& typeof addTmplate[slide_id]['cov']
			&& typeof addTmplate[slide_id]['slide'] ){

			if(typeof addTmplate[slide_id]['mixed-media'] == 'undefined')
				addTmplate[slide_id]['mixed-media'] = {};

			var mixed_media_id = Object.keys(addTmplate[slide_id]['mixed-media']).length + 1,
				mixed_media = templateActions.getElementName(slide_id,'mixed-media');

			obj = {"position":"top:0%;left:0%;","size":"width:10%;height:18%;","desc":"mixed-media","required":true,"style":"","width":"1920","height":"1080","time":1};
			addTmplate[slide_id]['mixed-media'][mixed_media] = obj;

			$('.current-slide[data-id="'+slide_id+'"] .item-form').append('<div data-multi-element-name="'+mixed_media+'" data-slide-id="'+slide_id+'" style="z-index: 999;position: absolute;top: 0;width:50px;height:50px;border:1px solid #D84A38;" class="field multi___element empty"><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="mixed-media" data-element-name="'+mixed_media+'" class="fa fa-times element-remove"></i><i aria-hidden="true" data-slide-id="'+slide_id+'" data-type="mixed-media" data-element-name="'+mixed_media+'" class="fa fa-clone element-clone"></i><i aria-hidden="true" class="element-name" data-element-name="'+mixed_media+'" data-element-type="images">'+mixed_media+'</i><div class="btn add_mixed_media"></div></div>');
			$('[data-multi-element-name="'+mixed_media+'"]')
			.draggable({
				containment: "parent",
				stop: function(event, ui){
					var percent = templateActions.PxToPercent($(ui.helper[0]));

					addTmplate[slide_id]['mixed-media'][mixed_media]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
				}
			})
			.resizable({
				containment: "parent",
				stop: function( event, ui ) {
					var percent = templateActions.PxToPercent($(ui.element[0]));

					addTmplate[slide_id]['mixed-media'][mixed_media]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
				}
			});
		}
	})

	$(document).on('click','.element-remove',function(e){
		var slide_id = $(this).data('slide-id'),
			element_type = $(this).data('type'),
			element_name = $(this).data('element-name');

		console.log(slide_id);
		console.log(element_type);
		console.log(element_name);
		delete addTmplate[slide_id][element_type][element_name];
		if(Object.keys(addTmplate[slide_id][element_type]).length == 0)
			delete addTmplate[slide_id][element_type];

		$(this).parents('.field').remove();
	})


    $(document).on('input','.editable-input .form-control',function(e){
        templateActions.charChanges(e);
    });

    $(document).on('click','.editable-clear-x',function(e){
        templateActions.charChanges(e);
    });

    $(document).on('click','#submit-template',function(e){
		templateActions.submitTemplate('editor');
    });

	$(document).on('click','.add-new-videos-input',function(e){
		var slide_id = $(this).parent().attr('data-slide-id'),
			video_name = $(this).parent().attr('data-video-name');
			time = addTmplate[slide_id]['video'][video_name]['time'],
			style = addTmplate[slide_id]['video'][video_name]['style'];
		$('#modal .modal-content').data('slideId',slide_id).attr('data-slideId',slide_id);
		$('#modal .modal-content').data('name',video_name).attr('data-name',video_name);
		$('#modal .modal-content').data('type','video').attr('data-type','video');
		$('#modal .modal-body').html(' <div class="form-group"><label class="col-sm-12 control-label" for="time">Video duration</label><div class="col-sm-12"><input type="number" min="1" max="10" class="form-control" id="time" value="'+time+'"/></div><label class="col-sm-12 control-label" for="style">Style</label><div class="col-sm-12"><textarea class="form-control" id="style" rows="4" cols="50">'+style+'</textarea></div></div>')
		$('#modal').modal('show');
	});


	$(document).on('click','.add-new-images-inputs',function(e){
		var slide_id = $(this).parent().attr('data-slide-id'),
			image_name = $(this).parent().attr('data-image-name'),
			style = addTmplate[slide_id]['images'][image_name]['style'],
			width = addTmplate[slide_id]['images'][image_name]['width'],
			height = addTmplate[slide_id]['images'][image_name]['height'],
			placeholder = (typeof addTmplate[slide_id]['images'][image_name]['placeholders'] == 'undefined')? false : addTmplate[slide_id]['images'][image_name]['placeholders'],
			skip = (typeof addTmplate[slide_id]['images'][image_name]['skip'] == 'undefined')? false : addTmplate[slide_id]['images'][image_name]['skip'],
			skip = skip == true ? 'checked' : '',
			logo = (typeof addTmplate[slide_id]['images'][image_name]['logo'] == 'undefined')? false : addTmplate[slide_id]['images'][image_name]['logo'],
			logo = logo == true ? 'checked' : '',
			placeholder_str = '<div id="placeholder" style="'+( (logo)?"":"display: none;")+'"><label class="col-sm-12 control-label" for="placekolder">Placeholder</label><div class="col-sm-12"><select class="form-control">';


		templateActions.getLogos();
		for(row in logos.rows){
			placeholder_str += '<option '+(logos.rows[row].path == placeholder?"selected":"")+' data-path="'+logos.rows[row].path+'">'+logos.rows[row].original_name+'</option>';
		}


		placeholder_str += '</select></div></div>';

		$('#modal .modal-content').data('slideId',slide_id).attr('data-slideId',slide_id);
		$('#modal .modal-content').data('name',image_name).attr('data-name',image_name);
		$('#modal .modal-content').data('type','images').attr('data-type','images');
		$('#modal .modal-body').html(' <div class="form-group"><label class="col-sm-12 control-label" for="width">Width</label><div class="col-sm-12"><input type="type"  class="form-control" id="width" value="'+width+'"/></div><label class="col-sm-12 control-label" for="height">Height</label><div class="col-sm-12"><input type="type"  class="form-control" id="height" value="'+height+'"/></div>'+placeholder_str+'<label class="col-sm-12 control-label" for="skip">Skip</label><div class="col-sm-12"><input style="width: 2em;" type="checkbox" class="form-control" id="skip" '+skip+' /></div><label class="col-sm-12 control-label" for="logo">Logo</label><div class="col-sm-12"><input style="width: 2em;" type="checkbox" class="form-control" id="logo" '+logo+' /></div><label class="col-sm-12 control-label" for="style">Style</label><div class="col-sm-12"><textarea class="form-control" id="style" rows="4" cols="50">'+style+'</textarea></div></div>')
		$('#modal').modal('show');
	});

	$(document).on('change','#logo',function(){
		if($(this).is(':checked')){
			$('#placeholder').show();
		}else{
			$('#placeholder').hide();
		}
	})

	$(document).on('click','#styleSelector',function(e){
		var slide_id = $('.editable-input').attr('data-slideId'),
			inputs_name = $('.editable-input').attr('data-name'),
			style = addTmplate[slide_id]['inputs'][inputs_name]['text_style'].replace(/color:(#(?:[\da-f]{3}){1,2}|rgb\((?:\d{1,3},\s*){2}\d{1,3}\)|rgba\((?:\d{1,3},\s*){3}\d*\.?\d+\)|hsl\(\d{1,3}(?:,\s*\d{1,3}%){2}\)|hsla\(\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\));/gi, "").replace(/(justify-content:([\w\-]+));/g, ""),
			max = addTmplate[slide_id]['inputs'][inputs_name]['max'],
			text = addTmplate[slide_id]['inputs'][inputs_name]['type'] == 'text' ? 'selected':'',
			textarea = addTmplate[slide_id]['inputs'][inputs_name]['type'] == 'textarea' ? 'selected':'',
			element = $('.current-slide[data-id="'+slide_id+'"] .text-editor[data-input-name="'+inputs_name+'"]'),

			justify_content = element.css('justify-content'),
			left = '',
			center = '',
			rigth = '';

			if(justify_content == 'center'){
				center = 'selected';
			}else if(justify_content == 'flex-end'){
				rigth = 'selected';
			}else{
				left = 'selected';
			}
		$('#modal .modal-content').data('slideId',slide_id).attr('data-slideId',slide_id);
		$('#modal .modal-content').data('name',inputs_name).attr('data-name',inputs_name);
		$('#modal .modal-content').data('type','inputs').attr('data-type','inputs');
		$('#modal .modal-body').html(' <div class="form-group"><label class="col-sm-12 control-label" for="max">Max</label><div class="col-sm-12"><input type="number" min="1" max="50" class="form-control" id="max" value="'+max+'"/></div><label class="col-sm-12 control-label" for="type">Type</label><div class="col-sm-12"><select class="form-control" id="type" value="'+max+'"><option value="text" '+text+'>Text</option><option value="textarea" '+textarea+'>Textarea</option><select></div><label class="col-sm-12 control-label" for="text_align">Text align</label><div class="col-sm-12"><select class="form-control" id="text_align"><option value="flex-start" '+left+'>Left</option><option value="center" '+center+'>Center</option><option value="flex-end" '+rigth+'>Rigth</option><select></div><label class="col-sm-12 control-label" for="style">Style</label><div class="col-sm-12"><textarea class="form-control" id="style" rows="4" cols="50">'+style+'</textarea></div></div>')
		$('#modal').modal('show');
	});

	$(document).on('click','.element-style',function(e){
		var slide_id = $(this).parents('.current-slide').attr('data-id'),
			element_name = $(this).parents('.element___file').attr('data-element-name'),
			style = addTmplate[slide_id]['element'][element_name]['style'];


		$('#modal .modal-content').data('slideId',slide_id).attr('data-slideId',slide_id);
		$('#modal .modal-content').data('name',element_name).attr('data-name',element_name);
		$('#modal .modal-content').data('type','element').attr('data-type','element');
		$('#modal .modal-body').html('<div class="form-group"><label class="col-sm-12 control-label" for="style">Style</label><div class="col-sm-12"><textarea class="form-control" id="style" rows="4" cols="50">'+style+'</textarea></div></div>')
		$('#modal').modal('show');
	});

	$(document).on('click','.add_mixed_media',function(e){
		var slide_id = $(this).parent().attr('data-slide-id'),
			mixed_media = $(this).parent().attr('data-multi-element-name'),
			style = addTmplate[slide_id]['mixed-media'][mixed_media]['style'],
			width = addTmplate[slide_id]['mixed-media'][mixed_media]['width'],
			height = addTmplate[slide_id]['mixed-media'][mixed_media]['height'],
			time = addTmplate[slide_id]['mixed-media'][mixed_media]['time'];

		$('#modal .modal-content').data('slideId',slide_id).attr('data-slideId',slide_id);
		$('#modal .modal-content').data('name',mixed_media).attr('data-name',mixed_media);
		$('#modal .modal-content').data('type','mixed-media').attr('data-type','mixed-media');
		$('#modal .modal-body').html(' <div class="form-group"><label class="col-sm-12 control-label" for="width">Width</label><div class="col-sm-12"><input type="type"  class="form-control" id="width" value="'+width+'"/></div><label class="col-sm-12 control-label" for="height">Height</label><div class="col-sm-12"><input type="type"  class="form-control" id="height" value="'+height+'"/></div><label class="col-sm-12 control-label" for="time">Video duration</label><div class="col-sm-12"><input type="number" min="1" max="10" class="form-control" id="time" value="'+time+'"></div><label class="col-sm-12 control-label" for="style">Style</label><div class="col-sm-12"><textarea class="form-control" id="style" rows="4" cols="50">'+style+'</textarea></div></div>')
		$('#modal').modal('show');
	});

	$(document).on('click','.element-clone',function(e){
		var slide_id = $(this).parents('.current-slide').attr('data-id'),
			element_type = $(this).attr('data-type');

			if(element_type == 'inputs'){
				var element_name = $(this).parents('.text').attr('data-input-name');
					templateActions.cloneInputs(slide_id,element_name);
			}
			else if(element_type == 'video'){
				var element_name = $(this).parents('.video___file').attr('data-video-name');
					templateActions.cloneVideo(slide_id,element_name);
			}
			else if(element_type == 'images'){
				var element_name = $(this).parents('.image___file').attr('data-image-name');
					templateActions.cloneImage(slide_id,element_name);
			}
			else if(element_type == 'element'){
				var element_name = $(this).parents('.element___file').attr('data-element-name');
					templateActions.cloneElement(slide_id,element_name);
			}
			else if(element_type == 'graphs'){
				var element_name = $(this).parents('.image___graph').attr('data-graph-name');
					templateActions.cloneGraph(slide_id,element_name);
			}
			else if(element_type == 'graphics'){
				var element_name = $(this).parents('.icon___file').attr('data-element-name');
					templateActions.cloneIcon(slide_id,element_name);

			}else if(element_type == 'mixed-media'){
				var element_name = $(this).parents('.multi___element').attr('data-multi-element-name');
					templateActions.cloneMultiElement(slide_id,element_name);
			}
	})

	$(document).on('click','#save',function(e){
		var _this = $(this).parents('.modal-content'),
			slide_id = _this.data('slideId'),
			name = _this.data('name'),
			type = _this.data('type');

		if(type == 'video'){
			var style =_this.find('#style').val();
			addTmplate[slide_id][type][name]['time'] = parseInt(_this.find('#time').val());
			addTmplate[slide_id][type][name]['style'] = style;
			var element = $('.current-slide[data-id="'+slide_id+'"] .video___file[data-video-name="'+name+'"]');
			element.attr('style',element.attr('style')+style);
		}else if(type == 'images'){
			var style =_this.find('#style').val();
			addTmplate[slide_id][type][name]['width'] = _this.find('#width').val();
			addTmplate[slide_id][type][name]['height'] = _this.find('#height').val();
			addTmplate[slide_id][type][name]['style'] = _this.find('#style').val();
			addTmplate[slide_id][type][name]['skip'] = _this.find('#skip').prop('checked');
			addTmplate[slide_id][type][name]['logo'] = _this.find('#logo').prop('checked');

			if(addTmplate[slide_id][type][name]['logo']){
				addTmplate[slide_id][type][name]['placeholders'] = $('#placeholder option:selected').data('path');
			}else{
				delete addTmplate[slide_id][type][name]['placeholders'];
			}

			var element = $('.current-slide[data-id="'+slide_id+'"] .image___file[data-image-name="'+name+'"]');
			element.attr('style',element.attr('style')+style);

		}else if(type == 'inputs'){
			var element = $('.current-slide[data-id="'+slide_id+'"] .text-editor[data-input-name="'+name+'"]'),
				justify_content = _this.find('#text_align').val(),
				color_in_style = _this.find('#style').val().match(/color:#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b\;/g);
				//style_color = (!color_in_style || typeof color_in_style[0] == 'undefined')?"#000000":color_in_style[0];

			element.attr('style',element.attr('style')+'justify-content:'+justify_content+';'+_this.find('#style').val());
			addTmplate[slide_id][type][name]['text_style'] ='color:'+element.css('color')+';justify-content:'+element.css('justify-content')+';'+_this.find('#style').val();
			addTmplate[slide_id][type][name]['max'] = _this.find('#max').val();
			addTmplate[slide_id][type][name]['type'] = _this.find('#type').val();

			if(_this.find('#type').val() == 'textarea'){
				element.attr('data-type','textarea');
				element.css('white-space','normal').css('height','');
			}else{
				element.attr('data-type','text');
				element.css('white-space','nowrap').css('height','100%');
			}

			//$('.editable-input').find('.form-control').css('color',style_color);
			//$('a[data-slide-id="'+slide_id+'"][data-input-name="'+name+'"]').data('color',style_color).attr('data-color',style_color.match(/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/g)[0]);
		}else if(type == 'element'){
			var element = $('.current-slide[data-id="'+slide_id+'"] .element___file[data-element-name="'+name+'"]'),
				color_in_style = _this.find('#style').val();

			element.attr('style',element.attr('style')+_this.find('#style').val());
			addTmplate[slide_id][type][name]['style'] =_this.find('#style').val();

		}else if(type == 'slide'){
			addTmplate[slide_id]['length'] = _this.find('#length').val();
			addTmplate[slide_id]['background-color'] = _this.find('#background-color').prop('checked');
			addTmplate[slide_id]['background1'] = _this.find('#backgroundColor').data('color');

			if(typeof _this.find('#aep_file').val() != 'undefined'){
				templateActions.uploadAep(slide_id,addTmplateInsert['aep_file']);
			}else{
				addTmplate[slide_id]['aep'] = false;
			}
			if(typeof _this.find('#slide-video').val() != 'undefined'){
				templateActions.uploadSlideVideo(slide_id,addTmplateInsert['slide_video']);
			}
			if(_this.find('#slide-duration').val()){
				addTmplate[slide_id]['slide_duration'] = _this.find('#slide-duration').val();
			}
			if(isNaN(parseInt(_this.find('#category-tag').val())) == false){
				addTmplate[slide_id]['category_tag'] = parseInt(_this.find('#category-tag').val());
			}
			if(typeof _this.find('#aep').val() != 'undefined'){
				addTmplate[slide_id]['aep'] = _this.find('#aep').val();
			}else{
				addTmplate[slide_id]['aep'] = false;
			}

			if(_this.find('#show-slide').length){

				addTmplate[slide_id]['show-slide'] = _this.find('#show-slide').prop('checked');
			}
		}else if(type == 'order'){
			var new_ordered_element = {},
				element_type = _this.data('element-type'),
				slide_id = templateActions.activeSlideId;

			$.each($( "#sortable li" ),function(i,v){
				var element_name = $(v).data('element-name');

				new_ordered_element[element_name] = addTmplate[slide_id][element_type][element_name];
			})

			addTmplate[slide_id][element_type] = new_ordered_element;

		}else if(type == 'mixed-media'){
			var style =_this.find('#style').val();
			addTmplate[slide_id][type][name]['width'] = _this.find('#width').val();
			addTmplate[slide_id][type][name]['height'] = _this.find('#height').val();
			addTmplate[slide_id][type][name]['style'] = _this.find('#style').val();
			addTmplate[slide_id][type][name]['time'] = parseInt(_this.find('#time').val());

			var element = $('.current-slide[data-id="'+slide_id+'"] .multi___element[data-multi-element-name="'+name+'"]');
			element.attr('style',element.attr('style')+style);
		}
		$('#modal').modal('hide');
	});

	$(document).on('click','.add-background',function(e){
		var slide_id = templateActions.activeSlideId;
		if(typeof addTmplate[slide_id]['slide-background-color'] == 'undefined'){
			addTmplate[slide_id]['slide-background-color'] = 'true';
			$('.current-slide.item-form[data-id="'+slide_id+'"]').append('<div class="background-slide"><i class="fa fa-tint"></i></div>');
		}else{
			delete addTmplate[slide_id]['slide-background-color'];
			$('.current-slide.item-form[data-id="'+slide_id+'"]').find('.background-slide').remove();
		}
	})

	$(document).on('click','.refresh-slide',function(evt){
		var slide_id = $(evt.target).parents('.current-slide').data('id'),
			slide_path = $(evt.target).parents('.current-slide').find('img').attr('src');

		if(slide_id != 0 && typeof addTmplate[slide_id]['cov'] != 'undefined' && addTmplate[slide_id]['cov']){
			$('#img-upload .image_type').val('refresh-slide');
			$('#img-upload .slide_id').val(slide_id);
			$('#img-upload .slide_path').val(slide_path);
			$('#img-upload').click();
		}
	});

	$(document).on('click','.change-order',function(e){
		e.stopPropagation();
		var str = '<ul id="sortable">',
			type = $(this).data('type');

		if(typeof addTmplate[templateActions.activeSlideId][type] != "undefined"){
			$('#modal .modal-content').data('type','order');
			$('#modal .modal-content').data('element-type',type);

			$.each(addTmplate[templateActions.activeSlideId][type],function(i,v){
				str += '<li data-element-name="'+i+'" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'+i+'</li>';
			})
			str += '</ul>'

			$('#modal .modal-body').html(str);
			$( "#sortable" ).sortable({
				placeholder: "ui-state-highlight"
			});
			$( "#sortable" ).disableSelection();
			$('#modal').modal('show');
		}else{
			alert('This silde have not '+type+' element.');
		}
	});

	$(document).on('click','.add-new-group',function(e){
		// $('#modal .modal-body').html(' <div class="form-group"><label class="col-sm-12 control-label" for="name">Name</label><div class="col-sm-12"><input type="text" class="form-control" id="name"/></div><form id="dropzone_icon" action="/target" style="height: 100%;" class="dropzone dz-clickable"><input type="hidden" name="template_id" value="98"><input type="hidden" name="folder" value="/mini-explainer"></form></div>')
		$('#modal_add_icon_group').modal('show');
	});

	$(document).on('click','#add_new_icon_group',function(e){
		$('.error').remove();
		var name = $('#modal_add_icon_group input[name="name"]'),
			form = new FormData($('#icon_form')[0]);

		if(name.val().length == 0){
				name.after('<p class="error" style="color: red;">This value is required.</p>');
		}else{
			$('body').append('<div id="lodaingGif" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999999;"><div class="loding" style="width: 65px;height: 50px;margin: 318px auto;"><div data-loader="circle-side"></div></div></div>');
			$.ajax({
					method:"POST",
					url: '/admin/icon-upload',
					data: form,
					contentType: false,
					processData: false,
					success: function(data){
						if(data.success == true){
							$('#lodaingGif').remove();
							$('#icon-group').val('');
							$('#modal_add_icon_group').modal('hide');
							$('#modal_icon_group_list .mCSB_container').append('<label class="col-sm-12 control-label">'+data.name+'<div class="col-sm-12"><input style="width: 2em;" type="checkbox" value="'+data.id+'" class="form-control"></div></label>')
						}
					}
			})
		}
	});

	$(document).on('click','.show-all-element',function(e){
		e.stopPropagation();
		var str = '',
			slides_count = Object.keys(addTmplate).length,
			width = 100/slides_count;
		$('#modal .modal-dialog').width('inherit');

		$.each(addTmplate,function(i,v){
			str += '<div style="float:left;width:'+width+'%">';
			$.each(v,function(index,value){
				if(typeof value == 'object'){
					str += '<ul id="sortable">';
					$.each(value,function(ind,val){
						str += '<li data-element-name="'+ind+'" data-slide-id="'+i+'" class="ui-state-default order-element"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'+ind+'</li>';
					})
					str += '</ul>';
				}

			})
			str += '</div>';

		})

		$('#modal .modal-body').html(str);
		$('#modal').modal('show');
	});

	$(document).on('click','.order-element',function(){
		var element_name = $(this).data('element-name'),
			slide_id = $(this).data('slide-id');

		$('.image-container[data-id="'+slide_id+'"]').click();
		$('#modal').modal('hide');
	})

	$('#modal').on('hidden.bs.modal', function () {
		$('#modal .modal-dialog').width(300);
	})

	$("#dropzone_icon").dropzone({
        dictDefaultMessage: "DROP YOUR ICON HERE OR CLICK TO UPLOAD",
        previewTemplate:"",
        url:"/admin/icon-upload",
        acceptedFiles:"",
        addedfile: function (file) {},
		thumbnail: function (file, dataUrl) {},
		uploadprogress: function (file, progress, bytesSent) {
		},
		success:function(file,success){
			if(success.success){
				templateActions.showIconGroup({1:success});
			}
		},
		sending:function(file,data,token){
		}
	});

	$(document).on('click','.icon-group-list',function(e){
		// $('#modal .modal-body').html(' <div class="form-group"><label class="col-sm-12 control-label" for="name">Name</label><div class="col-sm-12"><input type="text" class="form-control" id="name"/></div><form id="dropzone_icon" action="/target" style="height: 100%;" class="dropzone dz-clickable"><input type="hidden" name="template_id" value="98"><input type="hidden" name="folder" value="/mini-explainer"></form></div>')
		if(Object.keys(template_icons).length){
		$.each(template_icons,function(key,val){
			var element = $('#modal_icon_group_list').find('input[value="'+val+'"]');
			$(element).attr('checked',true);
		});
	}
		$('#modal_icon_group_list').modal('show');
	});

	$(document).on('click','#add_new_icons_template',function(){
		var i = 0,
			j = 0;
		template_icons = {};

		$('#modal_icon_group_list').find('input').each(function(key,val){
			j++;
			if($(val).prop('checked')){
				i++;
				template_icons[i] = $(val).val();
			}

			if($('#modal_icon_group_list').find('input').length == j){
				$.post('/admin/update-template-icons',{template_id:template_id,icon_groups:JSON.stringify(template_icons)}).done(function( data ) {
					if(data.success){
						$('#modal_icon_group_list').modal('hide');
					}
				});
			}
		});
	});

	$(document).on('change','#graphic',function(){
		var _this = $(this);
		var graphic = $(this).prop('checked');
		_this.attr('disabled',true);
		$.post('/admin/graphic-change',{template_id:template_id,graphic:graphic}).done(function( data ) {
			if(data.success){
				if(data.graphic == 'true'){
					_this.attr('checked',true);
				}else{
					_this.attr('checked',false);
				}
			}else{
				if(graphic == 'true'){
					_this.attr('checked',true);
				}else{
					_this.attr('checked',false);
				}
			}
			_this.removeAttr('disabled');
		});
	});

	$(document).on('change','.plan_checkbox',function(){
		var _this = $(this);
		var plans = [];
		$('.plan_checkbox').each(function(key,val){
			if($(val).prop('checked')){
				plans.push($(val).val());
			}
		})

		_this.attr('disabled',true);
		$.post('/admin/update-plan',{template_id:template_id,plan:JSON.stringify(plans)}).done(function( data ) {
			if(data.success){
				_this.attr('checked',true);
			}else{
				_this.attr('checked',false);
			}
			_this.removeAttr('disabled');
		});
	});


	$(document).on('change','#category-tag',function(){
		if($(this).val() == 'add-new'){
			$('#category-tag-modal').modal('show');
		}
	});

	$(document).on('click','#add_category_tag',function(evt){
		var category = $('#category-tag-modal input[name="category-tag"]').val();
		if(category.length > 0){
			$.post('/admin/add-category-tag',{category:category}).done(function( data ) {
				if(data.success){
					if($('#modal #category-tag').length){
						$('#modal #category-tag option[value="add-new"]').before('<option value="'+data.id+'">'+data.name+'</option>');
					}
					$('#category-tag-modal').modal('hide');
					category_tag_options = data.all_categorys_slides
				}
			});
		}
	});

});











function TemplateActions(){
	this.activeSlide = 0;
	this.activeSlideId = 0;
	this.type = type;
	this.SlideMaxDuration = 20;
}

TemplateActions.prototype.PxToPercent = function(element){
	var element_width = element.width(),
		element_height = element.height(),
		element_top = element.position().top,
		element_left = element.position().left,

		parent = element.parent('div'),

		parent_width = parent.width(),
		parent_height = parent.height(),

		// element_percent_width = Math.round(100*element_width/parent_width),
		// element_percent_height = Math.round(100*element_height/parent_height),
		// element_percent_top = Math.round(100*element_top/parent_height),
		// element_percent_left = Math.round(100*element_left/parent_width),

		element_percent_width = 100*element_width/parent_width,
		element_percent_height = 100*element_height/parent_height,
		element_percent_top = 100*element_top/parent_height,
		element_percent_left = 100*element_left/parent_width,

		obj = {"width":element_percent_width,"height":element_percent_height,"top":element_percent_top,"left":element_percent_left};

	return obj;
};

TemplateActions.prototype.charChanges = function(e) {
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

TemplateActions.prototype.getElementName = function(slide_id,element_type) {
	var element_first_name = '';
	switch(element_type) {
		case 'inputs':
			element_first_name = 'text'
			break;
		case 'video':
			element_first_name = 'video'
			break;
		case 'images':
			element_first_name = 'image'
			break;
		case 'element':
			element_first_name = 'element'
			break;
		case 'graphs':
			element_first_name = 'graph'
			break;
		case 'graphics':
			element_first_name = 'graphic'
			break;
		case 'mixed-media':
			element_first_name = 'mixed-media'
			break;
	}

	var bool = true,
		object_keys = Object.keys(addTmplate[slide_id][element_type]),
		text_count = object_keys.length+1,
		element_name = element_first_name+slide_id+'.'+text_count;

	while(bool){
		element_name = element_first_name+slide_id+'.'+text_count;
		text_count++;

		if(object_keys.indexOf(element_name) == -1){
			bool = false;
		}
	}

	return element_name;
};

TemplateActions.prototype.editorShow = function(e,editable) {
	var editabl = $(editable.container.$form[0]),
		editable_input = editabl.find('.editable-input'),
        editable_buttons = editabl.find('.editable-buttons'),
        maxlength = $(e.target).data('maxlength'),
        slide_id = $(e.target).attr('data-slide-id'),
        name = $(e.target).attr('data-input-name'),
        existing_color = ($(e.target).css('color'))?this.rgb2hex($(e.target).css('color')):"#0000ff";

    editable_input.find('.form-control').css('color',existing_color);
    editable_input.attr('data-slideId',slide_id);
	editable_input.attr('data-name',name);

    editable_buttons.append('<button type="button" id="colorSelector" class="btn red btn-c btn-sm editable-cancel"><i class="fa fa-tint"></i></button>');
    editable_buttons.append('<button type="button" id="styleSelector" class="btn red btn-c btn-sm editable-cancel"><i class="fa fa-arrows-alt"></i></button>');
    //editable_buttons.append('<button type="button" id="clone" class="btn red btn-c btn-sm editable-cancel"><i class="fa fa-clone fa-lg"></i></button>');

    // IgorKiev 2016-05-14
    console.log(maxlength);
    var openedPopover = editabl.parents('.popover.in');
    if (openedPopover.offset().top < 0) {
    	console.log('asdfasdf');
    	setTimeout(function() {$('.popover.in').css('top', 20);}, 500);
    };

	    $('#colorSelector').ColorPicker({
	        color: existing_color,
	        onShow: function (colpkr) {
				$('body').append('<div class="ColorPicker" style="z-index:999; position: fixed;top: 0;left: 0;width: 100%;height: 100%;"></div>');
	            $(colpkr).fadeIn(500);
	            return false;
	        },
	        onHide: function (colpkr) {
				$('.ColorPicker').remove();
	            $(colpkr).fadeOut(500);
	            return false;
	        },
	        onChange: function (hsb, hex, rgb) {
	            $(e.target).data('color','#'+hex).attr('data-color','#'+hex);
	            editable_input.find('.form-control').css('color','#'+hex);
	        }
	    })
};

TemplateActions.prototype.editorHide = function() {
        $('.colorpicker').hide();
        if($('.colorpicker').length >= 2)
            $('.colorpicker:eq(0)').remove();
};

TemplateActions.prototype.rgb2hex = function(orig) {
	var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
	return (rgb && rgb.length === 4) ? "#" +
			("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
};

TemplateActions.prototype.success = function(response,newValue) {
	var text_color = $(this).attr('data-color'),
		input_id = $(this).data('input-name'),
		slide_id=$(this).data('slide-id');
	if(!slide_id || !input_id) {throw('no slide id or input id')}

	addTmplate[slide_id]['inputs'][input_id]['value'] = newValue;
	if(typeof text_color != 'undefined'){
		var style = addTmplate[slide_id]['inputs'][input_id]['text_style'].replace(/color:(#(?:[\da-f]{3}){1,2}|rgb\((?:\d{1,3},\s*){2}\d{1,3}\)|rgba\((?:\d{1,3},\s*){3}\d*\.?\d+\)|hsl\(\d{1,3}(?:,\s*\d{1,3}%){2}\)|hsla\(\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\));/gi, "");
		addTmplate[slide_id]['inputs'][input_id]['text_style'] = style + "color:"+text_color+";";
	}

	$(this).css('color',text_color);
	/*$(this).data('color',text_color);
	console.log($(this).data('color'));*/
};

TemplateActions.prototype.changeSlideById = function(slideId) {
    $('.current-slide').hide().removeClass('active-slide');
    $('.current-slide[data-id="'+slideId+'"]').show().addClass('active-slide');
    this.activeSlide = $('.current-slide').find('[data-id='+slideId+']');
    this.activeSlideId = slideId;
    Utils.Layout.init();
}

TemplateActions.prototype.saveElementName = function(e,new_value) {
	var element_type = e.data('element-type'),
		element_name = e.data('element-name'),
		parent_attribute = '';

	if(typeof addTmplate[this.activeSlideId][element_type] != 'undefined' && typeof addTmplate[this.activeSlideId][element_type][element_name] != 'undefined' && new_value){
		var element = addTmplate[this.activeSlideId][element_type][element_name];

		if(typeof addTmplate[this.activeSlideId][element_type][new_value] != 'undefined'){
			alert('The key already exist.');
			return false;
		}

		switch(element_type) {
			case 'images':
				parent_attribute = 'image';
				break;
			case 'graphs':
				parent_attribute = 'graph';
				break;
			case 'video':
				parent_attribute = 'video';
				break;
			case 'inputs':
				parent_attribute = 'input';
				break;
			case 'element':
				parent_attribute = 'element';
				break;
			case 'graphics':
				parent_attribute = 'element';
				break;
		}

		var parent_element = e.parents('.field').data(parent_attribute+'-name',new_value).attr('data-'+parent_attribute+'-name',new_value);
		parent_element.find('.element-remove').data('element-name',new_value).attr('data-element-name',new_value);
		parent_element.find('.text-editor').data('input-name',new_value).attr('data-input-name',new_value);

		e.data('element-name',new_value).attr('data-element-name',new_value);
		addTmplate[this.activeSlideId][element_type][new_value] = element;
		delete addTmplate[this.activeSlideId][element_type][element_name];
		return true;
	}else{
		alert('Something is wrong, please remove this element.');
		return false;
	}
}

TemplateActions.prototype.submitTemplate = function(e) {
	$.ajax({
		method:"post",
		url: "/admin/save-template",
		data:{template_id: template_id, tmplate_data: JSON.stringify(addTmplate)},
		dataType:'json',
		success: function(data){
			if(data.success){
				if(e == 'editor')
					window.location.href = '/editor/'+template_id+'';
			}
		}
	});
};

TemplateActions.prototype.uploadAep = function(slide_id,data) {
	$.ajax({
		method:"post",
		url: "/admin/upload-aep",
		data: {folder_name: $('#img-upload .folder_name').val(), file_data: data},
		dataType: 'json',
		success: function(data){
			if(data.success){
				addTmplate[slide_id]['aep_file'] = data.path
			}
		}
	});
};

TemplateActions.prototype.getLogos = function() {
	$.ajax({
		method:"post",
		url: "/admin/get-logos",
		dataType: 'json',
		async : false,
		success: function(data){
			logos = data;
		}
	});
};

TemplateActions.prototype.uploadSlideVideo = function(slide_id,data) {
	$.ajax({
		method:"post",
		url: "/admin/upload-slide-video",
		data: {folder_name: $('#img-upload .folder_name').val(), file_data: data},
		dataType: 'json',
		success: function(data){
			if(data.success){
				addTmplate[slide_id]['slide_video'] = data.path
			}
		}
	});
};

TemplateActions.prototype.editable = function() {
	$('div .text-editor').editable({
		name: 'slide[]',
		success:templateActions.success
	});
	$('.text-editor').unbind('shown');
	$('.text-editor').unbind('hidden');
	$('.text-editor').on('hidden',function(e, reason){
		templateActions.editorHide();
	});
	$('.text-editor').on('shown',function(e, editable){
		// $('.editable-container').hide();
		templateActions.editorShow(e,editable);
	});
};

TemplateActions.prototype.cloneInputs = function(slide_id,inputs_name){
	var	element = $('.current-slide[data-id="'+slide_id+'"] .text[data-input-name="'+inputs_name+'"]'),
		clone_element_name = templateActions.getElementName(slide_id,'inputs'),
		cloned_element = element.clone().attr('data-input-name',clone_element_name).css({"top": "0%", "left": "0%"});

		cloned_element.find('.element-name').data('element-name',clone_element_name).attr('data-element-name',clone_element_name).html(clone_element_name);

		$('.app-middle .current-slide[data-id="'+slide_id+'"]').append(cloned_element);


		$('.app-middle .text[data-input-name="'+clone_element_name+'"] a').attr('data-input-name',clone_element_name);
		$('.app-middle .text[data-input-name="'+clone_element_name+'"] .element-remove').attr('data-element-name',clone_element_name);

		$('.app-middle .text[data-input-name="'+clone_element_name+'"] .ui-resizable-handle').remove();

		addTmplate[slide_id]['inputs'][clone_element_name] = Object.assign({},addTmplate[slide_id]['inputs'][inputs_name]);

		$('.app-middle .text[data-input-name="'+clone_element_name+'"]')
		.draggable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					style = 'position:absolute;top: '+percent.top+'%;left: '+percent.left+'%;width: '+percent.width+'%;height: '+percent.height+'%;',
					slide_id = $(ui.helper[0]).data('slide-id'),
					input_name = $(ui.helper[0]).data('input-name');

				addTmplate[slide_id]['inputs'][input_name]["style"]=style;
			}
		})
		.resizable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					style = 'position:absolute;top: '+percent.top+'%;left: '+percent.left+'%;width: '+percent.width+'%;height: '+percent.height+'%;',
					slide_id = $(ui.element[0]).data('slide-id'),
					input_name = $(ui.element[0]).data('input-name');

				addTmplate[slide_id]['inputs'][input_name]["style"]=style;

				$('div[data-input-name="'+input_name+'"] .text-editor').each(function(i,e){
					var font_num=parseInt($(ui.element[0]).height());
					var fontSize = font_num+"px";

					$(this).css('height', fontSize);
					$(this).css('font-size', fontSize);
				})
			}
		});

		templateActions.editable();
};

TemplateActions.prototype.cloneVideo = function(slide_id,video_name){
	var	element = $('.current-slide[data-id="'+slide_id+'"] .video___file[data-video-name="'+video_name+'"]'),
		clone_element_name = templateActions.getElementName(slide_id,'video'),
		cloned_element = element.clone().attr('data-video-name',clone_element_name).css({"top": "0%", "left": "0%"});

		cloned_element.find('.element-name').data('element-name',clone_element_name).attr('data-element-name',clone_element_name).html(clone_element_name);

		$('.app-middle .current-slide[data-id="'+slide_id+'"]').append(cloned_element);

		$('.app-middle .video___file[data-video-name="'+clone_element_name+'"] .element-remove').attr('data-element-name',clone_element_name);

		$('.app-middle .video___file[data-video-name="'+clone_element_name+'"] .ui-resizable-handle').remove();

		addTmplate[slide_id]['video'][clone_element_name] = Object.assign({},addTmplate[slide_id]['video'][video_name]);


		$('.app-middle .current-slide .video___file[data-video-name="'+clone_element_name+'"]')
		.draggable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
					size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
					slide_id = $(ui.helper[0]).data('slide-id'),
					video_name = $(ui.helper[0]).data('video-name');

				addTmplate[slide_id]['video'][video_name]["position"]=position;
				addTmplate[slide_id]['video'][video_name]["size"]=size;
			}
		})
		.resizable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.element[0]));
					position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
					size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
					slide_id = $(ui.element[0]).data('slide-id'),
					video_name = $(ui.element[0]).data('image-name');

				addTmplate[slide_id]['video'][video_name]["position"]=position;
				addTmplate[slide_id]['video'][video_name]["size"]=size;
			}
		});

};

TemplateActions.prototype.cloneImage = function(slide_id,image_name){
	var	element = $('.current-slide[data-id="'+slide_id+'"] .image___file[data-image-name="'+image_name+'"]'),
		clone_element_name = templateActions.getElementName(slide_id,'images'),
		cloned_element = element.clone().attr('data-image-name',clone_element_name).css({"top": "0%", "left": "0%"});

		cloned_element.find('.element-name').data('element-name',clone_element_name).attr('data-element-name',clone_element_name).html(clone_element_name);

		$('.app-middle .current-slide[data-id="'+slide_id+'"]').append(cloned_element);

		$('.app-middle .image___file[data-image-name="'+clone_element_name+'"] .element-remove').attr('data-element-name',clone_element_name);

		$('.app-middle .image___file[data-image-name="'+clone_element_name+'"] .ui-resizable-handle').remove();

		addTmplate[slide_id]['images'][clone_element_name] = Object.assign({},addTmplate[slide_id]['images'][image_name]);

		$('.app-middle .current-slide .image___file[data-image-name="'+clone_element_name+'"]')
		.draggable({
			containment: "parent",
			stop: function(event, ui){
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					slide_id = $(ui.helper[0]).data('slide-id'),
					image_name = $(ui.helper[0]).data('image-name');
					console.log(image_name);

				addTmplate[slide_id]['images'][image_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
			}
		})
		.resizable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.element[0])),
					slide_id = $(ui.element[0]).data('slide-id'),
					image_name = $(ui.element[0]).data('image-name');

				addTmplate[slide_id]['images'][image_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
			}
		});
};

TemplateActions.prototype.cloneMultiElement = function(slide_id,multi_element){
	var	element = $('.current-slide[data-id="'+slide_id+'"] .multi___element[data-multi-element-name="'+multi_element+'"]'),
		clone_element_name = templateActions.getElementName(slide_id,'mixed-media'),
		cloned_element = element.clone().attr('data-multi-element-name',clone_element_name).css({"top": "0%", "left": "0%"});

		cloned_element.find('.element-name').data('element-name',clone_element_name).attr('data-element-name',clone_element_name).html(clone_element_name);

		$('.app-middle .current-slide[data-id="'+slide_id+'"]').append(cloned_element);

		$('.app-middle .multi___element[data-multi-element-name="'+clone_element_name+'"] .element-remove').attr('data-element-name',clone_element_name);

		$('.app-middle .multi___element[data-multi-element-name="'+clone_element_name+'"] .ui-resizable-handle').remove();

		addTmplate[slide_id]['mixed-media'][clone_element_name] = Object.assign({},addTmplate[slide_id]['mixed-media'][multi_element]);

		$('.app-middle .current-slide .multi___element[data-multi-element-name="'+clone_element_name+'"]')
		.draggable({
			containment: "parent",
			stop: function(event, ui){
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					slide_id = $(ui.helper[0]).data('slide-id'),
					multi_element = $(ui.helper[0]).data('multi-element-name');
					console.log($(ui.helper[0]));

				addTmplate[slide_id]['mixed-media'][multi_element]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
			}
		})
		.resizable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.element[0])),
					slide_id = $(ui.element[0]).data('slide-id'),
					multi_element = $(ui.element[0]).data('multi-element-name');

				addTmplate[slide_id]['mixed-media'][multi_element]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
			}
		});
};

TemplateActions.prototype.cloneElement = function(slide_id,element_name){
	var	element = $('.current-slide[data-id="'+slide_id+'"] .element___file[data-element-name="'+element_name+'"]'),
		clone_element_name = templateActions.getElementName(slide_id,'element'),
		cloned_element = element.clone().attr('data-element-name',clone_element_name).css({"top": "0%", "left": "0%"});

		cloned_element.find('.element-name').data('element-name',clone_element_name).attr('data-element-name',clone_element_name).html(clone_element_name);

		$('.app-middle .current-slide[data-id="'+slide_id+'"]').append(cloned_element);

		$('.app-middle .element___file[data-element-name="'+clone_element_name+'"] .element-remove').attr('data-element-name',clone_element_name);

		$('.app-middle .element___file[data-element-name="'+clone_element_name+'"] .ui-resizable-handle').remove();

		addTmplate[slide_id]['element'][clone_element_name] = Object.assign({},addTmplate[slide_id]['element'][element_name]);

		$('.app-middle .current-slide .element___file[data-element-name="'+clone_element_name+'"]')
		.draggable({
			containment: "parent",
			stop: function(event, ui){
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					slide_id = $(ui.helper[0]).data('slide-id'),
					element_name = $(ui.helper[0]).data('element-name');
					console.log(element_name);

				addTmplate[slide_id]['element'][element_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
			}
		})
		.resizable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.element[0])),
					slide_id = $(ui.element[0]).data('slide-id'),
					element_name = $(ui.element[0]).data('element-name');

				addTmplate[slide_id]['element'][element_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
			}
		});

		$('.app-middle .element___file[data-element-name="'+clone_element_name+'"] .element-paint').ColorPicker({
	        color: '#'+addTmplate[slide_id]['element'][clone_element_name]['color'],
	        onShow: function (colpkr) {
	            $(colpkr).fadeIn(500);
	            return false;
	        },
	        onHide: function (colpkr) {
	            $(colpkr).fadeOut(500);
	            return false;
	        },
	        onChange: function (hsb, hex, rgb) {
	            $('.app-middle .element___file[data-element-name="'+clone_element_name+'"] .element-paint').parent('div').css('background-color','#'+hex);
				addTmplate[slide_id]['element'][clone_element_name]['color'] = hex;
	        }
		});
};

TemplateActions.prototype.cloneIcon = function(slide_id,element_name){
	var	element = $('.current-slide[data-id="'+slide_id+'"] .icon___file[data-element-name="'+element_name+'"]'),
		clone_element_name = templateActions.getElementName(slide_id,'graphics'),
		cloned_element = element.clone().attr('data-element-name',clone_element_name).css({"top": "0%", "left": "0%"});

		cloned_element.find('.element-name').data('element-name',clone_element_name).attr('data-element-name',clone_element_name).html(clone_element_name);

		$('.app-middle .current-slide[data-id="'+slide_id+'"]').append(cloned_element);

		$('.app-middle .icon___file[data-element-name="'+clone_element_name+'"] .element-remove').attr('data-element-name',clone_element_name);

		$('.app-middle .icon___file[data-element-name="'+clone_element_name+'"] .ui-resizable-handle').remove();

		addTmplate[slide_id]['graphics'][clone_element_name] = Object.assign({},addTmplate[slide_id]['graphics'][element_name]);

		$('.app-middle .current-slide .icon___file[data-element-name="'+clone_element_name+'"]')
		.draggable({
			containment: "parent",
			stop: function(event, ui){
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					slide_id = $(ui.helper[0]).data('slide-id'),
					element_name = $(ui.helper[0]).data('element-name');

				addTmplate[slide_id]['graphics'][element_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
			}
		})
		.resizable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.element[0])),
					slide_id = $(ui.element[0]).data('slide-id'),
					element_name = $(ui.element[0]).data('element-name');

				addTmplate[slide_id]['graphics'][element_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
			}
		});
};

TemplateActions.prototype.cloneGraph = function(slide_id,graph_name){
	var	element = $('.current-slide[data-id="'+slide_id+'"] .image___graph[data-graph-name="'+graph_name+'"]'),
		clone_element_name = templateActions.getElementName(slide_id,'graphs'),
		cloned_element = element.clone().attr('data-graph-name',clone_element_name).css({"top": "0%", "left": "0%"});

		cloned_element.find('.element-name').data('element-name',clone_element_name).attr('data-element-name',clone_element_name).html(clone_element_name);

		$('.app-middle .current-slide[data-id="'+slide_id+'"]').append(cloned_element);

		$('.app-middle .image___graph[data-graph-name="'+clone_element_name+'"] .element-remove').attr('data-element-name',clone_element_name);

		$('.app-middle .image___graph[data-graph-name="'+clone_element_name+'"] .ui-resizable-handle').remove();

		addTmplate[slide_id]['graphs'][clone_element_name] = Object.assign({},addTmplate[slide_id]['graphs'][graph_name]);

		$('.app-middle .current-slide .image___graph[data-graph-name="'+clone_element_name+'"]')
		.draggable({
			containment: "parent",
			stop: function(event, ui){
				var percent = templateActions.PxToPercent($(ui.helper[0])),
					slide_id = $(ui.helper[0]).data('slide-id'),
					graph_name = $(ui.helper[0]).data('graph-name');

				addTmplate[slide_id]['graphs'][graph_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
			}
		})
		.resizable({
			containment: "parent",
			stop: function( event, ui ) {
				var percent = templateActions.PxToPercent($(ui.element[0])),
					slide_id = $(ui.element[0]).data('slide-id'),
					graph_name = $(ui.element[0]).data('graph-name');

				addTmplate[slide_id]['graphs'][graph_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
			}
		});
};

TemplateActions.prototype.showIconGroup = function(icon_group,folder_name){
	$.each(icon_group,function(i,v){
		$.each(jQuery.parseJSON(v.group_json),function(j,val){
			if(editTmplate == true){
				if($('#mCSB_3_container').length){
					$('#mCSB_3_container').append('<figure class="" style="position: relative;height: 100px;"><div style="width:100px;height:100px;"><img src="/templates'+val+'" alt="tn" class="mCS_img_loaded icon-img"></div></figure>');
				}else{
					$('#main-elements .custom-scrollbar').append('<figure class="" style="position: relative;height: 100px;"><div style="width:100px;height:100px;"><img src="/templates'+val+'" alt="tn" class="mCS_img_loaded icon-img"></div></figure>');
				}
			}else{
				$('#mCSB_2_container').append('<figure class="" style="position: relative;height: 100px;"><div style="width:100px;height:100px;"><img src="/templates'+val+'" alt="tn" class="mCS_img_loaded icon-img"></div></figure>');
			}
		});
	})

	$('.icon-img').on('load',function(){
	}).error(function(e){
		$(this).parent('figure').remove();
	})
};