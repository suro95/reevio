$("document").ready(function(){

	var API_KEY = '1026292-59296bc45312c991bda7e77ad';

	$(document).on('click','#search_pixabay',function(e){

		var input = $('#search_text_pixabay').val(),
			PixabayURL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(input),
			SplashbaseURL = "http://www.splashbase.co/api/v1/images/search?query="+encodeURIComponent(input),
			pixabay = $('.search-images');
			pixabay.html('');
			if(input){
				$.getJSON(PixabayURL, function(data){
				    if (parseInt(data.totalHits) > 0){
				    	$.each(data.hits, function(i, hit){ 
							pixabay.append('<div class="thumb-img" data-url="'+hit.webformatURL+'"><img src="'+hit.webformatURL+'"></div>')
				        });
				    }else{
				        console.log('No hits');
				    }
				});

				$.getJSON(SplashbaseURL, function(data){
				    if (data.images.length > 0){
				    	$.each(data.images, function(i, hit){ 
							pixabay.append('<div class="thumb-img" data-url="'+hit.url+'"><img src="'+hit.url+'"></div>')
				        });

				    }else{
				        console.log('No images');
				    }
				})
			}
			
	})
});