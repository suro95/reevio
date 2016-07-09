// Custom jQuery
// ----------------------------------- 

    
    //select custom
    $('.selectpicker').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    });

    $('#user_videos').dataTable({
        'dom': '<"row custom-filter"<"col-md-6"f><"col-md-6"l<"toolbar">>>rtip',
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
        }
    });

    $('.datatables').dataTable({
        'paging':   true,  // Table pagination
        'ordering': true,  // Column ordering 
        'info':     true,  // Bottom left status text
        // Text translation options
        // Note the required keywords between underscores (e.g _MENU_)
        oLanguage: {
            sSearch:      'Search all columns:',
            sLengthMenu:  '_MENU_ records per page',
            info:         'Showing page _PAGE_ of _PAGES_',
            zeroRecords:  'Nothing found - sorry',
            infoEmpty:    'No records available',
            infoFiltered: '(filtered from _MAX_ total records)'
        }
    });
    
    
    
    var tablecheck = $('.datatables-checkbox').dataTable({
        'paging':   true,  // Table pagination
        'ordering': true,  // Column ordering 
        'info':     true,  // Bottom left status text
        'columnDefs': [{
             'targets': 0,
             'searchable':false,
             'orderable':false,
             'className': 'dt-body-center',
             'render': function (data, type, full, meta){
                 return '<input type="checkbox" name="id[]" value="' 
                    + $('<div/>').text(data).html() + '">';
             }
        }],
        'order': [1, 'asc'],
        // Text translation options
        // Note the required keywords between underscores (e.g _MENU_)
        oLanguage: {
            sSearch:      'Search all columns:',
            sLengthMenu:  '_MENU_ records per page',
            info:         'Showing page _PAGE_ of _PAGES_',
            zeroRecords:  'Nothing found - sorry',
            infoEmpty:    'No records available',
            infoFiltered: '(filtered from _MAX_ total records)'
        }
    });
    
    $('#select-all').change(function(){
        var cells = tablecheck.cells( ).nodes();
        $( cells ).find(':checkbox').prop('checked', $(this).is(':checked'));
    });
    
    
    // CLASSY LOADER
    $('[data-classyloader]').each(initClassyLoader);

    function initClassyLoader() {

      var $element = $(this),
          options  = $element.data();

      // At lease we need a data-percentage attribute
      if(options) {
        if( options.triggerInView ) {

          $scroller.scroll(function() {
            checkLoaderInVIew($element, options);
          });
          // if the element starts already in view
          checkLoaderInVIew($element, options);
        }
        else
          startLoader($element, options);
      }
    }



