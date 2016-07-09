$(document).ready(function(){
	$('.swiper-wrapper [data-id="1"]').click();

	 templateActions.editable();
	templateActions.SlideMaxDuration = SlideMaxDuration;

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

	$('.app-middle .image___file')
	.draggable({
		containment: "parent",
		stop: function(event, ui){
			var percent = templateActions.PxToPercent($(ui.helper[0])),
				slide_id = $(ui.helper[0]).data('slide-id'),
				image_name = $(ui.helper[0]).data('image-name');

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

	$('.app-middle .image___graph')
	.draggable({
		containment: "parent",
		stop: function(event, ui){
			var percent = templateActions.PxToPercent($(ui.helper[0])),
				slide_id = $(ui.helper[0]).data('slide-id'),
				image_name = $(ui.helper[0]).data('graph-name');

			addTmplate[slide_id]['graphs'][image_name]['position'] = "top:"+percent.top+"%;left:"+percent.left+"%;";
		}
	})
	.resizable({
		containment: "parent",
		stop: function( event, ui ) {
			var percent = templateActions.PxToPercent($(ui.element[0])),
				slide_id = $(ui.element[0]).data('slide-id'),
				image_name = $(ui.element[0]).data('graph-name');

			addTmplate[slide_id]['graphs'][image_name]['size'] = "width:"+percent.width+"%;height:"+percent.height+"%;";
		}
	});

	$('.app-middle .video___file')
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
				video_name = $(ui.element[0]).data('video-name');

			addTmplate[slide_id]['video'][video_name]["position"]=position;
			addTmplate[slide_id]['video'][video_name]["size"]=size;
		}
	});

	$('.app-middle .text')
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

			// $('div[data-input-name="'+input_name+'"] .text-editor').each(function(i,e){
			// 	var font_num=parseInt($(ui.element[0]).height());
			// 	// var fontSize = (font_num-(font_num/10))+"px";
			// 	var fontSize = font_num+"px";

			// 	$(this).css('height', fontSize);
			// 	$(this).css('font-size', fontSize);
			// 	// $(this).css('line-height', fontSize);
			// })
		}
	});

	$('.app-middle .element___file')
	.draggable({
		containment: "parent",
		stop: function( event, ui ) {
			var percent = templateActions.PxToPercent($(ui.helper[0])),
				position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
				size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
				slide_id = $(ui.helper[0]).data('slide-id'),
				element_name = $(ui.helper[0]).data('element-name');

			addTmplate[slide_id]['element'][element_name]["position"]=position;
			addTmplate[slide_id]['element'][element_name]["size"]=size;
		}
	})
	.resizable({
		containment: "parent",
		stop: function( event, ui ) {
			var percent = templateActions.PxToPercent($(ui.element[0]));
				position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
				size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
				slide_id = $(ui.element[0]).data('slide-id'),
				element_name = $(ui.element[0]).data('element-name');

			addTmplate[slide_id]['element'][element_name]["position"]=position;
			addTmplate[slide_id]['element'][element_name]["size"]=size;
		}
	});

	$('.app-middle .icon___file')
	.draggable({
		containment: "parent",
		stop: function( event, ui ) {
			var percent = templateActions.PxToPercent($(ui.helper[0])),
				position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
				size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
				slide_id = $(ui.helper[0]).data('slide-id'),
				element_name = $(ui.helper[0]).data('element-name');

			addTmplate[slide_id]['graphics'][element_name]["position"]=position;
			addTmplate[slide_id]['graphics'][element_name]["size"]=size;
		}
	})
	.resizable({
		containment: "parent",
		stop: function( event, ui ) {
			var percent = templateActions.PxToPercent($(ui.element[0]));
				position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
				size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
				slide_id = $(ui.element[0]).data('slide-id'),
				element_name = $(ui.element[0]).data('element-name');

			addTmplate[slide_id]['graphics'][element_name]["position"]=position;
			addTmplate[slide_id]['graphics'][element_name]["size"]=size;
		}
	});

	$.each($('.element-paint'),function(key,value){
		var slide_id = $(this).parents('.current-slide').attr('data-id'),
			element_name = $(value).parents('.element___file').attr('data-element-name');

		$(value).ColorPicker({
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
	            $(value).parent('div').css('background-color','#'+hex);
				addTmplate[slide_id]['element'][element_name]['color'] = hex;
	        }
		});
	});

	$('.app-middle .multi___element')
	.draggable({
		containment: "parent",
		stop: function( event, ui ) {
			var percent = templateActions.PxToPercent($(ui.helper[0])),
				position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
				size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
				slide_id = $(ui.helper[0]).data('slide-id'),
				mixed_media = $(ui.helper[0]).data('multi-element-name');

			addTmplate[slide_id]['mixed-media'][mixed_media]["position"]=position;
			addTmplate[slide_id]['mixed-media'][mixed_media]["size"]=size;
		}
	})
	.resizable({
		containment: "parent",
		stop: function( event, ui ) {
			var percent = templateActions.PxToPercent($(ui.element[0]));
				position = 'top:'+percent.top+'%;left:'+percent.left+'%;',
				size = 'width:'+percent.width+'%;height:'+percent.height+'%;',
				slide_id = $(ui.element[0]).data('slide-id'),
				mixed_media = $(ui.element[0]).data('multi-element-name');

			addTmplate[slide_id]['mixed-media'][mixed_media]["position"]=position;
			addTmplate[slide_id]['mixed-media'][mixed_media]["size"]=size;
		}
	});
})