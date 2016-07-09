var express = require('express'),
    moment=require('moment'),
    router = express.Router(),
    user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    users=require('./../server/Class/Users/Users.js');


router.get('/login', function(req, res, next) {
    res.redirect("/auth/login");

});

router.get('/testpayment', function(req, res, next) {

    res.render('testpayment', { title: '' });
});


/* GET home page. */
router.get('/', function(req, res, next) {
 // res.redirect("/jv");
 // return false;
  res.render('sales', { title: 'welcome to Reevio!' });
});

router.get('/kinetic-offer', function(req, res, next) {
  res.render('landing', { title: '' });
});
router.get('/welcome', function(req, res, next) {
    res.render('welcome', { title: '',credits:req.credits  });
});

router.get('/thank-you', function(req, res, next) {
  res.render('thank-you', { title: '',credits:req.credits  });
});


router.get('/marketplace', function(req, res, next) {
  res.render('marketplace', { title: 'Marketplace' });
});

router.get('/product-item', function(req, res, next) {
  res.render('product-item', { title: 'Product Item' });
});

router.get('/product', function(req, res, next) {
  res.render('product', { title: 'Product' });
});

router.get('/jv', function(req, res, next) {
  res.render('jv', { title: 'Comming Soon' });
});

//ajax, getting logo_templates.jsondata
router.post('/get-logo-templates/:template_id', function(req, res){
    if(req.xhr){
      var template_id=req.params.template_id;
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            res.setHeader('Content-Type', 'application/json');

            var Templates = new video_templates(connection, template_id,req.session.user.id);
            Templates.get_logo_template_fields(function(rows){
                res.end(JSON.stringify({"rows": rows}));
            })
        });
    }else{
        res.status(404).send('Not found');
    }
});


//ajax, save modal data into user_videos table
router.post('/save-user-video-data/:template_id', function(req, res){
    if(req.xhr){
      res.setHeader('Content-Type', 'application/json');
      var template_id=req.params.template_id;
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            res.setHeader('Content-Type', 'application/json');

            var post = JSON.stringify(req.body.data);

            // var Templates = new video_templates(connection, template_id ,req.session.user.id );
            var Templates = new video_templates(connection, template_id,req.session.user.id);

            Templates.save_user_videos(1, template_id, post, moment().format('YYYY-MM-DD'), function(data){
              res.end(JSON.stringify({'success': true}));
            });

        });
    }else{
        res.status(404).send('Not found');
    }
});

 router.get('/video-designs',user_validation, function(req, res, next) {
    
  var category_name=req.params.category_name;
  req.getConnection(function(err, connection) {
    var template_data=[];
    if (err) return next(err);
      var Templates=new video_templates(connection,false,false);
      var Users = new users(connection);
          Users.get_user_data(req.session.user.id,function(user){
            Templates.templates_category_all(function(categorys){
                Templates.get_templates_complete(user.packages,function(err,rows){
                // Templates.get_templates_limit(0,100,function(err,rows){
                  if(err)throw err;


                   
                  res.render('templates', { title: 'Welcome to express',user:JSON.stringify(req.session.user), videos : rows,categorys : categorys,credits:req.credits,video_count:rows.length});
              })
            });
          })
  });
});

