$(document).ready(function() {
    videosName();

	$("#change_pass_save").click(function(){
        var pass = $("#account-form-password"),
            newpass = $("#account-form-password2"),
            repass = $("#account-form-password3"),
            error_pass = $('.error_pass'),
            error_newpass = $('.error_newpass'),
            error_repass = $('.error_repass'),
            validate = validate_change_pass(pass,newpass,repass);
            error_pass.empty();
            error_newpass.empty();
            error_repass.empty();
           if(validate.pass == true && validate.newpass == true && validate.repass == true){
                $.post( "/users/change-user-pass", { pass:pass.val().trim(), newpass: newpass.val().trim(), repass: repass.val().trim()}).done(function( data ){
                    data = JSON.parse(data);
                   if(data.pass == true && data.newpass == true && data.repass == true){
                        pass.val('');
                        newpass.val('');
                        repass.val('');
                        $('#success .modal-title').text('Your password has been changed ');
                        $('#success').modal('show');
                        setTimeout(function(){$('#success').modal('hide');}, 2000);
                    }else{
                        if(data.pass != true)
                            error_pass.text(data.pass);
                        if(data.newpass != true)
                            error_newpass.text(data.newpass);
                        if(data.repass != true)
                            error_repass.text(data.repass);
                    }
                });
            }else{
                if(validate.pass != true)
                    error_pass.text(validate.pass);
                if(validate.newpass != true)
                    error_newpass.text(validate.newpass);
                if(validate.repass != true)
                    error_repass.text(validate.repass);
            }
    });

 	$('#account-change-name-btn').click(function(){
        $('.error').remove();
        var name = $('#account-form-name').val();
        if(name.length > 0){
            $.post( '/users/change-user-name',{name:name}).done(function( data ) {
                if(data.success){
                $('#account-form-name').val('')
                    $('.user-name').html(data.name);
                    $('#success .modal-title').html('Your name has been changed ');
                    $('#success').modal('show');
                    setTimeout(function(){$('#success').modal('hide');}, 2000);
                }else{
                    alert("server error")
                }
            })
        }else{
            $('#account-form-name').after('<p class="error" style="color:red">This field is requried</p>')
        }
    });


    $(window).on('resize orientationchange', function() {
        videosName();
    });

});

function validate_change_pass(pass,newpass,repass){
    var pass = pass.val().trim(),
        newpass = newpass.val().trim(),
        repass = repass.val().trim(),
        data = {};
    if(pass){
        if(pass.length > 0)
            data['pass'] = true;
        else data['pass'] = 'Password must be more than five characters length!';
    }
    else data['pass'] = 'This field is requred';
    if(newpass && repass){
        if(newpass.length >= 5 && repass.length >= 5){
            if(newpass == repass){
                data["newpass"] = true;
                data["repass"] = true;
            }else{
                data["repass"] = 'Passwords are not the same';
            }
        }else {
         data["newpass"] = 'Password must be more than five characters length!';
         data["repass"] = 'Password must be more than five characters length!';
        }
    }else{
       data["newpass"] = 'This field is requred';
       data["repass"] = 'This field is requred';
    }
    return data;
}

function videosName(){
    $.each($('.video-name'),function(index,item){
        $(item).width($(item).parents('.info').width()*0.9);
    })
}

function refreshPagination(){
    $("div.holder").jPages('destroy');
    $("div.holder").jPages({
        containerID : "itemContainer",
        perPage:9,
        callback : function(){
            $('li canvas').each(initClassyLoader);
            videosName();
        }
    });
}