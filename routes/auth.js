/**
 * Created by aleksa on 1/28/16.
 */
var express = require('express'),
    router = express.Router(),
    users=require('./../server/Class/Users/Users.js'),
    send_email=require('./../server/email/send-forgot-pass'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    crypto  = require('crypto');

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Welcome to express',user:false,header:'none' });
});
router.post('/login', function(req, res, next) {

    var post=req.body;
    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var Users = new users(connection);
        Users.validate_login(post,function(validation,user_data,email_err,pass_err){
            var errors={};
           // res.cookie('rememberme',user_id, { maxAge: 900000, httpOnly: true });

               if(validation){
                   req.session.user={
                       id:user_data.id,
                       name:user_data.name,
                       email:user_data.email,
                       date:new Date(user_data.date).getTime()/1000

                   }
                   var expire=30*24*60*60*1000;
                   req.session.cookie.expires = new Date(Date.now() + expire);
                   req.session.cookie.maxAge = expire;

                   Users.get_last_time_login(user_data.id,function(data){
                       if(!data){
                           console.log('no data-------------------------------------');
                           Users.update_last_time_login(user_data.id);
                           res.redirect("/video-designs?fist-time=true");
                       }else{
                           res.redirect("/video-designs");
                       }
                   });


               }else{
                   errors=true;
                   res.render('login', { title: 'Welcome to express' ,user:false,header:'none',errors:errors,email_err:email_err,pass_err:pass_err});
               }

        })
    })

});

router.get('/forgot-password', function(req, res, next) {
  res.render('forgot-password', { title: 'Welcome to express',user:false,header:'none',send_email_err:false});
});

router.post('/forgot-password', function(req, res, next) {

    var post=req.body,
        domain=req.protocol + '://' + req.get('host');
    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var Users = new users(connection);
        Users.validate_email(post,function(validation,user_data,email_err){
            var errors={};
            var send_email_err = false
              if(validation && user_data){
                crypto.pseudoRandomBytes(16, function (err, raw) {
                  var email=Object.create(send_email),
                    user_email = user_data.email,
                    user_name = user_data.name,
                    user_id = user_data.id,
                    token = raw.toString('hex') + Date.now()
                    Users.create_token(user_id,token,function(token_success){
                      if(token_success){
                        email.init(user_email,user_name,domain+'/auth/forgot/'+token)
                          .then(email.set_options)
                          .then(email.set_html)
                          .then(email.send)
                          .then(function(){
                            send_email_err = "none";
                            res.render('forgot-password', {user:false,header:'none',errors:errors,email_err:email_err,send_email_err:send_email_err});
                          })
                          .catch(function(err){
                            send_email_err = "err";
                            res.render('forgot-password', {user:false,header:'none',errors:errors,email_err:email_err,send_email_err:send_email_err});
                          })
                      }else{
                        send_email_err = "err";
                        res.render('forgot-password', {user:false,header:'none',errors:errors,email_err:email_err,send_email_err:send_email_err});
                      }
                    })
                });
              }else if(validation && user_data==false){
                  send_email_err = 'none';
                  res.render('forgot-password', {user:false,header:'none',errors:errors,email_err:email_err,send_email_err:send_email_err});
              }else{
                  send_email_err = false;
                  res.render('forgot-password', {user:false,header:'none',errors:errors,email_err:email_err,send_email_err:send_email_err});
              }

        })
    })

});

router.get('/forgot/:token?', function(req, res, next) {
  var get=req.params,
    token = get.token;

    if(token){
      req.getConnection(function(err, connection) {
        if (err) return next(err);
        var Users = new users(connection);
        Users.check_token(token,function(success){
          if(success){
            res.render('forgot', {user:false,header:'none',token:token});
          }else{
            res.render('404', {user:false,header:'none',errors:'Like your link is not valid or expired'});
          }
        });
      });
    }else{
      res.render('404', {user:false,header:'none',errors:'Like your link is not valid or expired'});
    }
})

router.post('/change-pass', function(req, res, next) {
   if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if(typeof post.pass_new == 'undefined' || !post.pass_new
            || typeof post.pass_repeat == 'undefined' || !post.pass_repeat
            || typeof post.token == 'undefined' || !post.token || post.pass_new != post.pass_repeat) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            if (err) throw(err);
          var Users = new users(connection);
          Users.check_token(post.token,function(success){
            if(success){
              Users.change_password(success.user_id,post.pass_new);
                res.end(JSON.stringify({success: true}));
            }else{
              res.end(JSON.stringify({fail: true}));
            }
          });
        });
    }else{
        res.status(404).send('Not found');
    }
})

router.get('/register', function(req, res, next) {
    // res.redirect('/auth/login');
    // return false;
    // var Users=new users(false);
    res.render('register', { title: 'Welcome to express' /*,val:Users.reg_post,errors:{}*/});
});
router.post('/register', function(req, res, next) {
    res.redirect('/auth/login');
    return false;
    var post=req.body;
    //  console.log(req.body);
    req.getConnection(function(err, connection) {
        if (err) return next(err);
        //  console.log('callback');
        var Users=new users(connection);
        Users.validate_user_registration(post,function(validation){
            if(validation){
                console.log('validation ok');
                Users.create_new_user(post.email,post.password,function(pass,user_id){
                    if(pass){
                        req.session.user={
                            id:user_id
                        }
                        res.redirect("/member");
                    }
                    else res.render('register', { title: 'Welcome to express',val:Users.reg_post,errors:{} });
                })
            }else{
                //    console.log(Users.reg_validation);

                res.render('register', {
                    title: 'Welcome to express' ,
                    errors:Users.reg_validation,
                    val:Users.reg_post

                });
            }

        });
     })
});

router.get('/logout', function(req, res, next) {
    var Users=new users(false);
    req.session.destroy(function(err) {
        res.redirect("/auth/login");
    })

});




//var packages={'starter':{'hash':'GLdCRsjopXx7ezCUHJJU9','credits':20},'maker':{'hash':'XDEsoSq3A59P3grsQ1kFvI','credits':20}};

router.get('/free-signin/:packag?', function(req, res, next) {
    var packag =req.params.packag;
        res.redirect("/signin/"+packag);
   

});








module.exports = router;
