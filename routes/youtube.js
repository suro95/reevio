/**
 * Created by Arevik 05.05.2016
 */
var express = require('express'),
    router = express.Router(),
    // user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    veeroll=require('../server/Class/Veeroll/Veeroll.js'),    
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
    graph = require('fbgraph'),
    allowed_image_types=['image/png','image/jpg','image/jpeg'],
    request = require('request'),
    // google = require('google-adwords'),
    router = express.Router();




router.post('/youtube-video-search', function(req,res,next){

    var youTubeData = [];

    var post = req.body;

    var YouTube = require('youtube-node');

    var youTube = new YouTube();

    youTube.addParam("type", post.type);

    if(post.sortorder){
        youTube.addParam("order", post.sortorder);
    }else{
        youTube.addParam("order", "relevance");
    }

    if(post.videoDuration){
        youTube.addParam("videoDuration", post.videoDuration);
    }
    // youTube.addParam("orderby", "relevance");

   youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

        youTube.search(post.keyword, 50, function(error, result) {
              if (error) {
                console.log(error);
              }
              else {
                if(post.type == "video"){

                    result.items.map(function(video){
                         youTube.getById(video.id.videoId, function(err, vid) {
                            if(err) {
                                console.log(err)
                            }
                            youTubeData.push(vid);
                            if(youTubeData.length == 50){
                                res.end(JSON.stringify({status: "success", result: result, "data": youTubeData}));
                            }
                        })
                    }
                 )
                }else{
                      result.items.map(function(video){
                        var url ='https://www.googleapis.com/youtube/v3/channels?type=channel&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';

                        url += "&part=snippet,contentDetails,statistics, status&q="+post.keyword+",&maxResults=50";

                        url += "&id=" + video.id.channelId;

                        request(url, function (error, response, body) {
                              if (!error && response.statusCode == 200) {
                                    youTubeData.push(JSON.parse(response.body));
                                if(youTubeData.length == 50){
                                    res.end(JSON.stringify({status: "success", result: result, "data": youTubeData}));
                                }
                              }
                        })
                      }
                    )
            }
        }
    });
})






router.get("", function(req, res, next){
    res.render("veeroll-dashboard.jade");
});

router.get("/my-videos", function(req, res, next){
    req.getConnection(function(err, connection){
       if(err){
        console.log(err);
       }else{
            var template = new veeroll(connection);

            var templ = template.getUserVideos(req.session.user.id,function(err,rows){
                if(err){
                    console.log(err);
                }else{
                    res.render("veeroll-myvideos.jade", {
                        "videos" : rows
                    });
                }
            });

       }
    });

});

router.get("/my-videos-grid", function(req, res, next){
    req.getConnection(function(err, connection){
       if(err){
        console.log(err);
       }else{
            var template = new veeroll(connection);

            var templ = template.getUsrVds(req.session.user.id,function(err,rows){
                if(err){
                    console.log(err);
                }else{
                    res.render("veeroll-myvideos-grid.jade", {
                        "videos" : rows
                    });
                }
            });

       }
    });

});
router.post("/video-load-more", function(req, res, next){
    if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            id = post.id;
            req.getConnection(function(err, connection) {
              if (err) return next(err);
                var template = new veeroll(connection);
                var user_id = req.session.user.id;
                var templ = template.getVideoLimit(user_id,id,20,function(err,rows){
                    if(err)throw err;
                    if(rows){

                      res.end(JSON.stringify({ success: true,data:rows }));

                    }else{

                      res.end(JSON.stringify({ success: false }));

                    }
                  })
            });
   } else res.status(404).send('Not found');
})

router.get("/create-video-ads", function(req, res, next){

    req.getConnection(function(err, connection){
       if(err){
        console.log(err);
       }else{
            var template = new veeroll(connection);

            var templ = template.getAllTemplates(function(err,rows){
                if(err){
                    console.log(err);
                }else{
                    res.render("veeroll-create-video-ads.jade", {
                        "templates" : rows
                    });
                }
            });

       }
    });
});

router.get("/video-search", function(req,res,next){
    res.render("veeroll-video-search.jade");
});

router.get("/related-video-search", function(req,res,next){
    res.render("veeroll-video-search.jade");
});

router.get("/video-search-history", function(req,res,next){
    res.render("veeroll-video-search-history.jade");
});

router.get("/channel-search", function(req,res,next){
    res.render("veeroll-channel-search.jade");
});

router.get("/channel-search-history", function(req,res,next){
    res.render("veeroll-channel-search-history.jade");
});

router.get("/video-groups", function(req,res,next){
    res.render("veeroll-video-groups.jade");
});

router.get("/search-targets", function(req,res,next){
    res.render("veeroll-search-targets.jade");
});

router.get("/channel-groups", function(req,res,next){
    res.render("veeroll-channel-groups.jade");
});

router.get("/placement-lists", function(req,res,next){
    res.render("veeroll-placement.jade");
});

router.get("/keyword-lists", function(req,res,next){
    res.render("veeroll-keywords.jade");
});

module.exports = router;