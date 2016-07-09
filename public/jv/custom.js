/**
 * Created by aleksa on 3/18/16.
 */
$(document).ready(function(){





    $("#preview-player1").get(0).play();
    $("#preview-player1").siblings('.play_button').find('.fa').removeClass('fa-play').addClass('fa-pause');





$("#join-launch").click(function (e) {
    e.preventDefault();
    var name=$("#name").val().trim(),
        email=$("#email").val().trim();
    console.log(name,email);

    if(!name||!validateEmail(email)){
        alert("Name and Email are required!");
        return false;
    }


    $.post( "/ajax/jv", { name: name, email:email})
        .done(function( data ) {
            data=JSON.parse(data);
            if(data['success']){
                alert('Thanks for joining Launch');
                $("#name").val("");
                $("#email").val("");
                return false;
            }
            alert('Server error , please try again later!')
        });


})



})




function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}