/**
 * Created by aleksa on 3/18/16.
 */

var express = require('express'),
    router = express.Router(),
    validator = require('validator'),
    request=require('request');



router.post('/jv', function(req, res, next) {
    var post=req.body;
    if(post['name']&&post['email']){
    if(!post['name'].trim()||!validator.isEmail(post['email'])) return  res.end(JSON.stringify({ fail:true}));
        request.post({url:'http://enviseo.com/getresponse', form: {name:post.name,email:post.email,campaign:'reeviojv'}}, function(err,httpResponse,body){
            if(err) throw(err);
            console.log(body)



        })




        res.end(JSON.stringify({ success : 'success' }));
    }else{
        res.end(JSON.stringify({ fail:true}));
    }





});







module.exports = router;




















