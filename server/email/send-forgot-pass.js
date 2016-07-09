/**
 * Created by alex on 6.6.16..
 */


var nodemailer = require('nodemailer'),
    smtp=require('./reevio_smtp'),
    smtpTransport = require('nodemailer-smtp-transport'),
    Promise=require('bluebird'),
    fs = require('fs');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'reevio.com',
    port: 25,
    secure:false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: smtp.username,
        pass: smtp.pass
    }
}));




var send_email={};
send_email.options={},
    send_email.template_location="/templates/forgot-pass.html";
    send_email.title="Password change";

send_email.init=function(user_email,user_name,change_pass){
    send_email.user_email=user_email;
    send_email.user_name=user_name;
    send_email.change_pass=change_pass;
    return Promise.resolve(true);
}


send_email.set_options=function(){

        send_email.options={
            from: 'reevio.com <'+smtp.username+'>', // sender address
            to: send_email.user_email, // list of receivers
            subject: 'Hello ✔ '+send_email.user_name, // Subject line
             html: '<b>Hello world 🐴</b>' // html body
        }
    return Promise.resolve(true);


}


send_email.set_html=function(){


return new Promise(function(resolve,reject){

    fs.readFile(__dirname+send_email.template_location, 'utf8', function (err,data) {
        if (err) {
            return reject(err);
        }

         var html=data.replace("%title%",send_email.title);
         if(send_email.user_name){
         html=html.replace("%name%",', '+send_email.user_name);
         }else{
         html=html.replace("%name%",'');
         }
         html=html.replace("%link%",send_email.change_pass);
        // console.log(html);
        send_email.options.html=html;
        return resolve();
    });


})




}


 
send_email.send=function(){


return new Promise(function(resolve,reject){

    transporter.sendMail(send_email.options, function(error, response) {
        if (error) {//console.log(error);
            return reject(error)
        }
       // console.log(response);
        return resolve(response);

    });


})







}










module.exports=send_email;




