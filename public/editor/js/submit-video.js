$( document ).ready(function() {

	$("#submit-video").click(function(e){

		var success = true;
		$.each(InsertedTempladeData,function(slide_id,value){
			$.each(TemplateData[Object.keys(value)[0]],function(key,val){
				if(typeof TemplateData[Object.keys(value)[0]][key] === 'object' && TemplateData[Object.keys(value)[0]][key] !== null){
					if(typeof value[Object.keys(value)[0]][key] != 'undefined') {
						if(Object.keys(TemplateData[Object.keys(value)[0]][key]).length != Object.keys(value[Object.keys(value)[0]][key]).length){
							success = false;
						}
					}else{
						success = false;
					}
				}
			})

		});

		if(success){
			$('body').append('<div id="loader-wrapper" style="opacity: 0.8" class="loader-wrapper"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');

			$.post( "/editor/update-template-data", {
		        slider_data:JSON.stringify(InsertedTempladeData),
		        video_name:video_name,
		        template_id:TEMPALTE_ID,
		        percent:100,
		        id:UserVideosId
			    }).done(function( data ) {
					$('.loader-wrapper').remove();
					$('.submit-video-error').html('Your video has not passed the validation.<br>Please fill the required data.');

			        if('success' in data){
			            if(data.success==true){
			            	$('#submit-video-modal').modal('show');
			            }else{
			            	$('#submit-video-error-modal').modal('show');
			            }
			        }else{
			            $('.submit-video-error').html(data.fail);
			        	$('#submit-video-error-modal').modal('show');
			        }
			    }).fail(function() {
			    	$('.loader-wrapper').remove();
					$('.submit-video-error').html('Your video has not passed the validation.<br>Please fill the required data.');
			    	$('#submit-video-error-modal').modal('show');
			    });
		}else{
			$('#submit-video-error-modal').modal('show');
		}
	});
});

function init_user_video(percent){
	if(UserVideosId){
		update_user_video(percent)
	}else{
		insert_user_video(percent);
	}
}

function insert_user_video(percent){
	$.post( "/editor/insert-user-video", {
		slider_data:JSON.stringify(InsertedTempladeData),
		video_name:video_name,
		template_id:TEMPALTE_ID,
		percent:percent
	}).done(function( data ) {
		if('success' in data){
			if(data.success==true){
				UserVideosId = data.UserVideosId;
			}
		}
	})
}

function update_user_video(percent){
	$.post( "/editor/update-user-video", {
		slider_data:JSON.stringify(InsertedTempladeData),
		video_name:video_name,
		template_id:TEMPALTE_ID,
		percent:percent,
		id:UserVideosId
	}).done(function( data ) {

	})
}