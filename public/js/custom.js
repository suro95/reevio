// Custom jQuery
// ----------------------------------- 

  var Popup = function(){

        var modal = this;
        
        //this function bind all the events connected with Modal window
        this.bindEvents = function(){

            var url = $('.btn-make a').attr('href');

            //loading the modal window
            $(document).on('click', '.btn-make a', function(){

                modal.loadModal();

                return false;
            })

            //saving the data in json format
            $(document).on('click', '#myModal .btn-save', function(){

                if(modal.validate()){

                    var field = [];

                    var obj = {};

                    $('#myModal .modal-body input').each(function(){


                        obj[$(this).attr('name')] = $(this).val();

                        field.push(obj);
                    })

                    field = JSON.stringify(field);

                    modal.save(url, field);

                }
            })
        }

        /* function to load the modal with dynamicallt added fields*/
        this.loadModal = function(){

            var template_id = $('#myModal .btn-save').attr('data-id');

            $.post(`/get-logo-templates/${template_id}`,  function(data, status){

                $('#myModal .modal-body').empty();

                if(status == "success"){

                    data = JSON.parse(data.rows[0].json_data);

                    data = data.inputs;

                    var inputs = $("");

                    for(var key in data){

                        var input = $("<input class='form-control form-field' style='width: 50%'>");

                        for(var k in data[key]){

                            input.attr(k, data[key][k]);
                        }
                        $('#myModal .modal-body').append(input);
                    }                  

                }
            });

            $('#myModal').modal();

        }

        /* function to validate the fields */
        this.validate = function(){

            var valid = true;

            $('#myModal .modal-body input').each(function(){

                //requried field
                if( !$(this).val() ){

                    valid = false;

                }

            })
            
            $('#myModal .modal-body').find('.message').remove()

            if(valid == false){

                $('#myModal .modal-body').prepend("<div class='message alert alert-danger'> Please fill al the fields </div>");

            }

            return valid;

        }

        /* function to save the data into the database */
        this.save = function(url, data){

            var template_id = $('#myModal .btn-save').data('id');

            $.post(`/save-user-video-data/${template_id}`, {"data": data}, function(data, status){
                location.href = url;
            });
        }
    }

