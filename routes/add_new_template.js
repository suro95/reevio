/**
 * Created by aleksa on 1/28/16.
 */
var express = require('express'),
    router = express.Router(),
    user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    video=require('../server/Class/Video/Video.js'),
    router = express.Router();



// router.get('/',user_validation, function(req, res, next) {
router.get('/', function(req, res, next) {

var data={
    "1":{
        "inputs":{
            "text1.1":{
                "max":20,
                "required":true,
                "style":"position:absolute;top: 48%;left: 28%;width: 25%;height: 5%;",
                "desc":"1 slide text 1",
                "type":"text",
                "text_style":"color:#000;",
                "value":"SOme text in google input"
            },



        },

        "video":false,
        "music":false,
        "length":"1.3",
        "background-color":true,
        "slide":"web-search/1.jpg",
        "cov":"web-search/cov1.jpg"
    },
    "2":{
        "inputs":{
            "text2.1":{
                "max":20,
                "required":true,
                "style":"position:absolute;top: 60%;left: 37%;width: 25%;height: 10%;",
                "desc":"1 slide text 1",
                "type":"text",
                "text_style":"color:#000;",
                "value":"TEXT 01"
            }
        },
        "images":{
            "image2.1":{
                "style":"",
                "position":"top:35%;left:32%;",
                "size":"width:35%;height:23%",
                "desc":"logo"
            }
        },
        "video":false,
        "music":false,
        "length":"1.3",
        "background-color":true,
        "slide":"web-search/2.jpg",
        "cov":"web-search/cov2.jpg"
    }
}


        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Template=new video_templates(connection,17);
            Template.update_template(4,data,function(valid){
                console.log(valid);
            });

            res.end(JSON.stringify({ fail: true }));


        })
    });




module.exports = router;
