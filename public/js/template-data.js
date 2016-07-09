/**
 * Created by aleksa on 2/4/16.
 */



var Template_data={
    slides_data:{},
    template_id:false,
    get_slides:function(){
        var that=this;
        this.template_id=$("#template-view").data("id");
        $(".template-containter").each(function(i,e){
            var slide_num=$(this).data('slidenum');
            that.slides_data[slide_num]={};
            that.slides_data[slide_num]['inputs']={};
            $(this).find('input').each(function(ii,ie){
                var input_pos=$(this).data('position');
                that.slides_data[slide_num]['inputs'][input_pos]=$(this).val();
            });
          });



    },
    ajax:function(){
        $.post( "/member/ajax-create-new-template", {slide_data:JSON.stringify(this.slides_data),template_id:this.template_id})
            .done(function( data ) {

                if('success' in data){
                    alert('Template data are saved');
                    window.location.href ="/member/my-videos";
                }else{
                    alert('Server error');
                }
            });


    }










};




$(document).ready(function(){




$("#submit-template-data").click(function(e){
    e.preventDefault();
    Template_data.get_slides();
    console.log('click');
    console.log(Template_data.slides_data,Template_data.template_id)
    //console.log(JSON.stringify(Template_data.slides_data));
     Template_data.ajax();
});














})


























































