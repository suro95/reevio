$(document).ready(function(){
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

	var table = $('#videoTable').DataTable();
});