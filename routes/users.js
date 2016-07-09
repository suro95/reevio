var express = require('express'),
    user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    users=require('./../server/Class/Users/Users.js'),
    router = express.Router(),
    credits=require('./../server/Class/Users/Credits.js');
    moment=require('moment'),
    video=require('../server/Class/Video/Video.js');







/* GET users listing. */
router.get('/settings',user_validation, function(req, res, next) {
// router.get('/settings', function(req, res, next) {

    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var Users=new users(connection);
          Users.get_user_data(req.session.user.id,function(rows){
            var vizeo = new video(connection,req.session.user.id);
                vizeo.get_user_videos_count(function(user_videos_count){
                //var Credits=Object.create(Credits);
                //Credits.init(connection,req.session.user.id);
                //var Credits=new credits(connection,5);
                //Credits.get_user_credits(function(credits){
                    res.render('account-settings', { title: 'Welcome to express',user:JSON.stringify(req.session.user),user_data:rows ,credits:req.credits ,user_videos_count:user_videos_count,date:moment(rows.date).format('YYYY-MM-DD')});
                //});
            });
        });
    });
});

router.post('/change-user-name',user_validation, function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;
        if(typeof post.name == 'undefined' && !post.name) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function (err, connection) {
            if (err) return next(err);
            var Users = new users(connection);
            Users.change_username(req.session.user.id, post.name,function(rows){
                if(rows){
                    res.end(JSON.stringify({success: true,name:post.name}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/change-user-pass',user_validation, function(req, res, next) {
    if(req.xhr) {
        var post = req.body,
            pass = post.pass.trim(),
            newpass = post.newpass.trim(),
            repass = post.repass.trim();
            req.getConnection(function(err, connection) {
                if(typeof pass == 'undefined' || typeof newpass == 'undefined' || typeof repass == 'undefined') {
                    res.end(JSON.stringify({fail: true}));
                    return false;
                }

                if(pass.length > 0 && newpass.length >= 8 && repass.length >= 8){
                    var Users = new users(connection);
                        Users.get_user_data(req.session.user.id,function(user_data){
                            Users.validate_user_pass(user_data.email,pass,function(success){
                                if(success){
                                    if(newpass === repass){
                                        Users.change_password(req.session.user.id,newpass);
                                        res.end(JSON.stringify({ pass: true,newpass: true,repass: true}));
                                    }else{
                                        res.end(JSON.stringify({ pass: true,newpass:true,repass:"Passwords are not the same"}));
                                    }
                                }else{
                                    res.end(JSON.stringify({pass: 'The password is wrong',newpass:true,repass:true}));
                                }
                            })
                        })
                }else{
                   res.end(JSON.stringify({
                        pass: 'This field is required',
                        newpass:'This field is required and its field must be at least 8 characters',
                        repass:'This field is required and its field must be at least 8 characters'}));
                }
        });
    }

});

 router.get('/my-videos',user_validation, function(req, res, next) {
// router.get('/my-videos', function(req, res, next) {

    var order =  req.param('sort') ? req.param('sort') : null;

    order = (order == "complete" ? "done" : (order=="draft" ? "not_done" : order));

    req.getConnection(function(err, connection) {
        if (err) return next(err);
     var Templates=new video_templates(connection,false, req.session.user.id);
        //  var Templates=new video_templates(connection,false, 5);
       //console.log('before run')
            Templates.get_my_videos(order,0,function(rows){
            //    console.log('inner run')
                Templates.templates_category_all(function(categorys){
                    var my_videos_count = rows.length;
                    for (var i = 0; i < my_videos_count; i++){
                       // rows[i].date = moment(rows[i].date).format('ll');
                    }
//console.log(rows);
                    var youtube = false;
                    if(req.session.youtube){
                        youtube = req.session.youtube.publis;
                        req.session.youtube.publis = false;
                    }
                    res.render('recent-videos', { title: 'Welcome to express', user:JSON.stringify(req.session.user),videos : rows , categorys : categorys ,my_videos_count:5,youtube:youtube,credits:req.credits });
                });
            });
    });
});

router.post('/my-videos-scroll',user_validation, function(req, res, next) {
// router.post('/my-videos-scroll', function(req, res, next) {
 if (req.xhr) {
    res.setHeader('Content-Type', 'application/json');
    var post = req.body,
        count = post.count;
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates=new video_templates(connection,false,req.session.user.id);
            //  var Templates=new video_templates(connection,false,5);
            Templates.get_my_videos(null,count,function(rows){
                if(rows){
                    var my_videos_count = rows.length;
                    for (var i = 0; i < my_videos_count; i++){
                        rows[i].date = moment(rows[i].date).format('ll');
                    }
                    res.end(JSON.stringify({ success: true,data:rows }));
                }else{
                    res.end(JSON.stringify({ success: false}));
                }
            });
        });
   } else res.status(404).send('Not found');
});

router.post('/delete-user-video',user_validation, function(req, res, next) {
// router.post('/delete-user-video', function(req, res, next) {

     if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post=req.body;
        if(post.id == undefined) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            if (err) return next(err);
             var Templates=new video_templates(connection,false,req.session.user.id);
            //  var Templates=new video_templates(connection,false,5);
            Templates.delete_user_video(post.id,function(rows){
                res.end(JSON.stringify({ success : true ,id:post.id}));
            })
        });
    }
});






router.post('/ajax-edit-user-settings',user_validation, function(req, res, next) {
// router.post('/ajax-edit-user-settings', function(req, res, next) {
    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');

        var post=req.body;

        if('useremail' in post) {
             if(!validator.isEmail(post.useremail)){

            req.getConnection(function (err, connection) {
                if (err) return next(err);
                var Users = new users(connection);
            Users.change_useremail(req.session.user.id, post.useremail);
                //   Users.change_useremail(5, post.useremail);
            });

            res.end(JSON.stringify({ result : 'success' }));
             }
        }
    }
});

router.get('/credits',user_validation, function(req, res, next) {
// router.get('/credits', function(req, res, next) {
    res.render('credits', { title: 'Welcome to express',user:JSON.stringify(req.session.user),credits:req.credits});
});




module.exports = router;