$(document).ready(function() {
  
    var popup = new Popup();
    popup.bindEvents();

    //maxlength restriction for video list items' title
    $('ul.thumb-list li h3 a').each(function(){
        var item = $(this);
        if(item.html().length > 20){
            var title = item.html();
            var sub = item.html().substring(20);
            var text = item.html().replace(sub, "...");
            item.html(text);
            item.attr('title', title);
        }
    })

    $('html').ready(function() {
    setTimeout(function() {
         $('.main-loader').hide();
    }, 1000);

  });
    
  //slimscroller
  // $('.scroller').slimScroll({
        // height: '250px',
    // alwaysVisible: true
    // });
  //select 2 enable
  $('.select2').select2();
  
  //mega menubar
  var pageTop = $('.page-top');
  var link = pageTop.find('.collection-link');
  var menu = pageTop.find('.mega-menu');

  link.click(function(){
    link.toggleClass('show');
    menu.toggleClass('show');
  });


    var sliderVid = $('.video-slide');
    sliderVid.ready(function(){
        sliderVid.find('.video-editor').show();
        sliderVid.find('.loading-editor').hide();
    });


    sliderVid.find('.main-slide').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
        draggable: false,
    });
    sliderVid.find('.inner').slick({
            arrows: true,
            nextArrow: '<button class="fa fa-angle-right slick-right"></button>',
            prevArrow: '<button class="fa fa-angle-left slick-left"></button>',
            infinite: false,
            slidesToShow: 8,
            slidesToScroll: 1,
            rows: 1,
            accessibility: false,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 8,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                    }
                },
                {
          breakpoint: 480,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }
      ]
    });

    //default template
    var activeItem = sliderVid.find('.item-img.active a');
    getTemplate(activeItem);

    sliderVid.find('.item-img a').on('click', function(){
        console.log('click');
        var item = $(this);
        var slideIndex = item.parents('.slick-slide').index();
        if(slideValidation(slideIndex)) {
            sliderVid.find('.main-slide').slick('slickGoTo', parseInt(slideIndex));
            getTemplate(item);
            //show active
            sliderVid.find('.item-img').removeClass('active');
            item.parents('.item-img').addClass('active');
        }
    });

    function slideValidation(slide_id)
    {
        if(slide_id == 0)
            return true;

        var bool = true;

        if(typeof InsertedTempladeData[slide_id] == 'undefined'
            || typeof InsertedTempladeData[slide_id]['inputs'] == 'undefined') {

            showTextError(slide_id, 0);
            bool = false;
        }else{
            var InsertedInputs = InsertedTempladeData[slide_id]['inputs'],
                TemplateInputs = TemplateData[slide_id]['inputs'];

            $.each(TemplateInputs,function(index,vlaue){
                if( InsertedInputs[index] == undefined
                    || InsertedInputs[index]['value'] == ''
                    || InsertedInputs[index]['value'].length > TemplateInputs[index]['max']
                ){
                    showTextError(slide_id,index);
                    bool = false;
                }
            });
        }
        if(typeof TemplateData[slide_id]['images'] != 'undefined' && TemplateData[slide_id]['images']){
            if(typeof InsertedTempladeData[slide_id] == 'undefined'
                || typeof InsertedTempladeData[slide_id]['images'] == 'undefined') {

                showImagesError(slide_id, 0);
                bool = false;
            }else{
                var InsertedImages = InsertedTempladeData[slide_id]['images'],
                    TemplateImages = TemplateData[slide_id]['images'];

                $.each(TemplateImages,function(index,vlaue){
                    if( InsertedImages[index] == undefined
                        || InsertedImages[index]['name'] == ''
                        || InsertedImages[index]['path'] == ''
                    ){
                        showImagesError(slide_id,index);
                        bool = false;
                    }
                });
            }
        }

        if(bool)
            return true;
        else
            return false;
    }


    function showTextError(slide_id,input_id){

        var slideSelector = '.item-form a[data-pk='+slide_id+']',
            i = 0;

        if(input_id == 0){
            $(slideSelector).addClass('editable-empty');

            var initiInterval = setInterval(function(){

                i++;
                $(slideSelector).addClass('editable-error');
                setTimeout(function(){  $(slideSelector).removeClass('editable-error'); }, 300);

                if(i == 3)
                    clearInterval(initiInterval);

            },500);

        }else{

            $(slideSelector+'[data-inputposition='+input_id+']').addClass('editable-empty');

            var initiInterval = setInterval(function(){
                i++;
                $(slideSelector+'[data-inputposition='+input_id+']').addClass('editable-error');
                setTimeout(function(){$(slideSelector+'[data-inputposition='+input_id+']').removeClass('editable-error'); }, 300);

                if(i == 3)
                    clearInterval(initiInterval);

            },500);
        }

    }

    function showImagesError(slide_id, image_id){
        var slideSelector = '.item-form div[data-pk='+slide_id+']',
            i = 0;

        if(image_id == 0){
            $(slideSelector).addClass('empty');

            var initiInterval = setInterval(function(){

                i++;
                $(slideSelector+' div').addClass('editable-error');
                setTimeout(function(){  $(slideSelector+' div').removeClass('editable-error'); }, 300);

                if(i == 3)
                    clearInterval(initiInterval);

            },500);

        }else{

            $(slideSelector+'[data-imgpk='+image_id+']').addClass('empty');

            var initiInterval = setInterval(function(){
                i++;
                $(slideSelector+'[data-imgpk='+image_id+'] div').addClass('editable-error');
                setTimeout(function(){$(slideSelector+'[data-imgpk='+image_id+'] div').removeClass('editable-error'); }, 300);

                if(i == 3)
                    clearInterval(initiInterval);

            },500);
        }
    }

    function getTemplate(item) {

        var img = item.html();

        //show template
        $('#showTemplate').html(img);

        //show form
        var numInput = item.data('input');
        var numText = item.data('text');
        var numImg = item.data('img');

        var input = '<input type="text" class="form-control" name="input[]" placeholder="Type title here">';
        var text = '<textarea class="form-control" name="text[]" placeholder="Type description here"></textarea>';
        var imgFile = '<input type="file" class="" name="img[]">';

        var showFields = '';

        for (i = 0; i < numInput; i++) {
            showFields += '<div class="form-group">' + input + '</div>';
        }
        for (i = 0; i < numText; i++) {
            showFields += '<div class="form-group">' + text + '</div>';
        }
        for (i = 0; i < numImg; i++) {
            showFields += '<div class="form-group">' + imgFile + '</div>';
        }

        $('#formHere').html(showFields);
    }


    $('.popover').popover({ html : true, container: 'body'});

    var $scroller = $(window),
        inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

    $('[data-classyloader]').each(initClassyLoader);


    // block search filter
    var options = {
      valueNames: [ 'title', 'project', 'status', 'template', 'date' ]
    };

    var userList = new List('video-section', options);

    $('.searchEntry').click(function(){
        var stat = $(this).data('status');
        var listing = $('.video-section-listing').find('.list');
        var status = listing.find('.status');

        // status.each(function() {
            // if(stat == status.text()) {alert(status.text());
                // status.parents('li').hide();
            // }
        // });
   /*     listing.find('li')
            .filter(function(){
                if($(this).find('.status').text)
            })
            .hide();
        */


    });



    $("div.holder").jPages({
        containerID : "itemContainer",
        perPage:9,
        callback : function(){
            $('li canvas').each(initClassyLoader);
            videosName();
        }
    });











    /* ---------- PROJECT DETAIL ---------- */

    $("#select_project").change(function() {
        fillMyVideoTable();
    });

    /* ---------- PROJECT DETAIL ---------- */



});
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function initClassyLoader(elem) {

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
    function checkLoaderInVIew(element, options) {
      var offset = -20;
      if( ! element.hasClass('js-is-in-view') &&
          $.Utils.isInView(element, {topoffset: offset}) ) {
        startLoader(element, options);
      }
    }
    function startLoader(element, options) {
      element.ClassyLoader(options).addClass('js-is-in-view');
    }

var slider_data=[]