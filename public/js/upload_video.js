$("document").ready(function(){

    $("#upload_video").change(function(e){

        var options = { 
                data:{user_videos_id:$(this).parents('.user_videos_id').data('id')},
                target:   '#output',
                beforeSubmit:  beforeSubmit,
                success:afterSuccess,
                resetForm: true
            }; 
            
        $('#MyUploadForm').ajaxSubmit(options);
        return false;
    });

    function afterSuccess(data)
    {  
        if(data.success){
            $('.user_videos_id[data-id='+data.user_videos_id+']').remove();
        }else{

            $("#output").html("error");
        }
    }

    function beforeSubmit(){
        if (window.File && window.FileReader && window.FileList && window.Blob)
        {
            if( !$('#upload_video').val())
            {
                $("#output").html("Are you kidding me?");
                return false
            }
        
            var fsize = $('#upload_video')[0].files[0].size;
            var ftype = $('#upload_video')[0].files[0].type;
            
            switch(ftype)
            {
                case 'video/mp4':
                    break;
                default:
                    $("#output").html("<b>"+ftype+"</b> Unsupported file type!");
                    return false
            }
            
            if(fsize>10485760)
            {
                $("#output").html("<b>"+bytesToSize(fsize) +"</b> Too big Image file! <br />Please reduce the size of your photo using an image editor.");
                return false
            }

            $("#output").html("");  
        }
        else
        {
            $("#output").html("Please upgrade your browser, because your current browser lacks some new features we need!");
            return false;
        }
    }

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
})
