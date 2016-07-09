$("document").ready(function(){

	draggable_icon($( "#main-elements .icon-element" ));

	droppable($( ".icon___file" ));

	$(document).on('change','.icon-group-list',function(){
		var id = $(this).val();

		if(id == 0){
			$('#dropzone_icon').css('visibility','');
		}else{
			$('#dropzone_icon').css('visibility','hidden');
		}

		$('#main-elements .custom-scrollbar').append('<div class="loding" style="width: 65px;height: 55px; margin: auto; position: absolute;top: 0; left: 0;right: 0;bottom: 0;"><div data-loader="circle-side"></div></div>');
		$('#main-elements #mCSB_6_container').html('');
		$.post('/editor/get_icons',{id:$(this).val()}).done(function( data ) {
			if(data.success){
				if(id>0){
					var obj = JSON.parse(data.data.group_json);
					$.each(obj,function(j,val){
						console.log(val);
						$('#main-elements #mCSB_6_container').append('<figure class="" style="position: relative;height: 100px;display: none;"><div class="icon-element" style="width:100px;height:100px;" data-type="'+val.type+'"><'+val.type+' src="'+val.path+'" alt="tn" class="icon-img"></div></figure>');
					});

					var i = 0;
					$('.icon-img').on('load',function(){
						i++;
					}).error(function(e){
						i++;
						$(this).parent('figure').remove();
					})

					if(i == Object.keys(obj).length == i){
						$('#main-elements .custom-scrollbar .loding').remove();
						$('.icon-img').parents('figure').show();
						draggable_icon($( "#main-elements .icon-element" ));
					}
				}else{
					$.each(data.data,function(j,val){
						$('#main-elements #mCSB_6_container').append('<figure class="" style="position: relative;height: 100px;display: none;"><div class="icon-element"  style="width:100px;height:100px;" data-type="'+val.type+'"><'+val.type+' src="'+val.path+'" class="icon-img"></div></figure>');
					});

					var i = 0;
					$('.icon-img').on('load',function(){
						i++;
					}).error(function(e){
						i++;
						$(this).parent('figure').remove();
					})

					if(i == Object.keys(data.data).length == i){
						$('#main-elements .custom-scrollbar .loding').remove();
						$('.icon-img').parents('figure').show();
						draggable_icon($( "#main-elements .icon-element" ));
					}
				}

			}else{
				$('#main-elements .custom-scrollbar .loding').remove();
			}
		});
	});

	$("#dropzone_icon").dropzone({
        dictDefaultMessage: "DROP YOUR ICON HERE OR CLICK TO UPLOAD",
        previewTemplate:"",
        url:"/editor/upload-icon",
        acceptedFiles:".png,.jpg,.swf,.mov",
        addedfile: function (file) {},
		thumbnail: function (file, dataUrl) {},
		uploadprogress: function (file, progress, bytesSent) {
		},
		success:function(file,success){
			if($('.icon-group-list').val() == 0){
				if(success.success){
					if(success.type == 'video'){
						$('#main-elements #mCSB_6_container').append('<figure style="position: relative;height: 100px;"><div style="width:100px;height:100px;" data-type="video" data-src="'+success.url+'" class="icon-element "><div style="border: none;" class="icon-img"><img src="/img/mov.png" class="icon-img "></div><div class="tools"><a class="open-mov"><span class="fa fa-eye"></span><span>Open</span></a></div></div></figure>');
					}else{
						$('#main-elements #mCSB_6_container').append('<figure style="position: relative;height: 100px;"><div class="icon-element" style="width:100px;height:100px;" data-type="'+success.type+'" data-src="'+success.url+'"><'+success.type+' src="'+success.url+'" alt="tn" class="icon-img"></div></figure>');
					}
					draggable_icon($('#main-elements #mCSB_6_container figure:last-child .icon-element'));
				}else{
					alert('Serve error , Please try again later!')
				}
			}

		},
		sending:function(file,data,token){
		}
	});

	$(document).on('click','.open-mov',function(e){
		$('#user-video-modal').modal('show');
        var src = $(this).parents('[data-type="video"]').attr('data-src');
        $('#user-video-modal .modal-body').html('<div class="loding" style="width: 65px;height: 55px; margin: auto; position: absolute;top: 0; left: 0;right: 0;bottom: 0;"><div data-loader="circle-side"></div></div><video id="userVideos" autoplay="true" preload="auto" controls width="100%" height="515" style="display:none;"><source src="'+src+'"></video>');
        document.getElementById('userVideos').addEventListener('loadeddata',function(){
            $('#userVideos').css('display','block');
            $('#user-video-modal .loding').remove();
        })
        e.stopPropagation();
	});

});

function draggable_icon(element){
	element.draggable({
		appendTo: "body",
		revert: 'invalid',
		scroll: false,
		cursor: 'move',
		helper: "clone",
		start: function(e, ui) {
			// console.log()
			$(ui.helper).find('.tools').css('visibility','hidden');
			$(ui.helper).css({"color":"white","z-index":999});
			$('.icon___file i').addClass('red-color');
		},
		stop:function(e,ui){
			$('.icon___file i').removeClass('red-color');
		}
	});
};

function droppable(element){
	element.droppable({
		activeClass: "pulse",
		accept: ".icon-element",
		hoverClass: "ui-state-hover",
		drop: function( event, ui ) {
			var type = $(ui.draggable.context).attr('data-type');
			appEnd($(ui.draggable.context).attr('data-src'),$(event.target)[0],type)
		}
	});
};

function appEnd(src,element,type){
	if($(element).find('.icon-canvas').length)
		$(element).find('.icon-canvas').remove();
	if(type == 'video'){
		$(element).append('<img src="/img/mov.png" style="bottom: 0;right: 0;margin: auto;" class="icon-canvas">');
	}else{
		$(element).append('<'+type+' src="'+src+'" style="bottom: 0;right: 0;margin: auto;" class="icon-canvas">');
	}
	$(element).find('i').css('color','#69BDE6');
	var slide_position = slider.currentSlideId;
	var slide_id =$('.image-container[data-id="'+slide_position+'"]').attr('data-slideid');
	var icon_id = $(element).attr('data-graphicpk');
	if (!InsertedTempladeData[slide_position]) InsertedTempladeData[slide_position] = {};
    if (!InsertedTempladeData[slide_position][slide_id]) InsertedTempladeData[slide_position][slide_id] = {};
    if (!InsertedTempladeData[slide_position][slide_id]["graphics"])  InsertedTempladeData[slide_position][slide_id]["graphics"] = {};
    if (!InsertedTempladeData[slide_position][slide_id]["graphics"][icon_id]) InsertedTempladeData[slide_position][slide_id]["graphics"][icon_id] = {};
    InsertedTempladeData[slide_position][slide_id]["graphics"][icon_id]['value']=window.location.origin+src;
    InsertedTempladeData[slide_position][slide_id]["graphics"][icon_id]['type']=type;
};