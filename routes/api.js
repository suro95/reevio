/**
 * Created by aleksa on 3/15/16.
 */

var express = require('express'),
    router = express.Router(),
    get_video=require('../server/Api/dataclay/GetVideo');




router.post('/dataclay/rlo30U8cLn', function(req, res, next) {
    var post=req.body,
        msg='';
  //  var post=req.query;
    if(!('id' in post)||!('video_url' in post)){
       return res.end(JSON.stringify({ fail:"Params are not set!" }));
    }
      res.setHeader('Content-Type', 'application/json');

    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var GetVideo=Object.create(get_video);
        GetVideo.init(connection,post.id,post.video_url)
             .then(GetVideo.validate_dataclay_data)
             .then(GetVideo.save_video)
             .then(GetVideo.crop_cover)
             .then(GetVideo.notify_user)

             .then(function(){
                res.end(JSON.stringify({ success : 'success' }));
             })
             .catch(function(err){
              console.error(err);

              /*
                 throw(err);
                var msg="";
                switch(err){
                    case "save":msg="saving error";break;
                    case "notify_error":msg='notify error';
                    default:msg='unknown error';
                }

               */
                 res.end(JSON.stringify({ fail:err}));

            })



    })

   // res.end(JSON.stringify({ success : 'success' }));


});







module.exports = router;




















