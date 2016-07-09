var express = require('express');
var router = express.Router();







router.get('/new-project',user_validation, function(req, res, next) {
    res.render('new-project', { title: 'Welcome to express' });
});

router.post('/new-project',user_validation,upload.array('fileLogo',1),function(req, res, next){
    var post = req.body;
    var file = req.files;
    var fileName = '';
    if(file[0] !== undefined)
        fileName = file[0].filename;

    req.check('projectName','Project name is required').notEmpty();
    req.check('businessName','Business name is required').notEmpty();
    if(post.phone) {
        req.check('phone', 'Number is numeric').isInt();
    }
    req.check('street','Street is string').optional();
    req.check('city','City is string').optional();
    req.check('state','State is string').optional();
    if(post.websiteUrl){
        req.check('websiteUrl','Url is not correct').isValidUrl();
    }
    if(post.fbUrl){
        req.checkParams('fbUrl','Url is not correct').isValidUrl();
    }
    req.check('youtubeKey','Url is not correct').optional();
    req.check('vimeoKey','Url is not correct').optional();
    if(post.youtubeUrl){
        req.checkParams('youtubeUrl','Url is not correct').isValidUrl();
    }
    if(post.twitterUrl){
        req.checkParams('twitterUrl','Url is not correct').isValidUrl();
    }
    if(post.linkedinUrl){
        req.checkParams('linkedinUrl','Url is not correct').isValidUrl();
    }

    var errors = req.validationErrors(true);

    if(errors)
    {
        if(fs.existsSync('public/upload/' + fileName)) {
            fs.unlink('public/upload/' + fileName);
        }
        res.render('new-project', { title: 'Welcome to express', errors : errors });
    }else{
        var insertData = [
            post.projectName,
            post.businessName,
            post.phone,
            post.street,
            post.city,
            post.state,
            post.websiteUrl,
            post.fbUrl,
            post.youtubeKey,
            post.vimeoKey,
            post.youtubeUrl,
            post.twitterUrl,
            post.linkedinUrl,
            fileName,
            Date.now()
        ];
        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var sql = 'INSERT INTO projects ' +
                '(project_name,business_name,phone_number,street_address,city,' +
                'state,website_url,fb_url,youtube_api_key,vimeo_api_key,youtube_channel,' +
                'twitter_url,linkedin_url,file_name,date) ' +
                'VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';

            connection.query(sql,insertData,function(err, rows, fields){
                if (err) return next(err);
                res.render('new-project', { title: 'Welcome to express' });
            });
        });

    }

});






router.get('/project-view',user_validation, function(req, res, next) {

    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var Project=new project(connection,req.session.user.id);
        Project.get_user_projects(function(rows){
            res.render('project-view', { title: 'Welcome to express',data:rows });
        })

    })

});



router.get('/project-detail',user_validation, function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var project_user_id = req.session.user.id;
        var Projects=new project(connection,project_user_id);
        Projects.get_user_projects(function(rows) {
            if(!rows) {
                res.redirect("/member");
                return false;
            }

            var projects_data=rows;//JSON.parse(rows.json_data);

            res.render('project-detail', { title: 'Welcome to express', projects_data: projects_data });
        });
    });
});





module.exports = router;
