var express = require('express'),
    moment=require('moment'),
    router = express.Router(),
    user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js');


/* GET users listing. */
router.get('/media', function(req, res, next) {
    res.render('library-media', { title: 'Media Library' });
});

router.get('/image', function(req, res, next) {
    res.render('library-image', { title: 'Image Library' });
});

module.exports = router;
