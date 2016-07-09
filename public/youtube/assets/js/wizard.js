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
        transitionEffect: "slideLeft",
        onStepChanging: function (event, currentIndex, newIndex)
        {
            form.validate().settings.ignore = ":disabled,:hidden";
            return form.valid();
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
        }
    });


  });

})(window, document, window.jQuery);
