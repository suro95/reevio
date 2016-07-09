$(document).ready(function(){
	window.slide = new Slide();

	$(document).on('click','#add-rig-template',function(e){
		var formData =  new FormData($('.form')[0]);

		$.ajax({
			method:"POST",
			url: '/rig/add-template',
			data: formData,
			contentType: false,
			processData: false,
			success: function(data){
				data = JSON.parse(data);
				if(data.success){
					window.location.href = '/rig';
				}else{
					alert('Server error, please try later.');
				}
			}
		})
	})

	$(document).on('click','.update-rig-template',function(e){
		var formData =  new FormData($('.form')[0]);

		$.ajax({
			method:"POST",
			url: '/rig/update-template',
			data: formData,
			contentType: false,
			processData: false,
			success: function(data){
				data = JSON.parse(data);
				if(data.success){
					window.location.href = '/rig';
				}else{
					alert('Server error, please try later.');
				}
			}
		})
	})

	$(document).on('change','select[name="type"]',function(e){
		slide.shangeSlideType($(e.target).val());
	})

	$(document).on('click','#add-one-slide',function(e){
		slide.addSlide();
	})

	$(document).on('change','.add-new-name',function(e){
		var type = $(this).data('type');
		if(type && $(this).val() == 'new'){
			$('#modal_add_name .modal-title').html("Add new "+type);
			$('#modal_add_name').data('type',type);
			$('#modal_add_name').modal('show');
		}
	})

	$(document).on('click', '#add_new_name',function(){
		var new_naem = $('.new-name').val(),
			type = $('#modal_add_name').data('type'),
			data = {
				"new_naem":new_naem,
				"type":type
			};
		if(new_naem){
			$.ajax({
				method:"POST",
				url: '/rig/add-new-name',
				data: data,
				success: function(data){
					data = JSON.parse(data);
					if(data.success){
						$('[data-type="'+type+'"] option:nth-child(1)').after('<option value="'+data.id+'">'+new_naem+'</option>');
						$('#modal_add_name').modal('hide');
					}else{
						alert('Server error, please try later.');
					}
				}
			})
		}
	})

	$('#modal_add_name').on('hidden.bs.modal', function () {
		var type = $('#modal_add_name').data('type');

		if($('[data-type="'+type+'"] option').length > 2){
			$('[data-type="'+type+'"] option:nth-child(2)').attr('selected',true);
		}else{
			$('[data-type="'+type+'"] option:nth-child(1)').attr('selected',true);
		}
	})
})

function Slide(){
	this.slideType = 'static';
	this.slideCount = 2;
	this.dynamicElements = '';
}

Slide.prototype.addSlide = function(){
	if(this.slideType == 'dynamic'){
		this.slideCount++;

		var slide_html = $($('.slide-options').get(0)).clone().data('slide-id',this.slideCount).attr('data-slide-id',this.slideCount);
		slide_html.find('input').val('');
		slide_html.find('h4').html('Slide '+this.slideCount);
		slide_html.find('input[type="file"]').attr('name','slide_aep_'+this.slideCount);
		$('.all-slides button').before(slide_html);
	}
};

Slide.prototype.shangeSlideType = function(type){
	if(type == 'static'){
		this.slideType = 'static';
		this.dynamicElements = $('.slide-options:not([data-slide-id=1],[data-slide-id=2])').detach();
		$('#add-one-slide').hide();
	}else if(type == 'dynamic'){
		this.slideType = 'dynamic';
		$('.all-slides button').before(this.dynamicElements);
		$('#add-one-slide').show();
	}
};