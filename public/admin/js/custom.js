// Custom jQuery
// ----------------------------------- 
$(document).ready(function() {
    //select custom
    $('.selectpicker').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    });

   window.table = $('#videoTable').dataTable({
        'dom': '<"row custom-filter"<"col-md-4"f><"col-md-8"l<"toolbar">>>rtip',
        'paging':   true,  // Table pagination
        'ordering': true,  // Column ordering 
        'info':     true,  // Bottom left status text
        // Text translation options
        // Note the required keywords between underscores (e.g _MENU_)
        language: {
            search: '',
            searchPlaceholder: 'Search entry...',
            lengthMenu:  '_MENU_',
            info:         'Showing page _PAGE_ of _PAGES_',
            zeroRecords:  'Nothing found - sorry',
            infoEmpty:    'No records available',
            infoFiltered: '(filtered from _MAX_ total records)'
        },
    });

    var str ='<div style="float: right;margin-right: 15px"><label><select id="status" class="form-control input-sm"><option value="">Status</option><option value="not_done">Not Done</option><option value="complete">Complete</option></select></label></div>'

    str+='<div style="float: right;margin-right: 15px"><label><select id="plans" class="form-control input-sm"><option value="">Plans</option>';
    if(all_plans){
        $.each(all_plans,function(key,val) {
            str+="<option value='"+val.name+"'>"+val.name+"</option>";
        })
    }
    str+='</select></label></div>';

    str+= '<div style="float: right;margin-right: 15px"><label><select id="packages" class="form-control input-sm"><option value="">Packages</option>';
    if(packages){
        $.each(packages,function(key,val) {
            str+="<option value='"+val.name+"'>"+val.name+"</option>";
        })
    }
    str+='<option value="add">Add New Packages</option></select></label></div>';

    str+='<div style="float: right;margin-right: 15px"><label><select id="categorys" class="form-control input-sm"><option value="">Categorys</option>';
    if(all_category){
        $.each(all_category,function(key,val) {
            str+="<option value='"+val.name+"'>"+val.name+"</option>";
        })
    }
    str+='<option value="add">Add New Categorys</option></select></label></div>';


    $('.custom-filter .col-md-8').last().append(str);
    // $("div.toolbar").html('   <div class="dropdown">'
    //                         +'  <button class="btn btn-default dropdown-toggle" type="button" id="status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
    //                         +'    Status'
    //                         +'    <span class="caret"></span>'
    //                         +'  </button>'
    //                         +'  <ul class="dropdown-menu" aria-labelledby="status">'
    //                         +'    <li><a href="#">filter1</a></li>'
    //                         +'    <li><a href="#">filter2</a></li>'
    //                         +'    <li><a href="#">filter3</a></li>'
    //                         +'  </ul>'
    //                         +'</div>');

    $(document).on('change','#categorys',function(){
        var _this = this;
        if($(_this).val() == 'add'){
            $(_this).val('');
            $('#modal_add_category').modal('show');
        }else{
            table.DataTable().column(2).search(
                $(_this).val()
            ).draw();
        }
    });

    $(document).on('change','#packages',function(){
        var _this = this;
        if($(_this).val() == 'add'){
            $(_this).val('');
            $('#modal_add_package').modal('show');
        }else{
            table.DataTable().column(3).search(
                $(_this).val()
            ).draw();
        }
    });

    $('#modal_add_category')

    $(document).on('change','#plans',function(){
        var _this = this;
        table.DataTable().column(8).search(
            $(_this).val()
        ).draw();
    })

    $(document).on('change','#status',function(){
        var _this = this;
        table.DataTable().column(10).search(
            $(_this).val()
        ).draw();
    })

    if(page && page != 0){
        table.DataTable().page(page-1).draw(false);
    }
});



