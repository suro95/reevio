// Forms Demo
// ----------------------------------- 


(function(window, document, $, undefined){

  $(function(){

    // FORM EXAMPLE
    // ----------------------------------- 
    var form = $("#wizard-form");
    form.validate({
            errorPlacement: function errorPlacement(error, element) { 
                error.insertAfter(element);
            }
        });
    form.children("div").steps({
        headerTag: "h4",
        bodyTag: "fieldset",
        transitionEffect: "none",
        onStepChanging: function (event, currentIndex, newIndex)
        {   
            // ----------------------- Choose A Platform (Facebook(4)/YouTube(3))
            if(currentIndex == '0'){
                var category_id = $('.select-platform .btn-group label.active').attr('data-categoryId');
                $('.error').hide();
                $('.template-ads .template-listing li').hide();
                if(category_id == '4'){
                    $('.template-ads .template-listing li[data-category="'+category_id+'"]').show();
                }else if(category_id == '3'){
                    $('.template-ads .template-listing li[data-category="'+category_id+'"]').show();
                }

                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            }
            if(currentIndex == '1'){
                var template = $('.template-listing li .template-item .info .active').attr('data-template');
                if(typeof template != "undefined"){
                    window.location.href = '/editor/'+template+'';
                }else{
                    $('.error').show();
                    setTimeout(function(){ $('.error').hide(); }, 5000);
                }
            }
            if(currentIndex == '2'){
                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            }
        },
        onFinishing: function (event, currentIndex)
        {
            form.validate().settings.ignore = ":disabled";
            return form.valid();
        },
        onFinished: function (event, currentIndex)
        {
            alert("Submitted!");

            // Submit form
            $(this).submit();
        },
    });


  });

})(window, document, window.jQuery);
