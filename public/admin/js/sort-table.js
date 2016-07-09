$('.swiper-wrapper').sortable({
    items: "div.image-container",
    helper: "clone",
    appendTo: '.app',
    handle:'.slide-img',
    connectWith:'.swiper-wrapper',
    update:update,
    start:start,
    scrollSpeed:0
    // containment:'body'
});

function update(event, ui ){
	var new_addTmplate = {};

	$.each($('.image-container'),function(key,value){
		$('.current-slide.item-form[data-id="'+$(value).attr('data-id')+'"]').attr('data-cheng-id',key+1);
		new_addTmplate[key+1] = Object.assign({},addTmplate[$(value).attr('data-id')]);
		$(value).attr('data-id',key+1);
	});

	$.each($('.current-slide.item-form'),function(key,value){
		$(value).attr('data-id',$(value).attr('data-cheng-id'));
		$(value).find('.field').attr('data-slide-id',$(value).attr('data-cheng-id'));
		$(value).find('.field.text a').attr('data-slide-id',$(value).attr('data-cheng-id'));
		$(value).find('.element-remove').attr('data-slide-id',$(value).attr('data-cheng-id'));
	});

	$('.image-container[data-id="'+$(ui.item).attr('data-id')+'"]').click();
	addTmplate = new_addTmplate;
}
function start(event, ui){
	ui.item.click();
	ui.helper.css('color','#FFFF');
	ui.helper.find('.circle').addClass('sort_element')
}