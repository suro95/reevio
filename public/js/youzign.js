$("document").ready(function(){
    $(document).on('click','#search_img',function(e){

        $.ajax({
            type:"POST",
            url: "/editor/youzing",
            dataType:'json',
            success:function(data){
                $('.search-images').html('');
                for(i in data)
                {
                    $('.search-images').append('<div class="thumb-img" data-url="'+ data[i]['image_src'][0] +'"><img src="'+ data[i]['image_sizes']['thumbnail'][0] +'"></div>')
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    });
    $(document).on('click','#save_search_img',function(e){
        if( $('.search-images div.selected').get(0) )
        {
            var data = {
                'img_url':$('.search-images div.selected').data('url'),
                'template_id':$("#video-editor").data('templateid')
            };

            $.ajax({
                type:"POST",
                url: "/editor/upload-img",
                dataType:'json',
                data:data,
                success:function(data){
                    if('success' in data) {
                        $('#image___upload').find('.all_pic').append('<div class="thumb-img"><img src="'+data.path+'"></div>');
                    }else{
                        alert('Serve error , Please try again later!')
                    }
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    });
});