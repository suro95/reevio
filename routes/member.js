/**
 * Created by aleksa on 1/28/16.
 */
var express = require('express'),
    router = express.Router(),
    // user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    video=require('../server/Class/Video/Video.js'),
    project=require('../server/Class/Project.js'),
    moment=require('moment'),
    router_manager=require('../server/RouterManager/RouterManager.js'),
    users=require('./../server/Class/Users/Users.js'),
    route='membter',
    util = require('util'),
    express = require('express'),
    expressValidator = require('express-validator'),
    multer  = require('multer'),
    crypto  = require('crypto'),
    fs = require('fs'),
    Youtube = require("youtube-api"),
    ReadJson = require("r-json"),
    Opn = require("opn"),
    http = require('http'),
    graph = require('fbgraph'),
    allowed_image_types=['image/png','image/jpg','image/jpeg'],
    router = express.Router();
    storage = multer.diskStorage({
        destination: 'public/upload',
        filename: function (req, file, cb) {
              crypto.pseudoRandomBytes(16, function (err, raw) {

                var type= file.mimetype.split('/');
                type = type[type.length - 1];
                cb(null, raw.toString('hex') + Date.now() + '.' +type);
            });
        },

    }),
    upload = multer({ storage: storage });

const CREDENTIALS = ReadJson("./server/Api/Google/YouTube/credential.json");

var oauth = Youtube.authenticate({
        type: "oauth"
        , client_id: CREDENTIALS.web.client_id
        , client_secret: CREDENTIALS.web.client_secret
        , redirect_url: CREDENTIALS.web.redirect_uris[0]
    });



router.post('/youtube-video-search', function(req,res,next){
    var post = req.body;

    var YouTube = require('youtube-node');

    var youTube = new YouTube();

    youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');


        youTube.search(post.keyword, 10, function(error, result) {
              if (error) {
                console.log(error);
              }
              else {
                console.log(JSON.stringify(result, null, 2));
                res.end(JSON.stringify({status: "success", result: result}));
              }
        });
})

router.post('/youtube-upload-video', function(req, res, next) {
    var post = req.body;

    if(post.video_name !== undefined && post.video_name)
    {

        var data = {};
        data.video_name = post.video_name;
        data.video_title = (post.video_title !== undefined)?post.video_title:'';
        data.video_description = (post.video_description !== undefined)?post.video_description:'';
        data.video_type = (post.video_type !== undefined && post.video_type == '1')?'public':'private';

        var url = oauth.generateAuthUrl({
            access_type: "offline"
            , scope: ["https://www.googleapis.com/auth/youtube.upload"]
            , state: new Buffer(JSON.stringify(data)).toString('base64')
        });

        res.writeHead(301,
            {Location: url}
        );
    }else{
        res.redirect("/video-designs");
    }
    res.end();
});

router.get('/new-channel', function(req, res, next) {
    oauth = Youtube.authenticate({
        type: "oauth"
        , client_id: CREDENTIALS.web.client_id
        , client_secret: CREDENTIALS.web.client_secret
        , redirect_url: ["http://reevio.com/member/add_channel"]
    });
    var url = oauth.generateAuthUrl({
            access_type: "offline"
            , scope: ["https://www.googleapis.com/auth/plus.login"]
        });
        res.writeHead(301,
            {Location: url}
        );
    res.end();
});


router.get('/add_channel', function(req, res, next) {
    res.redirect("/youtube/my-videos");
});

router.get('/oauth2callback', function(req, res, next) {
    var lien = req.query,
        video_data = JSON.parse(new Buffer(lien.state, 'base64').toString());

        http.get(video_data.video_name, function (response) {

            oauth.getToken(lien.code, function(err, tokens) {
                if (err) {
                    req.session.youtube={
                        publis:'err'
                    }
                }
                oauth.setCredentials(tokens);
                Youtube.videos.insert({
                    resource: {
                        snippet: {
                            title: video_data.video_title
                            , description: video_data.video_description
                        }
                        , status: {
                            privacyStatus: video_data.video_type
                        }
                    }
                    , part: "snippet,status"
                    , media: {
                        // body: fs.createReadStream("public/videos/" + video_data.video_name)
                        body: response
                    }
                }, function (err, data) {
                    console.log(err)
                    if(err){
                        req.session.youtube={
                            publis:'err'
                        }
                    }else{
                        req.session.youtube={
                            publis:true
                        }
                    }
                    res.redirect("/users/my-videos");
                });
            });
        }).on('error', function(e) {
            req.session.youtube={
                publis:'err'
            };
            res.redirect("/users/my-videos");
        });
});

router.get('/fb-share-video/:video_name', function(req, res, next) {
    var get=req.params,
        authUrl = graph.getOauthUrl({
            "client_id":     '507341756125702'
            , "redirect_uri":  'http://localhost:3001/member/FbCallback/' + get.video_name
        });

    res.redirect(authUrl);
    res.end();
});

router.get('/FbCallback/:video_name', function(req, res, next) {
    var get=req.params;

    graph.authorize({
        "client_id":      '507341756125702'
        , "redirect_uri":   'http://localhost:3001/member/FbCallback/' + get.video_name
        , "client_secret":  'a687a2d85e59aca8b1ffa09ef62673bc'
        , "code":           req.query.code
    }, function (err, facebookRes) {
        if(err) res.redirect('/video-designs');

        graph.setAccessToken(facebookRes.access_token);
        var wallPost = {
            message: "I'm gonna come at you like a spider monkey, chip!"
        };
        graph.post("/feed", wallPost, function(err, res) {
            // returns the post id
        });

        res.redirect('/video-designs');
        res.end();
    });

});


module.exports = router;