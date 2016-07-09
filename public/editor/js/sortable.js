$('.swiper-wrapper').sortable({
    items: "div.image-container",
    helper: "clone",
    appendTo: '.app',
    handle:'.slide-img',
    connectWith:'.swiper-wrapper',
    update:update,
    start:start,
    sort:sort,
    scrollSpeed:0
    // containment:'body'
});

function update(event, ui ){
	// var validation = true;

	// $.each($('.image-container'),function(i,v){
	// 	if(!slider.validation($(v).data('id'))){
	// 		validation = false;
	// 	}

	// 	if($(v).data('id') == $(ui.item).data('id')) {
	// 		return false;
	// 	}
	// })

	// if(slider.validation($(ui.item).data('id'))){
	// if(validation){
		var InsertedTemplateNewPosition = {},
			bool = true;

		$.each($('.image-container'),function(i,v){

			if (InsertedTempladeData[$(v).data('id')] != undefined) {
				InsertedTemplateNewPosition[i+1] = InsertedTempladeData[$(v).data('id')];
			}
			if(slider.currentSlideId == $(v).data('id') && bool) {
				slider.currentSlideId = i+1;
				bool = false;
			}
			$('.current-slide[data-id='+$(v).data('id')+']').data('cahnge-id',i+1).attr('data-cahnge-id',i+1);

			$(v).data('id',i+1).attr('data-id',i+1);
		})

		$.each($('.current-slide'),function(i,v){
			$(v).data('id',$(v).data('cahnge-id')).attr('data-id',$(v).data('cahnge-id'));
		})

		InsertedTempladeData = InsertedTemplateNewPosition;
		slider.saveSlideAllValue();

	// }
}

function start(event, ui){
	ui.item.click();
	ui.helper.css('color','#FFFF');
	ui.helper.find('.circle').addClass('sort_element')
}

function sort(event, ui){
	if(ui.position.left <= 100){
		$('.swiper-button-prev').click();
	}
	if(ui.position.left >= 1300){
		$('.swiper-button-next').click();
	}
	console.log(ui.position.left);
}