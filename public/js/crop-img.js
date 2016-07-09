
$("document").ready(function(){

    //tooltip logo
    Tipped.create('.image___file[data-logo="true"] .add-new-images-input');

    //slide image icon click
    $(document).on('click','.image___file',function(){

        var aspect = {
                        x: (typeof this.getAttribute("data-width") == 'undefined') ? '1920' : this.getAttribute("data-width"),
                        y: (typeof this.getAttribute("data-height") == 'undefined') ? '1080' : this.getAttribute("data-height"),
                        skip: (typeof this.getAttribute("data-skip") == 'undefined') ? false : this.getAttribute("data-skip"),
                        logo: (typeof this.getAttribute("data-logo") == 'undefined') ? false : this.getAttribute("data-logo"),
                        mixed:false
                    };

        var slide_id = $(this).parents('.current-slide').data('id');
        var position_id = $('.image-container[data-slideid="'+slide_id+'"]').attr('data-id');
        var img_id = $(this).attr("data-imgpk");
        var data_img = {
            slide_id : slide_id,
            position_id : position_id,
            img_id : img_id

        };

        console.log(data_img);
        window.crop = new Crop($('#image'),$('#image___crop .modal-body').width(), aspect,data_img);

        var img_id = $(this).data('imgpk');
        $('#image___upload').attr('data-pk',img_id);
        crop.data=$(this).data();
        crop.uploadingPopUp();

        if(aspect.skip == 'true'){
            $('.scip').show();
        }else{
            $('.scip').hide();
        }
    });

    $(document).on('click','.multi_element_img',function(){
        var _this = $(this).parents('.multi___element')
        var aspect = {
                        x: (typeof _this.attr("data-width") == 'undefined') ? '1920' : _this.attr("data-width"),
                        y: (typeof _this.attr("data-height") == 'undefined') ? '1080' : _this.attr("data-height"),
                        skip: false,
                        logo: false,
                        mixed:true
                    };
                    console.log(aspect);

        var slide_id = $(_this).parents('.current-slide').data('id');
        var position_id = $('.image-container[data-slideid="'+slide_id+'"]').attr('data-id');
        var img_id = $(_this).attr("data-imgpk");
        var data_img = {
            slide_id : slide_id,
            position_id : position_id,
            img_id : img_id

        };

        console.log(data_img);
        window.crop = new Crop($('#image'),$('#image___crop .modal-body').width(), aspect,data_img);

        var img_id = $(_this).data('imgpk');
        $('#image___upload').attr('data-pk',img_id);
        crop.data=$(_this).data();
        crop.uploadingPopUp();

        if(aspect.skip == 'true'){
            $('.scip').show();
        }else{
            $('.scip').hide();
        }
    });

    //images start modal "EDIT" button click
    $(document).on('click', '#edit-image', function(e){
        $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index:9999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');

        if($(crop.uploadPopUp).find('.thumb-img.selected img').length == 0){

            $('#loader-wrapper').remove();
            alert('Please select image.');
        }else{
            $('#image___crop .get-back').removeAttr('data-back');
            var img_url = $('.all_pic div.selected img').attr('data-original-image');
            crop.cropPopUp.attr('data-pk',crop.uploadPopUp.attr('data-pk'));
            $('#image___crop .modal-dialog').css({'max-width':'95%', 'margin': "0 auto" });
            $('#image___crop .modal-footer').css('background', 'rgba(0,0,0,0.7)');
            $('#image___crop img#old').attr('src', img_url);
            crop.cropingPopUp();
        }

    });

    //images start modal "ADD TO CANVAS" button
    $(document).on("click", "#cropper", function(){
        if($(crop.uploadPopUp).find('.thumb-img.selected img').length == 0){
            $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 9999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
            $('#image___oldCrop .scip').attr('data-upload',false);
                $('#loader-wrapper').remove();
                alert('Please select image.');
        }else{
            if (crop.aspect.logo == 'true') {
                crop.logoOnStartModal();
            }else{
                crop.oldCrop.find(".get-back").removeAttr("data-back");
                crop.cropingPopUp(1);
            }
        }
    });

    //crop modal "CONFIRM >" button
    $(document).on('click','.crop-old-confirm',function(){
        // crop.oldCrop.css('visibility','hidden');
        // $('.modal-backdrop').hide();
        crop.croppedImgSave(1);
    });

    //crop modal "SCIP >" button
    $(document).on('click','.scip',function(){
        var slide_id = $('.current-slide.active-slide').data('id'),
            slide_position = slider.currentSlideId,
            img_id = crop.oldCrop.attr('data-pk'),
            data_path = crop.oldCrop.find('img').attr('src');
            crop.slider.find('[data-id='+(slide_id)+'] [data-imgpk="'+img_id+'"]').append('<i class="loding fa fa-circle-o-notch fa-spin"></i>');
            crop.slider.find('[data-id='+(slide_id)+'] [data-imgpk="'+img_id+'"] .add-new-images-input').css('visibility','hidden');
            crop.oldCrop.hide();
            $('.modal-backdrop').hide();
            if($(this).attr('data-upload') == 'true'){
                crop.scip();
                // var data = new FormData();
                // data.append('file', crop.blob);
                // data.append('template_id', $('.app').data('template-id'));
                // uploadprogress();
                // $.ajax({
                //     method:"POST",
                //     url: '/editor/upload-blob',
                //     data: data,
                //         contentType: false,
                //         processData: false,
                //     success:function(data, status){
                //         uploaddone();
                //         if(data.success == true){
                //             // $('#image___upload').find('#user-images-con ul').append('<li><div class="item"><div class="thumb thumb-img"><i data-id="'+data.id+'" class="fa fa-trash delete-user-images" aria-hidden="true" style="position: absolute;right: 4px; top: 4px;z-index: 999; font-size: 1.5em;"></i><img data-original-image="'+data.path+'" src="'+data.cover_image+'" alt="Image Thumbnail" style=" " class="mCS_img_loaded"></div></div></li>');
                //             // crop.cropingPopUp(1,URL.createObjectURL(crop.blob));
                //             crop.blob = false;
                //             // $('#image___oldCrop .scip').attr('data-image-url',data.path);
                //             crop.saveIsertData(slide_position,img_id,window.location.origin+data.path);
                //         }else{
                //             alert('Server error, Please try again later!');
                //         }
                //     },
                //     error: function(err) {
                //         console.log(err);
                //     }
                // })
            }else{
                crop.saveIsertData(slide_position,img_id,window.location.origin+data_path);

            }

    });

    // lollipop "ADD TO CANVAS >" button
    $(document).on('click','.crop-confirm',function(){
        if (crop.aspect.logo == 'true') {
                var url = document.getElementById('new').toBlob(function(blob){
                    crop.blob = blob;
                    crop.scip();
                },"image/jpeg");
        }else{
            $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
            setTimeout(function(){
                $('#image___oldCrop .scip').attr('data-upload',true);
                var url = document.getElementById('new').toBlob(function(blob){
                    crop.blob = blob;
                    crop.cropingPopUp(1,URL.createObjectURL(blob));
                },"image/jpeg");
            }, 500)
        }
    });

    // crop modal hidden
    $('#image___oldCrop').on('hidden.bs.modal', function (e) {
        crop.Croppie.croppie('destroy');
        $('#new_crop').html('');
        $('.cropped-notify').css('visibility','hidden');
    })

    // img SEARCH modal button "Edit"
    $(document).on("click",".add-to-lolipop",function(){
        $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index:9999999"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
        var img_url = $(this).closest('.image-wrapper').data('url'),
            ajax_data = {
                'img_url':img_url,
                'template_id':$('.app').data('template-id')
            },
            tmpImg = new Image();

        tmpImg.src=img_url;
        $(tmpImg).one('load',function(){
            orgWidth = tmpImg.width;
            orgHeight = tmpImg.height;

                $('#image___crop .get-back').attr('data-back', "search");

                uploadprogress();
                crop.uploadImageFromUrlAjax(ajax_data,function(image_data){
                    $('#loader-wrapper').remove();
                    uploaddone();
                    if('success' in image_data) {
                        $('#image___upload').find('#user-images-con ul').append('<li><div class="item"><div class="thumb thumb-img"><i data-id="'+image_data.id+'" class="fa fa-trash delete-user-images" aria-hidden="true" style="position: absolute;right: 4px; top: 4px;z-index: 999; font-size: 1.5em;"></i><img data-original-image="'+image_data.path+'" src="'+image_data.cover_image+'" alt="Image Thumbnail" style=" " class="mCS_img_loaded"></div></div></li>');
                        crop.cropPopUp.attr('data-pk',crop.uploadPopUp.attr('data-pk'));
                        $('#image___crop .modal-dialog').css({'max-width':'95%', 'margin': "0 auto" });
                        $('#image___crop .modal-footer').css('background', 'rgba(0,0,0,0.7)');
                        $('#image___crop img#old').attr('src', image_data.path);
                        $('#image___crop').modal('show');
                        $('#image___upload').modal('hide');
                        crop.cropingPopUp();
                    }else{
                        alert('Serve error , Please try again later!')
                    }
                    $('#images-search___modal').modal('hide');
                });
        });
    });

    // img SEARCH modal button "Add to canvas"
    $(document).on("click",".add-image",function(){
        $('#image___oldCrop .scip').attr('data-upload',false);
        $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
        $('#image___oldCrop .get-back').attr('data-back', 'search');
        var data=crop.data,
            img=$(this).closest('.image-wrapper').data('url'),
            ajax_data = {
                'img_url':img,
                'template_id':$('.app').data('template-id')
            };
            slide_position=data.pk,
            name=data.imgpk,
            tmpImg = new Image();

        tmpImg.src=img;
        $(tmpImg).one('load',function(){
            orgWidth = tmpImg.width;
            orgHeight = tmpImg.height;
            $('#images-search___modal').modal('hide');
            crop.uploadImageFromUrlAjax(ajax_data,function(image_data){
                if('success' in image_data) {
                    $('#image___upload').find('#user-images-con ul').append('<li><div class="item"><div class="thumb thumb-img"><i data-id="'+image_data.id+'" class="fa fa-trash delete-user-images" aria-hidden="true" style="position: absolute;right: 4px; top: 4px;z-index: 999; font-size: 1.5em;"></i><img data-original-image="'+image_data.path+'" src="'+image_data.cover_image+'" alt="Image Thumbnail" style=" " class="mCS_img_loaded"></div></div></li>');

                    $("#image___oldCrop .modal-dialog").css('width', '800px');
                    crop.oldCrop.attr('data-pk',crop.uploadPopUp.attr('data-pk'));

                    crop.oldCrop.find('.modal-body img:first-child').removeAttr('src');
                    crop.croppie(image_data.path);
                    crop.oldCrop.modal('show');
                }else{
                    alert('Serve error , Please try again later!')
                }
            });
        });
    });

    // img start modal "DELETE" button
    $(document).on("click", "#delete-image", function(){console.log($('#user-images-con').find('.thumb-img.selected .delete-user-images'));
        if($('#user-images-con').find('.thumb-img.selected .delete-user-images').length){
            $('#modal_delete_image').modal('show');
        }

        // $(this).parents('.modal-dialog').find('.thumb-img.selected .delete-user-images').trigger( "click" );
    });

    // delete modal "DELETE" button
    $(document).on("click", "#yes_delete_image", function(){
        $('#image___upload .modal-dialog .thumb-img.selected .delete-user-images').trigger( "click" );
        $('#modal_delete_image').modal('hide');
    });

    $(document).on('click', '.delete-user-images', function(){
        var _this = $(this),
            id = $(this).data('id'),
            url = $(this).parent('div').find('img').attr('src');
        $.post('/editor/delete-user-images',{id:id,url:url}).done(function( data ) {
            _this.parents('li').remove();
        })
    });

    // img start modal selected
    $(document).on('click','.all_pic .thumb-img',function(){
        $('.all_pic .thumb-img').removeClass('selected');
        $(this).addClass('selected');
    });

    //"< BACK" button
    $(document).on('click', '.get-back', function(){
        $('body').append('<div id="loader-wrapper" style="opacity: 0.8"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
        if(!$(this).attr('data-back')){
            crop.cropPopUp.modal('hide');
            crop.uploadingPopUp();
            $('#loader-wrapper').remove();
        }else{
            crop.cropPopUp.modal('hide');
            crop.oldCrop.modal('hide');
            $('#images-search___modal').modal("show");
            $('#loader-wrapper').remove();
        }
    });

});
    

function Crop(editorElement,width,aspect,data_img){
    var _this = this;
    this.cropEditor = editorElement;
    this.width = width;
    this.cropPopUp = $('#image___crop');//lollipop
    this.oldCrop = $('#image___oldCrop');
    this.uploadPopUp = $('#image___upload');
    this.slider = $('.app-middle');
    this.cropperZoom = 0;
    this.aspect = aspect;
    this.data=false;
    this.img_width=false;
    this.img_height=false;
    this.data_img=data_img;

};

Crop.prototype.uploadingPopUp = function() {

    this.oldCrop.modal('hide');
    this.uploadPopUp.modal('show');
    $('#loader-wrapper').remove();

};

Crop.prototype.croppedImageSize=function(){
    var _this = this
        cropped_image_points = this.Croppie.croppie('get').points,
        cropped_image_width = cropped_image_points[2] - cropped_image_points[0],
        cropped_image_height = cropped_image_points[3] - cropped_image_points[1];

    if(cropped_image_width < this.aspect.x-3 || cropped_image_height < this.aspect.y-3){
        $('.cropped-notify').show();
    }else{
        $('.cropped-notify').hide();
    }

    return {"width":cropped_image_width,"height":cropped_image_height}
}

Crop.set_current_image_data=function(data){
    this.data=data;
}

Crop.prototype.croppie=function(img_url){
    var i = 0;
    var _this = this,
        x = 700,
        y = 400,
        width = _this.aspect.x,
        height = _this.aspect.y;

    if(_this.aspect.logo == 'true'){
        var newImg = new Image();

        newImg.onload = function() {
            height = newImg.height;
            width = newImg.width;
            if(width/height > x/y ){
                y = (height/width)*x;
            }else if(width/height < x/y){
                x = (y/height)*width;
            }

            _this.aspect.x = width;
            _this.aspect.y = height;
            setTimeout(function(){
            _this.Croppie = $('#new_crop').croppie({
                viewport: {
                    width: x,
                    height: y,
                    type: 'square'
                },
                boundary: { width: 768, height: 500 },
                exif: true,
                update:function(e){
                    _this.croppedImageSize();
                }
            });
            _this.Croppie.croppie('bind', {url: img_url});
            // _this.Croppie.croppie('result', 'html');
                var interval =  setInterval(function(){
                    if(typeof $('.cr-slider').attr('min') != 'undefined'){
                        clearInterval(interval);
                        _this.Croppie.croppie('setZoom',0 );
                        $('.cropped-notify').css('visibility','');
                        $('#loader-wrapper').remove();
                    }
                }, 500);

            }, 1000);

        }
        newImg.src = img_url
    }else{

        if(width/height < x/y ){
            x = (y/height)*width;
        }else if(width/height > x/y){
            y = (x/width)*height;
        }

        setTimeout(function(){
            _this.Croppie = $('#new_crop').croppie({
                  enableExif: true,
                viewport: {
                    width: x,
                    height: y,
                    type: 'square'
                },
                boundary: { width: 768, height: 500 },
                exif: true,
                update:function(e){
                    _this.croppedImageSize();
                }
            });
            _this.Croppie.croppie('bind', {url: img_url});
            // _this.Croppie.croppie('result', 'canvas');
                var interval =  setInterval(function(){
                    if(typeof $('.cr-slider').attr('min') != 'undefined'){
                        clearInterval(interval);
                        _this.Croppie.croppie('setZoom',0 );
                        $('.cropped-notify').css('visibility','');
                        $('#loader-wrapper').remove();
                    }
                }, 500);
        }, 1000);
    }
};

Crop.prototype.get_selected_image=function(){
    var img=$(this.uploadPopUp).find('.thumb-img.selected img');
    if(img.length&&img.attr('src'))return img.attr('src');
    return false;

}


Crop.prototype.removeLolipopImage = function(){
    var canvas = document.getElementById('new'),
        ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

Crop.prototype.cropingPopUp = function(popup, url) {
    var img_url = $('.all_pic div.selected img').attr('data-original-image'),
        _this = this;

    if(img_url || popup){
        if(url) img_url = url;
        var tmpImg = new Image();
        tmpImg.src=img_url;
        $(tmpImg).one('load',function(){
            orgWidth = tmpImg.width;
            orgHeight = tmpImg.height;
                _this.uploadPopUp.modal('hide');
                if(!popup){
                    _this.cropPopUp.attr('data-pk',_this.uploadPopUp.attr('data-pk'));
                    _this.cropPopUp.modal('show');
                    $('#loader-wrapper').remove();
                }else{
                    if(url) img_url = url;
                    $("#image___oldCrop .modal-dialog").css('width', '800px');
                    _this.oldCrop.attr('data-pk',_this.uploadPopUp.attr('data-pk'));
                    _this.oldCrop.modal('show');
                    _this.croppie(img_url);

                    if(_this.aspect.skip == 'true'){
                        _this.oldCrop.find('.skip').show();
                    }else{
                        _this.oldCrop.find('.skip').hide();
                    }
                }
        });
    }else{
        $('.image-error').html('Please select image.').fadeIn('slow');
        setTimeout(function(){ $('.image-error').fadeOut('slow'); }, 2000);
    }
};



Crop.prototype.saveIsertData = function(slide_position,img_id,data_path){
    var slide_id=$(".image-container[data-id='"+slide_position+"']").data('slideid');

    if(this.aspect.mixed == true ){
        if (!InsertedTempladeData[slide_position]) InsertedTempladeData[slide_position] = {};
        if (!InsertedTempladeData[slide_position][slide_id]) InsertedTempladeData[slide_position][slide_id] = {};
        if (!InsertedTempladeData[slide_position][slide_id]["mixed-media"])  InsertedTempladeData[slide_position][slide_id]["mixed-media"] = {};
        if (!InsertedTempladeData[slide_position][slide_id]["mixed-media"][img_id]) InsertedTempladeData[slide_position][slide_id]["mixed-media"][img_id] = {};
        InsertedTempladeData[slide_position][slide_id]["mixed-media"][img_id]['value']=data_path;
    }else{
        if (!InsertedTempladeData[slide_position]) InsertedTempladeData[slide_position] = {};
        if (!InsertedTempladeData[slide_position][slide_id]) InsertedTempladeData[slide_position][slide_id] = {};
        if (!InsertedTempladeData[slide_position][slide_id]["images"])  InsertedTempladeData[slide_position][slide_id]["images"] = {};
        if (!InsertedTempladeData[slide_position][slide_id]["images"][img_id]) InsertedTempladeData[slide_position][slide_id]["images"][img_id] = {};
        InsertedTempladeData[slide_position][slide_id]["images"][img_id]['value']=data_path;
    }

    // 'background-image':'url('+data_path.replace('public','')+')',
    if(this.aspect.logo == 'true'){
        this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"]')
            .removeClass('empty')
            .addClass('exist')
            .css({
                'background-size': '100% 100%',
                'background-repeat': 'no-repeat'
            });
        this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"] img').remove();
        this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"]').append('<img class="canvas-logo" src="'+data_path.replace('public','')+'">');
    }else{
        this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"]')
            .removeClass('empty')
            .addClass('exist')
            .css({
                'background-image':'url('+data_path.replace('public','')+')',
                'background-size': '100% 100%',
                'background-repeat': 'no-repeat'
            });
    }

    if(this.aspect.mixed == true ){
        if(this.slider.find('[data-id='+(slide_position)+'] [data-imgpk="'+img_id+'"] canvas'))
            this.slider.find('[data-id='+(slide_position)+'] [data-imgpk="'+img_id+'"] canvas').remove();
        this.slider.find('[data-id='+(slide_position)+'] [data-imgpk="'+img_id+'"] .add_mixed_media').css('visibility','');

    }else{
        if(typeof Object.keys(InsertedTempladeData[slide_position][slide_id]["images"]) != "undefined"){
            var element = $(".image-container[data-id='"+slide_position+"'] .steps .validate-imgs"),
                count = Object.keys(InsertedTempladeData[slide_position][slide_id]["images"]).length,
                max_count = Object.keys(TemplateData[slide_id]["images"]).length;

            element.html(count + "/" + max_count);
        }
        this.slider.find('[data-id='+(slide_position)+'] [data-imgpk="'+img_id+'"] .add-new-images-input').css('visibility','');
    }
    $('#image___oldCrop').modal('hide');
    if( this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"] .loding').length > 0)
        this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"] .loding').remove();
    this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"] .add-new-images-input').show();
    this.slider.find('[data-id="'+(slide_position)+'"] [data-imgpk="'+img_id+'"] .add_mixed_media').show();
    peercents();
    selected_slide();
};

Crop.prototype.croppedImgSave = function(img, url) {
    uploadprogress()
    var _this = this,
        img_id = ( !img ? this.cropPopUp.attr('data-pk') : this.oldCrop.attr('data-pk') ),
        slide_id = $('.current-slide.active-slide').data('id');
        _this.slider.find('[data-id='+(slide_id)+'] [data-imgpk="'+img_id+'"]').css('background-image','');
        _this.slider.find('[data-id='+(slide_id)+'] [data-imgpk="'+img_id+'"]').append('<div id="loader" style="width: 50px; height: 50px; margin: auto;top: 0;bottom: 0;left: 0;right: 0;position: absolute;" class="loding"></div>');
        _this.slider.find('[data-id='+(slide_id)+'] [data-imgpk="'+img_id+'"] .add-new-images-input').css('visibility','hidden');
        _this.slider.find('[data-id='+(slide_id)+'] [data-imgpk="'+img_id+'"] .add_mixed_media').css('visibility','hidden');
        $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 9999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    setTimeout(function(){
        $('#new_crop').croppie('result', {
            type: 'canvas',
            size:{width: _this.aspect.x,height: _this.aspect.y},
            format: 'png'
        }).then(function (resp) {
            _this.oldCrop.modal('hide');
            $('#loader-wrapper').remove();
            setTimeout(function(){
            var data = {'image': resp, 'slide_id': slide_id, 'img_id': img_id,template_id:$('.app').data('template-id')};

                $.ajax({
                    method:"POST",
                    url: '/editor/slider-cropped-upload',
                    data: data,
                    success:function(data, status){
                        uploaddone();
                        $('#loader-wrapper').remove();
                        var slide_id = data.slide_id,
                            img_id = data.img_id;

                        if('success' in data){
                            if(slide_id && img_id) {
                                // $('#image___upload').find('#user-images-con ul').append('<li><div class="item"><div class="thumb thumb-img"><i data-id="'+data.id+'" class="fa fa-trash delete-user-images" aria-hidden="true" style="position: absolute;right: 4px; top: 4px;z-index: 999; font-size: 1.5em;"></i><img data-original-image="'+data.path+'" src="'+data.cover_image+'" alt="Image Thumbnail" style=" " class="mCS_img_loaded"></div></div></li>');
                                _this.saveIsertData(slide_id,img_id,data.path);
                            }else{
                                alert('Server error, Please try again later!');
                            }
                        }else{
                            alert('Server error, Please try again later!');
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },1000);

        })
    },100)
};

Crop.prototype.originImgUpload = function(data) {
    var _this = this;
    //_this.uploadPopUp.find('.all_pic').append('<div class="thumb-img"><i class="loding fa fa-circle-o-notch fa-spin"></i></div>');

    $.ajax({
        method:"POST",
        url: '/editor/slider-origin-upload',
        data: data,
        contentType: false,
        processData: false,
        success:function(data){
            if('success' in data) {
                _this.uploadPopUp.find('.all_pic .thumb-img').last().html('<img data-original-image="'+data.path+'" src="'+data.cover_image+'">');
            }else{
                _this.uploadPopUp.find('.all_pic .thumb-img').last().remove();
                alert('Serve error , Please try again later!');
            }
        },
        error:function(err){
            alert("err");
        }
    });
};

Crop.prototype.checkImageSize = function(element,data) {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    var _URL = window.URL || window.webkitURL,
        _this = this;

    if ((file = element.files[0])) {
        img = new Image();
        img.onload = function () {
            if(this.width >= 770 && this.height >= 250){
                _this.originImgUpload(data);
            }else{
                //alert('The image mush be min. 770x250 px');
                $('.image-error').html('The image mush be min. 770x250 px').fadeIn('slow');
                setTimeout(function(){ $('.image-error').fadeOut('slow'); }, 2000);
            }
        };
        img.src = _URL.createObjectURL(file);
    }
};

Crop.prototype.uploadImageFromUrl = function(img_url){
    var data = {
        'img_url':img_url,
        'template_id':$('.app').data('template-id')
    };

    this.uploadImageFromUrlAjax(data,function(data){
        console.log(data)
        if('success' in data) {
            $('#image___upload').find('#user-images-con ul').append('<li><div class="item"><div class="thumb thumb-img"><img src="'+data.path+'" alt="Image Thumbnail" style=" " class="mCS_img_loaded"></div></div></li>');
        }else{
            alert('Serve error , Please try again later!')
        }
    })
};

Crop.prototype.uploadImageFromUrlAjax = function(data,cal){
    $.ajax({
        type:"POST",
        url: "/editor/upload-img",
        dataType:'json',
        data:data,
        success:cal,
        error:function(err){
            console.log(err);
        }
    });
};

Crop.prototype.scip = function(slide_position,img_id,blob){
    $(this.uploadPopUp).modal('hide');
    $(this.cropPopUp).modal('hide');
    $(this.oldCrop).modal('hide');
    this.slider.find('[data-id='+(this.data_img.slide_id)+'] [data-imgpk="'+this.data_img.img_id+'"] img').remove();
    this.slider.find('[data-id='+(this.data_img.slide_id)+'] [data-imgpk="'+this.data_img.img_id+'"]').append('<div id="loader" style="width: 50px; height: 50px; margin: auto;top: 0;bottom: 0;left: 0;right: 0;" class="loding"></div>');
    this.slider.find('[data-id='+(this.data_img.slide_id)+'] [data-imgpk="'+this.data_img.img_id+'"] .add-new-images-input').css('visibility','hidden');
    var data = new FormData();
        data.append('file', this.blob);
        data.append('template_id', $('.app').data('template-id')),
        slide_position = this.data_img.position_id,
        img_id = this.data_img.img_id;
        uploadprogress();
        $.ajax({
            method:"POST",
            url: '/editor/upload-blob',
            data: data,
                contentType: false,
                processData: false,
            success:function(data, status){
                uploaddone();
                if(data.success == true){
                    // $('#image___upload').find('#user-images-con ul').append('<li><div class="item"><div class="thumb thumb-img"><i data-id="'+data.id+'" class="fa fa-trash delete-user-images" aria-hidden="true" style="position: absolute;right: 4px; top: 4px;z-index: 999; font-size: 1.5em;"></i><img data-original-image="'+data.path+'" src="'+data.cover_image+'" alt="Image Thumbnail" style=" " class="mCS_img_loaded"></div></div></li>');
                    // crop.cropingPopUp(1,URL.createObjectURL(crop.blob));
                    crop.blob = false;
                    // $('#image___oldCrop .scip').attr('data-image-url',data.path);
                    crop.saveIsertData(slide_position,img_id,window.location.origin+data.path);
                }else{
                    alert('Server error, Please try again later!');
                }
            },
            error: function(err) {
                console.log(err);
            }
        })
}

Crop.prototype.logoOnStartModal = function(){
    $(this.uploadPopUp).modal('hide');
    var path = $(this.uploadPopUp).find('.thumb-img.selected img').data('original-image');
    this.slider.find('[data-id='+(this.data_img.slide_id)+'] [data-imgpk="'+this.data_img.img_id+'"] img').remove();
    this.slider.find('[data-id='+(this.data_img.slide_id)+'] [data-imgpk="'+this.data_img.img_id+'"]').append('<div id="loader" style="width: 50px; height: 50px; margin: auto;top: 0;bottom: 0;left: 0;right: 0;" class="loding"></div>').css('outline','none');
    this.slider.find('[data-id='+(this.data_img.slide_id)+'] [data-imgpk="'+this.data_img.img_id+'"] .add-new-images-input').css('visibility','hidden');
    this.saveIsertData(this.data_img.position_id,this.data_img.img_id,window.location.origin+path);
}





image_token="";

$("#dropzone-images-start-modal").dropzone({
    dictDefaultMessage: "DROP YOUR IMAGES HERE OR CLICK TO UPLOAD",
    previewTemplate:"",
    "acceptedFiles": "image/*",
    addedfile: function (file) {
    },
    thumbnail: function (file, dataUrl) {
    },
    uploadprogress: function (file, progress, bytesSent) {
    },
    success:function(file,success){
        uploaddone()
        if(success.success){
            $('#'+image_token).find("i").remove();
            $('#'+image_token).find("img").attr("src", success.cover_image).attr("data-original-image", success.path);
            $('#'+image_token).find("img").before('<i data-id="'+success.id+'" class="fa fa-trash delete-user-images" aria-hidden="true" style="position: absolute;right: 4px; top: 4px;z-index: 99999999; font-size: 1.5em;"></i>');
        }else{
            $('#'+image_token).parents('li').remove();
            if(success.reason){
                alert(success.reason);
            }else{
                alert("server error");
            }
        }
    },
    sending:function(file,data,token){
        uploadprogress()
        image_token=Math.random().toString(36).substr(2);
        jQuery('#dropzone').append(jQuery("<input type='hidden' name='token' value='"+ image_token+"'>"));
        $('#user-images-con').find('ul').append('<li><div class="item"><div id="'+image_token+'" class="thumb thumb-img"><i class="loding fa fa-circle-o-notch fa-spin"></i><img></div></div></li>');
    }
})

window.progress = '';

function uploadprogress(){
    progress +='1';
    $('.navbar-loding').show();
    console.log($('#submit-video'))
    $('#submit-video').attr('disabled',true)
}

function uploaddone(){
    if(progress.length-1 == 0){
        $('.navbar-loding').hide();
        progress = '';
        $('#submit-video').attr('disabled',false)
    }else{
        var length = progress.length;
        progress = '';
        for(var i = 0 ; i < length - 1 ; i++){
            progress +='1';
        }
    }
}
