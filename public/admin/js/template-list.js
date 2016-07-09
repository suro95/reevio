$(document).ready(function(){
	var packages = new Packages();

	$(document).on('click','.delete',function(){
		$('#modal_delete').attr('data-id',$(this).data('id'));
		$('#modal_delete').modal('show');
	})

	$(document).on('click','#yes_delete',function(){
		var id = $('#modal_delete').attr('data-id');
		$.post( "/admin/delete-template",{id:id}).done(function( data ) {
			if(data.success){
				$('.delete[data-id="'+id+'"]').parents('tr').remove();
				$('#modal_delete').modal('hide');
			}else{
				alert('Serve error , Please try again later!')
			}
		});
	})

	$(document).on('change','.templaet_status',function(e){
		var _this = this;
		console.log('test',$(this).val(),$(this).data('id'));
		$.post( "/admin/update-template-status",{id:$(this).data('id'),value:$(this).val()}).done(function( data ) {
			console.log(data);
		});
	})

	$(document).on('click','.clon_template',function(e){
		$.post( "/admin/clon-template",{id:$(this).data('id')}).done(function( data ) {
			if(data.success){
				window.location.href = '/admin/edit-template/'+data.id+'';
			}
		});
	})

	$(document).on('click','.child_template',function(e){
		$.post( "/admin/child-template",{id:$(this).data('id')}).done(function( data ) {
			if(data.success){
				window.location.href = '/admin/edit-template/'+data.id+'';
			}
		});
	})

	$(document).on('click','.package',function(){
		var arr = JSON.parse($(this).attr('data-arr')),
			template_id = $(this).attr('data-id'),
			prices = packages.getPackagesPrice(arr,template_id);

		$('#packages_form').get(0).reset();

		for(i in arr){
			var id = arr[i];

			$('[data-id="checkbox-'+id+'"]').prop('checked',true);

			if(typeof prices[id] != 'undefined' && typeof prices[id]['price'] != 'undefined'){
				$('[data-id="price-'+id+'"]').val(prices[id]['price']);
			}
		}

		$('#modal_package').attr('data-id',template_id);
		$('#modal_package').modal('show');
	})

	$(document).on('click','.packages-list',function(){
		$('#modal_add_package').modal('show');
	});

    $(document).on('click','#save_package',function(){
		var template_id = parseInt($('#modal_package').attr('data-id')),
			packages = $('[name="package_checked[]"]:checked').map(function () {return this.value;}).get(),
			form_data = new FormData($('#packages_form')[0]);

		if(packages == null){
			packages = [];
		}

		if(template_id){
			form_data.append('template_id',template_id);
			$.ajax({
				url: '/admin/package-update',
				data: form_data,
				processData: false,
				contentType: false,
				type: 'POST',
				success: function(data){
					if('success' in data){
						$('a.package[data-id="'+template_id+'"]').attr('data-arr',JSON.stringify(packages));
						$('a.package[data-id="'+template_id+'"]').prev('span').html(data.packages_str);
						window.packages = data.packages_rows;
						$('#modal_package').modal('hide');
					}
				}
			});
		}else{
			alert('error');
		}
    });

	$(document).on('click','#add_package',function(){
		$('#modal_upadet_package').attr('data-type','insert');
		$('#modal_upadet_package input[name="name"]').val('');
		$('#modal_upadet_package input[name="credits"]').val('');
		$('#modal_upadet_package').modal('show');
	});

	$(document).on('click','.edit_packages',function(){
		$('#modal_upadet_package').attr('data-type','edit');
		$('#modal_upadet_package input[name="name"]').val($(this).parents('tr').find('td:eq(0)').text());
		$('#modal_upadet_package input[name="credits"]').val($(this).parents('tr').find('td:eq(1)').text());
		$('#modal_upadet_package input[name="id"]').val($(this).attr('data-id'));
		$('#modal_upadet_package').modal('show');
	});

	$(document).on('click','#save_packag',function(){
		var type = $('#modal_upadet_package').attr('data-type'),
			name = $('#modal_upadet_package input[name="name"]').val(),
			credits = $('#modal_upadet_package input[name="credits"]').val();
		if(type == 'insert'){
			$.post( '/admin/add-package',{name:name,credits:credits}).done(function( data ) {
				if(data.success){
					$('#modal_add_package table').append('<tr data-id="'+data.id+'"><td>'+name+'</td><td>'+credits+'</td><td><textarea rows="2" cols="40">'+data.linck+'</textarea></td><td><div class="dropdown"><button id="dropdownMenuCategory'+data.id+'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default dropdown-toggle">Actions<span class="caret"></span></button><ul aria-labelledby="dropdownMenuCategory'+data.id+'" class="dropdown-menu"><li><a href="#" data-id="'+data.id+'" class="delete_category">Edit</a></li><li><a href="#" data-id="'+data.id+'" class="delete_package">Delete</a></li><li><a href="#" data-id="'+data.id+'" class="copy">Copy</a></li></ul></div></td></tr>');
					$('#packages_form').append('<div class="form-group"><label class="col-sm-2 control-label">'+name+'</label><div class="col-sm-8"><input id="package_price" type="number" placeholder="Price" name="package['+data.id+']" data-id="price-'+data.id+'" class="form-control"></div><div class="col-sm-2"><input id="package_checked" type="checkbox" name="package_checked[]" data-id="checkbox-'+data.id+'" value="'+data.id+'" class="form-control"></div></div>');
					$('#modal_upadet_package').modal('hide');
				}
			})
		}else if(type == 'edit'){
			var id = $('#modal_upadet_package input[name="id"]').val();
			$.post( '/admin/edit-package',{name:name,credits:credits,id:id}).done(function( data ) {
				if(data.success){
					$('#modal_add_package table tr[data-id="'+id+'"] td:eq(0)').html(name);
					$('#modal_add_package table tr[data-id="'+id+'"] td:eq(1)').html(credits);
					$('#packages_multiple option[value="'+id+'"]').html(name);
					$("#packages_multiple").select2({placeholder: "Select a state"});
					$('#modal_upadet_package').modal('hide');
				}
			})
		}

	})

	$(document).on('click','.delete_package',function(evt){
		var id = $(this).data('id'),
			type = 'package';
			modal = $('#modal_delete_plan_category');
		modal.attr('data-id',id);
		modal.attr('data-type',type);
		modal.find('.modal-body h4').html('Are you sure that you want to delete this package?');
		modal.modal('show');
	});

    $(document).on('click','.categorys',function(){
		var arr = $(this).attr('data-arr');
		$("#categorys_multiple").val(JSON.parse(arr)).select2({
			placeholder: "Select a state"
		});
		$('#modal_categorys').attr('data-id',$(this).attr('data-id'));
		$('#modal_categorys').modal('show');
	})

    $(document).on('click','#save_categorys',function(){
		var template_id = parseInt($('#modal_categorys').attr('data-id')),
			categorys = $('#categorys_multiple').val();

			if(categorys == null){
				categorys = [];
			}

		if(template_id){
			$.post( '/admin/category-update',{categorys:JSON.stringify(categorys),template_id:template_id}).done(function( data ) {
				if(data.success){
					$('a.categorys[data-id="'+template_id+'"]').attr('data-arr',JSON.stringify(categorys));
					$('a.categorys[data-id="'+template_id+'"]').prev('span').html(data.categorys_str);
					$('#modal_categorys').modal('hide');
				}
			})
		}else{
			alert('error');
		}
    });

    $(document).on('click','.category-list',function(){
		$('#modal_add_category').modal('show');
	});

    $(document).on('click','#add_category',function(evt){
		var category = $('#modal_add_category input[name="category"]').val();
		if(category.length > 0){
			$.post('/admin/add-category',{category:category}).done(function( data ) {
				if(data.success){
					$('#modal_add_category .category-list').last().after('<div class="category-list" data-id="'+data.id+'"><div class="col-sm-12" style="margin: 5px;"><label class="col-sm-8 control-label">'+data.name+'</label><div class="col-sm-4"><div class="dropdown" style="float: right;"><button id="dropdownMenuCategory'+data.id+'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default dropdown-toggle">Actions<span class="caret"></span></button><ul aria-labelledby="dropdownMenuCategory'+data.id+'" class="dropdown-menu"><li><a href="#" data-id="'+data.id+'" class="delete_category">Delete</a></li></ul></div></div></div>');
					$('#modal_add_category input[name="category"]').val('');
					$('#modal_add_category #dropdownMenuCategory'+data.id+'').dropdown();
					$('#categorys_multiple').append('<option value="'+data.id+'">'+data.name+'</option>');
					$("#categorys_multiple").select2({placeholder: "Select a state"});
				}
			});
		}
	});

    $(document).on('click','.delete_category',function(evt){
		var id = $(this).data('id'),
			type = 'category';
			modal = $('#modal_delete_plan_category');
		modal.attr('data-id',id);
		modal.attr('data-type',type);
		modal.find('.modal-body h4').html('Are you sure that you want to delete this category?');
		modal.modal('show');
	});

	$(document).on('click','.plans',function(){
		var arr = $(this).attr('data-arr');
		$("#plans_multiple").val(JSON.parse(arr)).select2({
			placeholder: "Select a state"
		});
		$('#modal_plans').attr('data-id',$(this).attr('data-id'));
		$('#modal_plans').modal('show');
	})

	$(document).on('click','#save_plans',function(){
		var template_id = parseInt($('#modal_plans').attr('data-id')),
			plans = $('#plans_multiple').val();

			if(plans == null){
				plans = [];
			}

		if(template_id){
			$.post( '/admin/plans-update',{plans:JSON.stringify(plans),template_id:template_id}).done(function( data ) {
				if(data.success){
					$('a.plans[data-id="'+template_id+'"]').attr('data-arr',JSON.stringify(plans));
					$('a.plans[data-id="'+template_id+'"]').prev('span').html(data.plans_str);
					$('#modal_plans').modal('hide');
				}
			})
		}else{
			alert('error');
		}
    });

    $(document).on('click','.plan-list',function(){
		$('#plans-modal').modal('show');
	});

    $(document).on('click','#add_plan',function(evt){
		var plan = $('#plans-modal input[name="plan"]').val();
		if(plan.length > 0){
			$.post('/admin/add-plan',{plan:plan}).done(function( data ) {
				if(data.success){
					$('#plans-modal .plan-list').last().after('<div class="plan-list" data-id="'+data.id+'"><div class="col-sm-12" style="margin: 5px;"><label class="col-sm-8 control-label">'+data.name+'</label><div class="col-sm-4"><div class="dropdown" style="float: right;"><button id="dropdownMenuPlan'+data.id+'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default dropdown-toggle">Actions<span class="caret"></span></button><ul aria-labelledby="dropdownMenuPlan'+data.id+'" class="dropdown-menu"><li><a href="#" data-id="'+data.id+'" class="upadet_plan">Edit</a></li><li><a href="#" data-id="'+data.id+'" class="delete_plan">Delete</a></li></ul></div></div></div>');
					$('#plans-modal input[name="plan"]').val('');
					$('#plans_multiple').append('<option value="'+data.id+'">'+data.name+'</option>');
					$("#plans_multiple").select2({placeholder: "Select a state"});
				}
			});
		}
	});

	$(document).on('click','.delete_plan',function(evt){
		var id = $(this).data('id'),
			type = 'plan';
			modal = $('#modal_delete_plan_category');
		modal.attr('data-id',id);
		modal.attr('data-type',type);
		modal.find('.modal-body h4').html('Are you sure that you want to delete this plan?');
		modal.modal('show');
	});

	$(document).on('click','.upadet_plan',function(evt){
		var id = $(this).data('id'),
			type = 'plan';
			modal = $('#modal_upadet_plan'),
			val = $(this).parents('.plan-list').find('label').text();
		modal.attr('data-id',id);
		modal.attr('data-type',type);
		modal.find('.modal-body input').val(val);
		modal.modal('show');
	});

	$(document).on('click','#yes_update_plan',function(evt){
		var modal = $('#modal_upadet_plan'),
			id = modal.attr('data-id'),
			type = modal.attr('data-type'),
			val = modal.find('input').val();
		if(type == 'plan' && id){
			modal.modal('hide');
			$.post('/admin/upadet-plan',{id:id,plan:val}).done(function( data ) {
				if(data.success){
					$('#plans-modal .plan-list[data-id="'+id+'"] label').html(data.plan);
					$('#plans_multiple option[value="'+id+'"]').html(val);
					$("#plans_multiple").select2({placeholder: "Select a state"});
				}
			});
		}else{
			modal.modal('hide');
		}
	});

	$(document).on('click','#yes_delete_plan_category',function(evt){
		var modal = $('#modal_delete_plan_category'),
			id = modal.attr('data-id'),
			type = modal.attr('data-type');
		if(type == 'plan' && id){
			modal.modal('hide');
			$.post('/admin/delete-plan',{id:id}).done(function( data ) {
				if(data.success){
					$('#plans-modal .plan-list[data-id="'+id+'"]').remove();
					$('#plans_multiple option[value="'+id+'"]').remove();
					$("#plans_multiple").select2({placeholder: "Select a state"});
				}
			});
		}else if(type == 'category' && id){
			modal.modal('hide');
			$.post('/admin/delete-category',{id:id}).done(function( data ) {
				if(data.success){
					$('#modal_add_category .category-list[data-id="'+id+'"]').remove();
					$('#categorys_multiple option[value="'+id+'"]').remove();
					$("#categorys_multiple").select2({placeholder: "Select a state"});
				}
			});
		}else if(type == 'package' && id){
			modal.modal('hide');
			$.post('/admin/delete-package',{id:id}).done(function( data ) {
				if(data.success){
					$('#modal_add_package table tr[data-id="'+id+'"]').remove();
					$('#packages_multiple option[value="'+id+'"]').remove();
					$("#packages_multiple").select2({placeholder: "Select a state"});
				}
			});
		}
	});

	$(document).on('click','.aep',function(){
		var id = $(this).attr('data-id');
		if(id){
			$.post( '/admin/get-template-aep',{id:id}).done(function( data ) {
				if(data.success){
					if(data.template.type == 'dynamic'){
						$('#modal_aep .modal-body').attr('data-type','dynamic');
						$('#modal_aep .modal-body').attr('data-id',data.template.id);
						var str = '<div class="col-md-12"><h4>Dynamic</h4></div><div class="col-md-12">';
							window.json_data = JSON.parse(data.template.json_data);
							$.each(JSON.parse(data.template.json_data),function(key,val){
								var aep = '';
								if(typeof val.aep != 'undefined')
									aep = val.aep;
								str+='<label>Slide '+key+'</label><div class="control-group"><div class="controls"><input type="text" class="form-control" name="slide-'+key+'" value="'+aep+'" data-id="'+key+'"></div></div>';
							});
							str+= '</div>';
							$('#modal_aep .modal-body').html(str);

						$('#modal_aep').modal('show');

					}else if(data.template.type == 'static'){
						$('#modal_aep .modal-body').attr('data-type','static');
						$('#modal_aep .modal-body').attr('data-id',data.template.id);
						$('#modal_aep .modal-body').html('<div class="col-md-12"><h4>Static</h4></div><div class="col-md-12"><label>Aep path</label><div class="control-group"><div class="controls"><input type="text" class="form-control" name="aep-path" value="'+data.template.aep+'"></div></div></div>');
						$('#modal_aep').modal('show');
					}
				}
			})
		}
	});

	$(document).on('click','#update_aep',function(){
		var type = $('#modal_aep .modal-body').attr('data-type'),
			id = $('#modal_aep .modal-body').attr('data-id');
			if(type == 'dynamic'){
				$('#modal_aep .modal-body input').each(function(key,val){
					if(typeof json_data[$(val).attr('data-id')]){
						json_data[$(val).attr('data-id')]['aep'] = $(val).val();
					}
				});

				$.post( '/admin/update-template-aep-dynamic',{id:id,json_data:JSON.stringify(json_data)}).done(function( data ) {
					if(data.success){
						$('#modal_aep').modal('hide');
					}
				});
			}else if(type == 'static'){
				var aep = $('#modal_aep .modal-body input[name="aep-path"]').val()
				$.post( '/admin/update-template-aep-static',{id:id,aep:aep}).done(function( data ) {
					if(data.success){
						$('#modal_aep').modal('hide');
					}
				});
			}
	});

	$(document).on('click','.edit-template',function(){
		var activ_page = table.DataTable().page()+1;
		if(activ_page == 1){
			window.location = '/admin/edit-template/'+$(this).attr('data-id');
		}else{
			window.location = '/admin/edit-template/'+$(this).attr('data-id')+'/'+activ_page;
		}
	});

	$(document).on('click','.copy', function(event) {
		var id = $(this).data('id'),
			copyTextarea = $('#modal_add_package tr[data-id="'+id+'"] td:eq(2) textarea');
			copyTextarea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying text command was ' + msg);
		} catch (err) {
			console.log('Oops, unable to copy');
		}
	});
});

function Packages(){};

Packages.prototype.getPackagesPrice = function(templatePackagesArr, templateId){
	var package_data = [];

	for(i in templatePackagesArr){
		var package_id = templatePackagesArr[i];

		for(k in packages){
			try{
				var templates = JSON.parse(packages[k]['templates']);
			}catch(e){
				var templates = [];
			}
			for(j in templates){
				if(typeof templates[j] === 'object'){
					if(templates[j]["id"] == templateId)
						package_data[package_id] = templates[j];
				}
			}
		}
	}
	return package_data;
};