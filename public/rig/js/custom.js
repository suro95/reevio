// Custom jQuery
// ----------------------------------- 

    
    //select custom
    $('.selectpicker').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    });

    
    $('#videoTable').dataTable({
        // 'dom': '<"row custom-filter"<"col-md-6"f><"col-md-6"l<"toolbar">>>rtip',
        'dom': '<"row custom-filter"<"col-md-6"f><"col-md-6"l>>rtip',
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
            zeroRecords:  'Nothing was found!',
            infoEmpty:    'No records available',
            infoFiltered: '(filtered from _MAX_ total records)'
        }
    });
    $("div.toolbar").html('   <div class="dropdown">'
                            +'  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
                            +'    Status'
                            +'    <span class="caret"></span>'
                            +'  </button>'
                            +'  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'
                            +'    <li><a href="#">filter1</a></li>'
                            +'    <li><a href="#">filter2</a></li>'
                            +'    <li><a href="#">filter3</a></li>'
                            +'  </ul>'
                            +'</div>'
                            +'<div class="dropdown">'
                            +'  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
                            +'    Rigged'
                            +'    <span class="caret"></span>'
                            +'  </button>'
                            +'  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'
                            +'    <li><a href="#">filter1</a></li>'
                            +'    <li><a href="#">filter2</a></li>'
                            +'    <li><a href="#">filter3</a></li>'
                            +'  </ul>'
                            +'</div>'
                            +'<div class="dropdown">'
                            +'  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
                            +'    Category'
                            +'    <span class="caret"></span>'
                            +'  </button>'
                            +'  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'
                            +'    <li><a href="#">filter1</a></li>'
                            +'    <li><a href="#">filter2</a></li>'
                            +'    <li><a href="#">filter3</a></li>'
                            +'  </ul>'
                            +'</div>');
    
    



