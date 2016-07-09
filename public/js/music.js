$("document").ready(function(){

    $("#upload_mp3").change(function(e){
        $('#MyUploadForm').ajaxSubmit(options);
        return false;
    });

    $('.upload_mp3').click(function(){

        $('#upload_mp3').trigger('click');

    });


    var progressbox     = $('#progressbox'),
        progressbar     = $('#progressbar'),
        statustxt       = $('#statustxt'),
        completed       = '0%',
        data ={
            template_id: $("#video-editor").data('templateid'),
        }
        options = { 
            data:data,
            target:   '#output',
            beforeSubmit:  beforeSubmit,
            uploadProgress: OnProgress,
            success:       afterSuccess,
            resetForm: true
        }; 

    function OnProgress(event, position, total, percentComplete)
    {
        progressbar.width(percentComplete + '%')
        statustxt.html(percentComplete + '%');
        if(percentComplete>50)
            {
                statustxt.css('color','#fff');
            }
    }

    function afterSuccess(data)
    {  
        if(data.success){
            var str = '<li>'+
                '<div class="col1">'+
                '<div class="title">'+data.music_name+'</div>'+
                '<audio src="'+data.music_path+'", preload="auto"></audio>'+
                '</div>'+
                '<div class="col2">'+
                '<a href="#select" class="btn btn-info btn-xs pickme">Select</a>'+
                '<a href="javascript:void(0)" class="delete" data-id="'+data.insertId+'"><i class="fa fa-trash-o delete_music"></i></a>'+
                '</div>'+
                '</li>';
            $(".playlist").prepend(str);
            audiojs.create($('.playlist li').eq( 0 ).find('audio'))
        }else{

            $("#output").html("error");
        }
        progressbox.hide();

    }

    function beforeSubmit(){
        if (window.File && window.FileReader && window.FileList && window.Blob)
        {
            if( !$('#upload_mp3').val())
            {
                $("#output").html("Are you kidding me?");
                return false
            }
        
            var fsize = $('#upload_mp3')[0].files[0].size;
            var ftype = $('#upload_mp3')[0].files[0].type;
            
            switch(ftype)
            {
                case 'audio/mp3':
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
            
            progressbox.show();
            progressbar.width(completed);
            statustxt.html(completed);
            statustxt.css('color','#000');

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

    function start_music(music_path){
        if(music_path.length > 0){
            $.each(music_path, function(i, element) {
                $('.snd_'+element.id).snd(element.music_path);
            })
        }
    }

    $(document).on('click','.delete', function(){
        var id = $(this).data('id');
        var that = $(this);
        if(id){
            $.post( "/editor/music-delete", { delete_id:id, template_id: $("#video-editor").data('templateid')})
             .done(function( data ) {

                data=JSON.parse(data);
                if('success' in data){

                    if(data.success==true){
                       that.parents("li").remove();
                    }
                }else{
                   alert('Server Error! Pleas try again later!')
                }

            });
        }
    })
})
