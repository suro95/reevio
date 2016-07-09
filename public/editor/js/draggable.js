$( window ).resize(function() {
	myVar=$(window).width();
});

//var json_droppable= '{"inputs":{"slogan":{"max":50,"required":true,"style":"position:absolute;top: 55%;left: 32%;width: 40%;height: 13%;","name":"slide-1-awesome","type":"textarea"},"additional-text":{"max":30,"required":true,"style":"position:absolute;top: 67%;left: 40%;width: 22%;height: 11%;","desc":"specializes in car... ","type":"text"}},"images":{"logo":{"style":"","required":true,"position":"top:30%;left:20%;","size":"width:20%;height:20%","desc":"logo left"}},"video":{"video":{"style":"","required":true,"position":"top:40%;left:40%;","size":"width:20%;height:20%","desc":"video left"}},"music":false,"slide":"arrow-reveal-4k-main-composition/cov.jpg"}';

$( document ).ready(function() {

	draggable($( ".draggable_slide .image-tn" ));

	$( ".droppable" ).droppable({
		activeClass: "pulse",
		accept: ".image-tn",
		// hoverClass: "ui-state-hover",
		drop: function( event, ui ) {
			drophere.init(ui.helper.data('id'),ui.helper.data('slideid'));
			$(event.target).before(drophere.BottomSlider());
			$('.app-middle').append(drophere.HomeSlider());
			// $('#mCSB_2_container figure[data-id="'+ui.helper.data('id')+'"]').remove();

			drophere.addBottomSlider(ui.helper.data('id'));
			peercents();

			element_color($('.current-slide[data-id="'+drophere.droppable_element_id+'"]  .element-color'));
			droppable($('.current-slide[data-id="'+drophere.droppable_element_id+'"] .icon___file' ));

			if($('.current-slide[data-id="'+drophere.droppable_element_id+'"] .background-slide').length){
				$('.current-slide[data-id="'+drophere.droppable_element_id+'"] .background-slide').ColorPicker({
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
			}

			$('.app-middle div[data-id="'+drophere.droppable_element_id+'"] .text-editor').editable({
		        name: 'slide[]',
		        success:editor.success
		    });
			$('.text-editor').unbind('shown');
			$('.text-editor').unbind('hidden');
		    $('.text-editor').on('hidden',function(e, reason){
		        editor.hide();
		    });
		    $('.text-editor').on('shown',function(e, editable){
		        editor.show(e,editable);
		    });
		    swiper.update();

		    $('.app-middle .current-slide').last().find(".text-editor").each(function(i,e){
					$(e).parents('.current-slide').css({ position: "absolute", visibility: "hidden", display: "block" });
					var font_num=parseInt($(e).parent().height());
					var fontSize = font_num+"px";

					$(e).parents('.current-slide').css({ position: "", visibility: "", display: "none" });
					$(this).css('font-size', fontSize);
					$('.app-middle .active-slide').css({ display: "block" });
			})

			if($('.image-container').length >=2){
				$( ".swiper-wrapper" ).sortable( "enable" );
			}
			Utils.Layout.init();
		}
	})
	window.drophere = new DropHere();

	// $('.duration').html('<span class="font-red">Duration:</span> '+video_duration+' seconds');
});

function draggable(element){
	element.draggable({
		appendTo: "body",
		containment: "window",
		revert: 'invalid',
		scroll: false,
		cursor: 'move',
		helper: "clone",
		stack: ".draggable li",
		start: function(e, ui) {
			swiper.slideTo(swiper.slides.length - 1);
			$(ui.helper).css({"color":"white","z-index":999});
			if(drophere.validation($(this).data('id'))){
				return true;
			}else{
				alert('The slide duration is not supported for this template.');
				return false;
			}
		}
		//,drag: function() {},
        // stop: function() {}
	});
}

function DropHere(){

}


DropHere.prototype.init = function(RigthSlidId,slideid){
	InsertedTempladeData[Object.keys(InsertedTempladeData).length+1] = {};
	InsertedTempladeData[Object.keys(InsertedTempladeData).length][slideid] = {};

	this.lengthTemplateData = Object.keys(InsertedTempladeData).length;
	this.last_element_id = this.lengthTemplateData == 0 ? 0 : Object.keys(InsertedTempladeData)[this.lengthTemplateData-1];

	this.slideID=slideid;
	this.droppable_element = TemplateDataRigth[RigthSlidId];
	this.droppable_element_id = parseInt(this.last_element_id);
	this.droppable_element_src = this.droppable_element['slide'];
	this.droppable_element_src_cov = this.droppable_element['cov'];
	this.droppable_element_background_color = this.droppable_element['slide-background-color'];

	if(typeof this.droppable_element['inputs'] != 'undefined'){
		this.droppable_element_inputs = this.droppable_element['inputs'];
		this.droppable_element_inputs_length = Object.keys(this.droppable_element_inputs).length;
	}else{
		this.droppable_element_inputs_length = false;
	}

	if(typeof this.droppable_element['images'] != 'undefined'){
		this.droppable_element_images = this.droppable_element['images'];
		this.droppable_element_images_length = Object.keys(this.droppable_element_images).length;
	}else{
		this.droppable_element_images_length = false;
	}

	if(typeof this.droppable_element['video'] != 'undefined'){
		this.droppable_element_video = this.droppable_element['video'];
		this.droppable_element_video_length = Object.keys(this.droppable_element_video).length;
	}else{
		this.droppable_element_video_length = false;
	}

	if(typeof this.droppable_element['graphics'] != 'undefined'){
		this.droppable_element_graphic = this.droppable_element['graphics'];
		this.droppable_element_graphic_length = Object.keys(this.droppable_element_graphic).length;
	}else{
		this.droppable_element_graphic_length = false;
	}

	if(typeof this.droppable_element['element'] != 'undefined'){
		this.droppable_element_element = this.droppable_element['element'];
		this.droppable_element_element_length = Object.keys(this.droppable_element_element).length;
	}else{
		this.droppable_element_element_length = false;
	}

}

DropHere.prototype.validation = function(slideid){
	if(typeof TemplateDataRigth[slideid]['slide_duration'] != 'undefined'){
		var all_duration = parseInt(TemplateDataRigth[slideid]['slide_duration']);

		$.each(InsertedTempladeData,function(i,v){
			var slide_id = Object.keys(v)[0];

			all_duration += parseInt(TemplateDataRigth[slide_id]['slide_duration']);
		})

		if(all_duration <= max_duration){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

DropHere.prototype.BottomSlider = function(){
	str_slide = '<div data-slideid="'+this.slideID+'" data-id="'+this.droppable_element_id+'" class="swiper-slide slide-item image-container" style="margin-right: 16px;"><figure class="slide-img"><div class="hold-asp-ratio"><div class="asp-content"><img src="/templates/'+this.droppable_element_src_cov+'"><div class="tools"><a href="#" class="clone_slide"><span><i aria-hidden="true" class="fa fa-clone fa-lg"></i></span></a><a href="#" class="delete_slide"><span><i aria-hidden="true" class="fa fa-trash-o fa-lg"></i></span></a></div></div></figure><div class="steps">';
	if(this.droppable_element_inputs_length)
		str_slide+= '<span><i class="fa fa-text-width circle"></i>&nbsp;<span class="validate-inputs">0/'+this.droppable_element_inputs_length+'</span></span>';
	if(this.droppable_element_images_length)
		str_slide+= '<span><i class="fa fa-file-image-o circle"></i>&nbsp;<span class="validate-imgs">0/'+this.droppable_element_images_length+'</span></span>';
	if(this.droppable_element_video_length)
		str_slide+= '<span><i class="fa fa-file-video-o circle"></i>&nbsp;<span class="validate-video">0/'+this.droppable_element_video_length+'</span></span>';
	str_slide+='</div></div>';
	return str_slide;
}

DropHere.prototype.HomeSlider = function(){
	var _this = this;
	if($('.app-middle>div').length == 0)
		var str_mddle = '<div data-id="'+_this.droppable_element_id+'" class="current-slide active-slide" style="">';
	else
		var str_mddle = '<div data-id="'+_this.droppable_element_id+'" class="current-slide" style="display: none;">';
	if(_this.droppable_element_background_color)
		str_mddle+= '<div class="background-slide"><i class="fa fa-tint"></i></div>';
	str_mddle+='<img src="/templates/'+_this.droppable_element_src+'" style="width:100%;height:100%">';
	str_mddle+='<div class="item-form">';
	if(_this.droppable_element_inputs){
		$.each( _this.droppable_element_inputs, function( key, value ) {
			if(value.type == 'text'){

				str_mddle+= '<div style="'+value.style+'" data-toggle="tooltip" data-placement="top" title="Add text to this field" class="field text dark-t">';
				str_mddle+= '<a href="#" data-type="'+value.type+'" data-pk="'+_this.droppable_element_id+'" style="'+value.text_style+'height: 100%; width: 100%; position: absolute; display: flex; align-items: center;white-space: nowrap;" data-inputposition="'+key+'" data-inputname="'+key+'" data-maxlength="'+value.max+'" data-name="'+value.name+'" class="text-editor">'+value.value+'</a>';
				str_mddle+= '</div>';

			}else{
				str_mddle+= '<div style="'+value.style+'" data-toggle="tooltip" data-placement="top" title="Add text to this field" class="field text dark-t">';
				str_mddle+= '<a href="#" data-type="'+value.type+'" data-pk="'+_this.droppable_element_id+'" style="'+value.text_style+';position: absolute; display: flex; align-items: center;white-space: normal;" data-inputposition="'+key+'" data-inputname="'+key+'" data-maxlength="'+value.max+'" data-name="'+value.name+'" class="text-editor">'+value.value+'</a>';
				str_mddle+= '</div>';
			}
		});
	}
	if(_this.droppable_element_images){
		$.each( _this.droppable_element_images, function( key, value ) {
			str_mddle+= '<div style="position:absolute;'+value.position+''+value.size+'" data-width="'+value.width+'" data-height="'+value.height+'" data-imgpk="'+key+'" data-pk="'+_this.droppable_element_id+'",data-skip="'+value.skip+'",data-logo="'+value.logo+'" data-toggle="tooltip" data-placement="top" title="Add image to this field" class="field image___file empty">';
			str_mddle+= '<div class="btn add-new-images-input"></div></div>';
		});
	}
	if(_this.droppable_element_video){
		$.each( _this.droppable_element_video, function( key, value ) {
			str_mddle+= '<div style="position:absolute;'+value.position+''+value.size+'" data-vidpk="'+key+'" data-pk="'+_this.droppable_element_id+'" data-time="'+value.time+'" data-toggle="tooltip" data-placement="top" title="Add video to this field" class="field video___file empty">';
			str_mddle+= '<div class="btn add-new-videos-input"></div></div>';
		});
	}
	if(_this.droppable_element_graphic && graphic == true){
		$.each( _this.droppable_element_graphic, function( key, value ) {
			str_mddle+= '<div style="position:absolute;'+value.position+''+value.size+'" data-graphicpk="'+key+'" data-pk="'+_this.droppable_element_id+'" data-toggle="tooltip" data-placement="top" title="Add graphic to this field" class="field icon___file empty">';
			str_mddle+= '<div class="btn icon-color"><i aria-hidden="true" class="fa fa-puzzle-piece"></i></div></div>';
		});
	}
	if(_this.droppable_element_element){
		$.each( _this.droppable_element_element, function( key, value ) {
			str_mddle+= '<div style="position:absolute;'+value.position+''+value.size+'" data-colorpk="'+key+'" data-pk="'+_this.droppable_element_id+'" data-toggle="tooltip" data-placement="top" title="Add element to this field" class="field elements___file empty">';
			str_mddle+= '<div class="btn element-color"><i aria-hidden="true" class="fa fa-paint-brush"></i></div>';
		});
	}
	str_mddle+='</div></div>';
		$('.app-middle').find('div[data-id="'+this.droppable_element_id+'"] .text-editor').addClass('editable-empty');

	return str_mddle;

}

DropHere.prototype.addBottomSlider = function(RigthSlidId){

	// TemplateData[this.droppable_element_id] = this.droppable_element;
	// delete TemplateDataRigth[RigthSlidId];

}

function peercents(){
    var TemplateData_length = 0,
        InsertedTempladeData_length = 0;

	$.each( InsertedTempladeData, function( key, value ) {
		if(typeof value == 'object'){
			$.each(value[Object.keys(value)[0]],function(index,val){
				if(index == 'inputs' || index == 'video' || index == 'images')
					InsertedTempladeData_length += Object.keys(val).length;
			})

			$.each(TemplateData[Object.keys(value)[0]],function(index,val){
				if(typeof val === 'object' && val !== null){
					if(index == 'inputs' || index == 'video' || index == 'images')
						TemplateData_length += Object.keys(val).length;
				}
			})
		}
	})

    var percent = Math.floor(InsertedTempladeData_length*100/TemplateData_length);
    if(InsertedTempladeData_length == 0 && TemplateData_length ==0)
        percent = 0;
    var aria_valuenow = $('.progress-bar').attr('aria-valuenow');
        if(percent > aria_valuenow)
            var sum = 'plus';
        if(percent < aria_valuenow)
            var sum = 'minus';
    var set_Interval = setInterval(function(){
        $('.progress-container strong').text(aria_valuenow+'%');
        $('.progress-bar').css('width',aria_valuenow+'%')
        if(percent == aria_valuenow){
            clearInterval(set_Interval);
            $('.progress-bar').attr('aria-valuenow',percent);
        }
        if(sum == 'plus')
            aria_valuenow++;
        if(sum == 'minus')
            aria_valuenow--;
    },50);
    $('.progress-container strong').text();
    init_user_video(percent);
}

function delete_slide(id){

    if(InsertedTempladeData[id])
        delete InsertedTempladeData[id];

	var InsertedTemplateNewPosition = {};

	$.each($('.image-container'),function(i,v){
		if (InsertedTempladeData[$(v).data('id')] != undefined) {
			InsertedTemplateNewPosition[i+1] = InsertedTempladeData[$(v).data('id')];
		}

		$(v).data('id',i+1).attr('data-id',i+1);
	})

	$.each($('.current-slide'),function(i,v){
        var data_id = $(v).data('id');

        if(data_id > parseInt(id)){
            $(v).data('id',data_id - 1).attr('data-id',data_id-1);
        }
    });
	InsertedTempladeData = InsertedTemplateNewPosition;

	slider.saveSlideAllValue();
    peercents();
    swiper.update();
    $('.swiper-button-prev').click();
}

function selected_slide(){
	var my_InsertedTempladeData = {};
	$.each(InsertedTempladeData,function(slide_position,value){
		if(typeof value == 'object'){
			$.each(value,function(slide_id,val){
				my_InsertedTempladeData[slide_position] = val;
			})
		}
	});

	$.each(InsertedTempladeData,function(slide_id,value){
		if(typeof value == 'object'){
			var success = true;

			$.each(TemplateData[Object.keys(value)[0]],function(key,val){
				if(typeof TemplateData[Object.keys(value)[0]][key] === 'object' && TemplateData[Object.keys(value)[0]][key] !== null){
					if(key == 'inputs' || key == 'video' || key == 'images'){
						if(typeof value[Object.keys(value)[0]][key] != 'undefined') {
							if(Object.keys(TemplateData[Object.keys(value)[0]][key]).length != Object.keys(value[Object.keys(value)[0]][key]).length){
								success = false;
							}
						}else{
							success = false;
						}
					}
				}
			})

			$('.swiper-wrapper .swiper-slide[data-id="'+slide_id+'"]').removeClass('selected');
			if(success){
				$('.swiper-wrapper .swiper-slide[data-id="'+slide_id+'"]').addClass('selected');
			}
		}
	});
}