router.post('/show_grid', function(req, res, next) {
  if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            id = post.id;
            req.getConnection(function(err, connection) {
              if (err) return next(err);
                var Templates=new video_templates(connection,false,false);
                      Templates.get_template_grid(id,function(err,rows){
                        if(err)throw err;
                        if(rows){
                          Templates.get_templates_child(id,function(child){

                            res.end(JSON.stringify({ success: true,data:rows,child:child }));

                          });
                        }else{

                          res.end(JSON.stringify({ success: false }));

                        }
                  })
            });
   } else res.status(404).send('Not found');

})
router.post('/video-designs-load-more', function(req, res, next) {
  if (req.xhr) {
    res.setHeader('Content-Type', 'application/json');
    var post = req.body,
        id =post.id;
        req.getConnection(function(err, connection) {
          if (err) return next(err);

          var Templates=new video_templates(connection,false,false);
              Templates.get_templates_limit(id,20,function(err,rows){
                if(err)throw err;
                if(rows){

                  res.end(JSON.stringify({ success: true,data:rows }));

                }else{

                  res.end(JSON.stringify({ success: false }));

                }
              })
        });
   } else res.status(404).send('Not found');
});

 router.get('/preview/:template_id',user_validation, function(req, res, next) {
//router.get('/preview/:template_id', function(req, res, next) {
  var template_id=req.params.template_id;

  req.getConnection(function(err, connection) {
    if (err) return next(err);
    var Templates=new video_templates(connection,template_id,false);
    Templates.get_template_by_id(function(rows){
      if(!rows)res.redirect('/member/templates');
      res.render('preview', { title: 'Welcome to express',video:rows });
    })
  });
});












 router.get('/help',user_validation, function(req, res, next) {
//router.get('/help', function(req, res, next) {
  res.render('help', { title: 'Help',user:JSON.stringify(req.session.user),credits:req.credits});
});





 router.get('/order-status',user_validation, function(req, res, next) {
//router.get('/order-status', function(req, res, next) {
  res.render('order-status', { title: 'Welcome to express' });
});

 router.get('/preview-info',user_validation, function(req, res, next) {
//router.get('/preview-info', function(req, res, next) {
  res.render('preview-info', { title: 'Welcome to express' });
});


 router.get('/online-ads',user_validation, function(req, res, next) {
//router.get('/online-ads', function(req, res, next) {
  res.render('online-ads', { title: 'Welcome to express' });
});

 router.get('/purchased-videos',user_validation, function(req, res, next) {
//router.get('/purchased-videos', function(req, res, next) {
  res.render('purchased-videos', { title: 'Welcome to express' });
});

router.get('/recent-videos',user_validation, function(req, res, next) {
// router.get('/recent-videos', function(req, res, next) {
  res.render('recent-videos', { title: 'Welcome to express' });
});


router.get('/review',user_validation, function(req, res, next) {
// router.get('/review', function(req, res, next) {
  res.render('review', { title: 'Welcome to express' });
});




router.get('/recent-videos',user_validation, function(req, res, next) {
// router.get('/recent-videos', function(req, res, next) {
  res.render('recent-videos', { title: 'Welcome to express' });
});

router.get('/signin/:packag?', function(req, res, next) {
  res.render('signin', { title: 'Welcome to express',header:'none',error:false});
});

router.post('/signin/:packag?', function(req, res, next) {
  var post=req.body,
  get=req.params,
  packag = get.packag,
  packag_name = [],
  credits;

  req.getConnection(function(err, connection) {
  if (err) return next(err);
    var Users = new users(connection);
    var email_err;
    var pass_err;
    var pass_err_repeat;
    var success = true;
    var Templates=new video_templates(connection);
      Templates.check_package_token(packag,function(row){
        if(row){
          packag_name.push(row.name);
          credits=row.credits;
          if(!post.email){
            email_err = 'This value is required';
            success = false;
          }
          if(!post.password){
            pass_err = 'This value is required';
            success = false;
          }
          if(post.password.length < 5){
            pass_err = 'Password must be more than 5 characters length!';
            success = false;
          }
          if(!post.repeat_password){
            pass_err_repeat = 'This value is required';
            success = false;
          }
          if(post.repeat_password.length < 5){
            pass_err_repeat = 'Password must be more than 5 characters length!';
            success = false;
          }
          if(post.password != post.repeat_password){
            pass_err_repeat = 'Passwords are not the same.';
            success = false;
          }

          if(success){
            Users.validate_email_register(post,function(validation,email_err){
              if(validation){
                Users.create_new_user(post.email,post.password,credits,JSON.stringify(packag_name),function(succ,id){
                    if(succ){
                      return res.redirect('/auth/login');
                    }else{
                      res.render('signin',{
                        header:'none',
                        error:'error',
                        email_val:post.email,
                        pass_val:post.password,
                        pass_repeat_val:post.repeat_password
                      });
                    }
                })
              }else{
                res.render('signin',{
                  header:'none',
                  email_err:email_err,
                  error:false,
                  email_val:post.email,
                  pass_val:post.password,
                  pass_repeat_val:post.repeat_password
                });
              }
            })
          }else{
            res.render('signin',{
              header:'none',
              email_err:email_err,
              pass_err:pass_err,
              pass_err_repeat:pass_err_repeat,
              error:false,
              email_val:post.email,
              pass_val:post.password,
              pass_repeat_val:post.repeat_password
            });
          }
        }else{
          res.redirect('/');
        }
      })
    })
});






module.exports = router;
