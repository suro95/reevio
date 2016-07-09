/**
 * Created by aleksa on 1/28/16.
 */
var express = require('express'),
    router = express.Router(),
    user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    video=require('../server/Class/Video/Video.js'),
    DataClay=require('../server/Api/dataclay/DataClay.js'),
    video_adapter=require('../server/Class/Video/VideoAdapter'),
    google=require('../server/Class/Google/Google.js'),
    fs = require("fs"),
    Promise=require("bluebird"),
    router = express.Router(),
    moment=require('moment'),
    fs = require('fs'),
    mime = require('mime'),
    path = require('path'),
    ffmpeg = require('ffmpeg'),
    fluent_ffmpeg = require('fluent-ffmpeg'),
    gm = require('gm'),
    http = require('http'),
    https = require('https'),
    request=require('request'),
    allowed_image_types=['image/png','image/jpg','image/jpeg'],
    allowed_music_types=['audio/mp3','audio/x-wav','audio/wav'],
    allowed_video_types = ["video/mp4","video/webm"],
    multer  = require('multer'),
    crypto  = require('crypto'),
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
    upload = multer({ storage: storage }),

    storage_music = multer.diskStorage({
    destination: 'public/mp3',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            var type= file.mimetype.split('/');
            type = type[type.length - 1];
            cb(null, raw.toString('hex') + Date.now() + '.' +type);
        });
    },

}),
    upload_music = multer({ storage: storage_music });

    storage_video = multer.diskStorage({
        destination: 'public/videos',
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                var type= file.mimetype.split('/');
                type = type[type.length - 1];
                cb(null, raw.toString('hex') + Date.now() + '.' +type);
            });
        },

    }),
    upload_video = multer({ storage: storage_video });

    storage_icon = multer.diskStorage({
        destination: 'public/icons',
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                var type= file.mimetype.split('/');
                type = type[type.length - 1];
                if(type == 'x-shockwave-flash')
                    type = 'swf';
                if(type == 'quicktime')
                    type = 'mov';
                cb(null, raw.toString('hex') + Date.now()+'.'+type);
            });
        },

    }),

    upload_icon = multer({ storage: storage_icon });






 router.get('/:template_id',user_validation, function(req, res, next) {
//router.get('/:template_id', function(req, res, next) {

    var get=req.params,
        template_id=get.template_id,
        template_data=[],
        templates_icons={};

    if(template_id&&template_id.isNumeric()) {
         //console.log('template id: '+template_id);
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Template=new video_templates(connection,template_id),
            //  vizeo = new video(connection,5,template_id);
            vizeo = new video(connection,req.session.user.id,template_id);


            Template.get_template_by_id(function(err,rows){
                if(err)res.status(500).send('server error');
                    try{
                        template_data=JSON.parse(rows.json_data);
                    }catch (e){
                        res.status(500).send('server error ! Template error');
                        return false;
                    }

                    //vizeo.insert_user_videos(template_data,function(UserVideosId,InsertedTempladeData){
                    //if(UserVideosId){
                        Template.get_music_all(function(music_row){
                            vizeo.get_user_all_images(20,0,function(images_rows){
                                vizeo.get_musics(function(musics){
                                    vizeo.user_videos(function(user_videos){
                                        vizeo.user_music(function(user_musics){
                                            if(rows.icon_groups){
                                                try{
                                                   templates_icons= JSON.parse(rows.icon_groups)
                                               }catch(e){
                                                    console.log(e);
                                                }
                                            }
                                          //  var templates_icons = rows.icon_groups!=''?JSON.parse(rows.icon_groups):JSON.parse('{}')
                                            Template.get_icon_group_templates(templates_icons,function(icon_groups){
                                                Template.get_user_icons(req.session.user.id,function(user_icons){
                                                    Template.get_all_categorys_slides(function(all_categorys_slides){
                                                        var template = 'video-editor-final-design-v3';
                                                        if(rows.type == 'static')
                                                            template = 'video-editor-final-design-v3-static';

                                                        //fluent_ffmpeg.ffprobe('public/templates'+rows.file_name, function(err, metadata) {
                                                        //    if (err) return next(err);

                                                            res.render(template,
                                                                {
                                                                    template_data:template_data,
                                                                    template_data_rigth:template_data,// ????? This should be changed when the right slide data are ready.
                                                                    video:rows.file_name ,
                                                                    cover_photo:rows.cover_photo,
                                                                    template_name:rows.name,
                                                                    template_id:rows.id,
                                                                    user_images:images_rows,
                                                                    musics:musics,
                                                                    user_musics:user_musics,
                                                                    user_videos:user_videos,
                                                                    InsertedTempladeData:'',
                                                                    UserVideosId:'',
                                                                    icon_groups:icon_groups,
                                                                    user_icons:user_icons,
                                                                    max_duration:rows.max_duration,
                                                                    graphic:rows.graphic,
                                                                    music:rows.music,
                                                                    user:JSON.stringify(req.session.user),
                                                                    all_categorys_slides:all_categorys_slides
                                                                   // InsertedTempladeData:InsertedTempladeData,
                                                                  //  UserVideosId:UserVideosId

                                                            });
                                                        });
                                                    // });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    //}else  res.redirect('/');
                //});
            });
        })
    }
    else  res.redirect('/');

});


router.get('/editor/:id',user_validation, function(req, res, next) {
// router.get('/:template_id', function(req, res, next) {

    var get=req.params,
        template_id=false,
        id=get.id,
        template_data=[];

    if(id&&id.isNumeric()) {
        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var vizeo1 = new video(connection,req.session.user.id,template_id);
            vizeo1.get_user_project_videos(id,function(row){
                template_id = row.template_id;
                var Template=new video_templates(connection,template_id);
                var vizeo = new video(connection,req.session.user.id,template_id);

                Template.get_template_by_id(function(err,rows){
                    if(err)res.status(500).send('server error');
                    Template.get_music_all(function(music_row){
                        try{
                            template_data=JSON.parse(rows.json_data);
                        }catch (e){
                            res.status(500).send('server error ! Template error');
                            return false;
                        }
                        vizeo.get_user_all_images(10,0,function(images_rows){
                            vizeo.get_musics(function(musics){
                                vizeo.user_videos(function(user_videos){
                                    vizeo.user_music(function(user_musics){
                                        var templates_icons = rows.icon_groups!=''?JSON.parse(rows.icon_groups):JSON.parse('{}');
                                        Template.get_icon_group_templates(templates_icons,function(icon_groups){
                                            Template.get_user_icons(req.session.user.id,function(user_icons){
                                                Template.get_all_categorys_slides(function(all_categorys_slides){
                                                var template = 'video-editor-final-design-v3-edit';
                                                if(rows.type == 'static')
                                                    template = 'video-editor-final-design-v3-edit-static';

                                                    //fluent_ffmpeg.ffprobe('public/templates'+rows.file_name, function(err, metadata) {
                                                    //if (err) return next(err);
                                                        res.render(template,
                                                        {
                                                                template_data:template_data,
                                                                template_data_rigth:template_data,// ????? This should be changed when the right slide data are ready.
                                                                video:rows.file_name ,
                                                                cover_photo:rows.cover_photo,
                                                                template_name:rows.name,
                                                                template_id:rows.id,
                                                                video_name:(row.video_name) ? row.video_name : rows.name,
                                                                user_images:images_rows,
                                                                musics:musics,
                                                                user_musics:user_musics,
                                                                user_videos:user_videos,
                                                                InsertedTempladeData:JSON.parse(row.json_data),
                                                                UserVideosId:id,
                                                                icon_groups:icon_groups,
                                                                max_duration:rows.max_duration,
                                                                user_icons:user_icons,
                                                                graphic:rows.graphic,
                                                                music:rows.music,
                                                                user:JSON.stringify(req.session.user),
                                                                all_categorys_slides:all_categorys_slides
                                                        });
                                                    // });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    else res.redirect('/users/my-videos');

});

//ajax image upload , validation is not good, need to fix
router.post('/slider-cropped-upload',user_validation,upload.any(), function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            domain=req.protocol + '://' + req.get('host');
            console.log(post.template_id);
        if(req.body.image == undefined){
            res.end(JSON.stringify({ fail: true }));
        }

        req.getConnection(function(err, connection) {
            var vizeo = new video(connection,req.session.user.id,post.template_id);
            crypto.pseudoRandomBytes(16, function (err, raw) {
                if(err) {
                    res.end(JSON.stringify({ fail: true }));
                }

                var image_data = vizeo.Base64Image(req.body.image),
                    file_name = raw.toString('hex') + Date.now() + '.png';

                if(allowed_image_types.indexOf(image_data.type)<0||!('image' in post)){
                    res.end(JSON.stringify({ fail: true }));
                    return false;
                }
                var file_path = "public/upload/"+file_name;
                fs.writeFile(file_path, image_data.data, 'base64', function(err) {

                    if(err){
                        res.end(JSON.stringify({ fail: true }));
                    }

                    crypto.pseudoRandomBytes(16, function (err, raw) {
                        if(err) {
                            res.end(JSON.stringify({ fail: true }));
                        }

                        var file_name_cov = raw.toString('hex') + Date.now() + '.jpeg',
                            cover_image = "public/upload/"+file_name_cov,
                            imageMagick = gm.subClass({ imageMagick: true }),
                            stream = fs.createReadStream(file_path).pipe(fs.createWriteStream(cover_image));

                        stream.on('finish',function(){

                            imageMagick(file_path)
                            .resize(150)
                            .autoOrient()
                            .write(cover_image, function(err){
                                if(err){
                                    res.end(JSON.stringify({ fail: true }));
                                }

                                // vizeo.save_user_images(file_name,file_path.replace('public',''),cover_image.replace('public',''),function(row){
                                    // res.end(JSON.stringify({success: true,name:file_name,path:file_path.replace('public',''),cover_image:cover_image.replace('public',''),id:row}));
                                    res.end(JSON.stringify({success: true,name:file_name,path:domain+'/upload/'+file_name,cover_image:domain+cover_image.replace('public',''),/*id:row,*/slide_id:post.slide_id,img_id:post.img_id,value:domain+'/upload/'+file_name}));
                                    return true;
                                // })
                            });
                        })
                    });
                });
            });
        });

    }else{
        res.status(404).send('Not found');
    }



});
//ajax image upload
router.post('/slider-origin-upload',user_validation,upload.any(), function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files[0],
            imageMagick = gm.subClass({ imageMagick: true }),
            post = req.body;
            music_type = mime.lookup(file.filename),
            file_type = path.extname(file.filename);

        if(!file.fieldname||!post.template_id)return res.end(JSON.stringify({fail: true}));

        //mimetype
        var allowed_types = ["image/jpeg", "image/png", "image/bmp"];
        var valid = allowed_types.indexOf(file.mimetype);

        if(valid == -1){
            return res.end(JSON.stringify({fail: true, "reason": "Wrong image type"}));
        }

        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,req.session.user.id,post.template_id),
                file_path = file.path.replace(/\\/g,'/').replace('public','');

            crypto.pseudoRandomBytes(16, function (err, raw) {
                if(err) {
                    res.end(JSON.stringify({ fail: 'crypto fail' }));
                }

                var file_name = raw.toString('hex') + Date.now() + file_type,
                    cover_image = "public/upload/"+file_name,
                    stream = fs.createReadStream(file.destination+"/"+file.filename).pipe(fs.createWriteStream(cover_image));

                stream.on('finish',function(){

                    imageMagick(file.destination+"/"+file.filename)
                    .resize(150)
                    .autoOrient()
                    .write(cover_image, function(err){
                       // throw err;
                        if(err){
                            res.end(JSON.stringify({ fail: 'cover fail'}));
                        }

                        vizeo.save_user_images(file.filename,file_path,cover_image.replace('public',''),function(row){
                            res.end(JSON.stringify({success: true,name:file.filename,path:file_path,cover_image:cover_image.replace('public',''),id:row}));
                            return true;
                        })
                    });
                })
            });
        });
    }else{
        res.status(404).send('Not found');
    }
});

//ajax voice upload
router.post('/voice-upload',user_validation,upload_music.any(), function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files[0],
            post = req.body;

        if(typeof file == 'undefined' || typeof post.template_id == 'undefined' || !post.template_id) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,req.session.user.id,post.template_id),
                file_path = file.path.replace(/\\/g,'/').replace('public','');

            vizeo.save_user_voices(file.filename,file_path,function(row){
                res.end(JSON.stringify({success: true,slide_id:post.slide_id,voice_id:post.voice_id,name:file.filename,path:file_path}));
                return true;
            })
        });
    }else{
        res.status(404).send('Not found');
    }



});

router.post('/user-images',user_validation, function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            page = post.page;

        if(typeof post.page == 'undefined' || !post.page) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,req.session.user.id);

            vizeo.get_user_all_images(20,page*20,function(rows){
                res.end(JSON.stringify({success: true,images:rows}));
                return true;
            })
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/dropzon-upload-music',user_validation,upload_music.any(), function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files[0],
            post = req.body,
            original_file_name = file.originalname;

        if(typeof file == 'undefined' || typeof post.template_id == 'undefined' || !post.template_id) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,req.session.user.id,post.template_id),
                file_path = file.path.replace(/\\/g,'/').replace('public','');

            vizeo.save_user_music(file.filename,file_path,original_file_name,function(row){
                res.end(JSON.stringify({success: true,slide_id:post.slide_id,voice_id:post.voice_id,name:file.filename,path:file_path,original_name:original_file_name}));
                return true;
            })
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/youzing', function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        request.post({url:'https://www.youzign.com/api/designs', form: {
            // "page": Math.floor(Math.random() * (20 - 1) + 1),
            "page": 1,
            "per_page": 50,
            "key": "5077d4ed60da38255c2c71421ddac36f",
            "token": "55f772fcdae50ce0caee3986112621a3"
        }}, function(err,httpResponse,body){
            res.end(body);
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/photofinish', function(req, res, next) {
    if(req.xhr){
        var post = req.body,
            PHOTOFINISH_API_KEY = '$2y$10$kaPTpxH7v.w.SBtisg/KruYAqiVTcIYAqPgR6QtxAwVaAOvNff5RK',
            PHOTOFINISH_SECRET_KEY = '$2y$10$m6ceOhyl7KHG7l63SrrtBe9wSuBi2OwyfyXoHnuNBMnYecRuvcGhi',
            url = 'http://photofinish.co/api/photos/search?api_key='+PHOTOFINISH_API_KEY+'&secret_key='+PHOTOFINISH_SECRET_KEY+'&search_string='+post.kw+'&page='+post.page+'&per_page=50&folder_id='+post.folder_id;

        res.setHeader('Content-Type', 'application/json');
        request.get({url:url}, function(err,httpResponse,body){
            res.end(body);
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/photofinishCategory', function(req, res, next) {
    if(req.xhr){
        var post = req.body,
            PHOTOFINISH_API_KEY = '$2y$10$kaPTpxH7v.w.SBtisg/KruYAqiVTcIYAqPgR6QtxAwVaAOvNff5RK',
            PHOTOFINISH_SECRET_KEY = '$2y$10$m6ceOhyl7KHG7l63SrrtBe9wSuBi2OwyfyXoHnuNBMnYecRuvcGhi',
            url = 'http://photofinish.co/api/folders?api_key='+PHOTOFINISH_API_KEY+'&secret_key='+PHOTOFINISH_SECRET_KEY+'&search_string='+post.kw+'&page='+post.page+'&per_page=50';

        res.setHeader('Content-Type', 'application/json');
        request.get({url:url}, function(err,httpResponse,body){
            res.end(body);
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/videocloudsuite', function(req, res, next) {
    if(req.xhr){
        var post = req.body,
            VIDEOCLOUDSUITE_API_KEY = '$2y$10$33zV9oZgpnmKd6u/VpVg9e1qPUi36.DSFavdu0ziMDTt9puGwL9/G',
            VIDEOCLOUDSUITE_SECRET_KEY = '$2y$10$YsXvYoEXprMBPogmI0xZauUkYP3EYg4k8h90d2qLJVxow0qxToCla',
            url = 'http://videocloudsuite.com/api/videos/search?api_key='+VIDEOCLOUDSUITE_API_KEY+'&secret_key='+VIDEOCLOUDSUITE_SECRET_KEY+'&search_string='+post.kw+'&page='+post.page+'&per_page=20&order=desc&folder_id='+post.categories;
        request.get({url:url}, function(err,httpResponse,body){
            res.end(body);
        });
    }else{
        res.status(404).send('Not found');
    }

});

router.post('/videocloudsuite-category', function(req, res, next) {
    if(req.xhr){
        var post = req.body,
            url = 'http://videocloudsuite.com/api/folders?api_key=$2y$10$33zV9oZgpnmKd6u/VpVg9e1qPUi36.DSFavdu0ziMDTt9puGwL9/G&secret_key=$2y$10$YsXvYoEXprMBPogmI0xZauUkYP3EYg4k8h90d2qLJVxow0qxToCla';
        request.get({url:url}, function(err,httpResponse,body){
            res.end(body);
        });
    }else{
        res.status(404).send('Not found');
    }

});


router.post('/pixabay', function(req, res, next) {
    if(req.xhr){
        var post = req.body,
            url = "https://pixabay.com/api/videos/?key=1026292-59296bc45312c991bda7e77ad&q="+encodeURIComponent(post.kw)+"&per_page=30"+"&page="+post.page+'&category='+post.categories;
        request.get({url:url}, function(err,httpResponse,body){
            res.end(body);
        });
    }else{
        res.status(404).send('Not found');
    }

});

router.post('/upload-img', function(req, res, next) {
    var params = req.body,
        fileToDownload = params.img_url,
        httpPatern = /^((http):\/\/)/i,
        httpsPatern = /^((https):\/\/)/i,
        protocol = http,
        template_id = params.template_id;

    res.setHeader('Content-Type', 'application/json');

    if(fileToDownload == undefined || template_id == undefined) {
        res.end(JSON.stringify({fail: true}));
        return false;
    }

    req.getConnection(function(err, connection) {
        if(err) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                res.end(JSON.stringify({fail: true}));
                return false;
            }

            if (httpPatern.test(fileToDownload)) {
                protocol = http;
            } else if (httpsPatern.test(fileToDownload)) {
                protocol = https;
            } else {
                res.end(JSON.stringify({fail: true}));
                return false;
            }

            protocol.get(fileToDownload, function (response) {
                var file_name = raw.toString('hex') + Date.now() + '.jpeg',
                    file_path = 'public/upload/' + file_name,
                    vizeo = new video(connection,req.session.user.id, template_id),
                    imageMagick = gm.subClass({ imageMagick: true });

                // if (allowed_image_types.indexOf(response.headers['content-type']) < 0 ) {
                //     res.end(JSON.stringify({fail: true}));
                //     return false;
                // }

                var body = '';
                response.on('data', function(d) {
                    body += d;
                });

                var file = fs.createWriteStream(file_path);
                response.pipe(file);

                response.on('end', function() {

                    crypto.pseudoRandomBytes(16, function (err, raw) {
                        if(err) {
                            res.end(JSON.stringify({ fail: true }));
                        }

                        var file_name = raw.toString('hex') + Date.now() + '.jpeg',
                            cover_image = "public/upload/"+file_name,
                            stream = fs.createReadStream(file_path).pipe(fs.createWriteStream(cover_image));

                        stream.on('finish',function(){

                            imageMagick(file_path)
                            .resize(150)
                            .autoOrient()
                            .write(cover_image, function(err){
                                if(err){
                                    res.end(JSON.stringify({ fail: true }));
                                }

                                vizeo.save_user_images(file_name,file_path.replace('public',''),cover_image.replace('public',''),function(row){
                                    res.end(JSON.stringify({success: true,name:file_name,path:file_path.replace('public',''),cover_image:cover_image.replace('public',''),id:row}));
                                    return true;
                                })
                            });
                        })
                    });
                });
            });
        });
    });
});

//ajax , save template data, validaton need to implement
router.post('/save-template-data', function(req, res, next) {
    if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            VideoAdapter=Object.create(video_adapter);
        req.getConnection(function (err, connection) {
            if (err) throw(err);
            VideoAdapter.init(connection, post, req.session.user.id)
                .then(VideoAdapter.video_templates_get_by_id)
                .then(VideoAdapter.check_user_packages_with_template)
                .then(VideoAdapter.validate_user_data)
                .then(VideoAdapter.check_user_credits)
                .then(VideoAdapter.save_user_video)
                .then(VideoAdapter.charge)
                .then(function(obj){console.log('pass here')
                    var inserted_id=obj.inserted_id,
                        template_data=obj.rows;
                    return new Promise(function(resolve,reject){
                        var Clay=Object.create(DataClay);
                        Clay.init(connection,inserted_id,template_data)
                            .then(Clay.get_user_template)
                           // .then(Clay.validate_data)
                         //   .then(Clay.sheets_add_row)
                            .then(Clay.format_data)
                            .then(Clay.call_api)
                            .then(function(result){
                               if(result=='success')return resolve(true)
                                return reject(result);
                            })
                            .catch(function(err){
                                throw(err);
                                reject(err)
                            })

                    })
                })
                .then(function (){
                    console.log('finally')
                    res.end(JSON.stringify({success:true}))
                })
                .catch(function(err){

                   if("validation" in err){
                       res.end(JSON.stringify({fail: "The validation isn't ok"}))
                    }

                    // throw(err);
                    // res.end(JSON.stringify({fail: err}))
                })



        })
    } else res.status(404).send('Not found');
})

router.post('/update-template-data', function(req, res, next) {
    if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            VideoAdapter=Object.create(video_adapter);
        // console.log(post);
        req.getConnection(function (err, connection) {
            if (err) throw(err);
            VideoAdapter.init(connection, post, req.session.user.id, req.packages)
                .then(VideoAdapter.video_templates_get_by_id)
                .then(VideoAdapter.check_user_packages_with_template)
                .then(VideoAdapter.validate_user_data)
                .then(VideoAdapter.check_user_credits)
                .then(VideoAdapter.update_user_video)
                .then(VideoAdapter.charge)
                .then(function(obj){
                    var update_id=post.id,
                        template_data=obj.rows;
                    return new Promise(function(resolve,reject){
                        var Clay=Object.create(DataClay);
                        Clay.init(connection,update_id,template_data)
                            .then(Clay.get_user_template)
                           // .then(Clay.validate_data)
                         //   .then(Clay.sheets_add_row)
                            .then(Clay.format_data)
                            .then(Clay.call_api)
                            .then(function(result){
                               if(result=='success')return resolve(true)
                                return reject(result);
                            })
                            .catch(function(err){
                                throw(err);
                                reject(err)
                            })

                    })
                })
                .then(function (){
                    console.log('finally')
                    res.end(JSON.stringify({success:true}))
                })
                .catch(function(err){

                   if("validation" in err){
                       res.end(JSON.stringify({fail: err.validation}))
                    }

                    // throw(err);
                    // res.end(JSON.stringify({fail: err}))
                })



        })
    } else res.status(404).send('Not found');
})

router.post('/insert-user-video', function(req, res, next) {
    if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            VideoAdapter=Object.create(video_adapter);
        req.getConnection(function (err, connection) {
            if (err) throw(err);
            VideoAdapter.init(connection, post, req.session.user.id)
                .then(VideoAdapter.save_user_video)
                .then(function(obj){
                    res.end(JSON.stringify({success:true,UserVideosId:obj.inserted_id}));
                })
                .catch(function(err){
                    res.end(JSON.stringify({fail: true}))
                })
        })
    }else res.status(404).send('Not found');
});

router.post('/get_category', function(req, res, next) {
    if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            category_id = post.category_id;

        req.getConnection(function (err, connection) {
            if (err) throw(err);

            var videoTemplate = new video_templates(connection);

            videoTemplate.get_categorys_templates(category_id,function(row){
                res.end(JSON.stringify({success:true,category:row}));
            })
        })
    }else res.status(404).send('Not found');
});

router.post('/update-user-video', function(req, res, next) {
    if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            VideoAdapter=Object.create(video_adapter);
        req.getConnection(function (err, connection) {
            if (err) throw(err);
            VideoAdapter.init(connection, post, req.session.user.id)
                .then(VideoAdapter.update_user_video)
                .then(function(obj){
                    res.end(JSON.stringify({success:true}));
                })
                .catch(function(err){
                    res.end(JSON.stringify({fail: true}))
                })
        })
    }else res.status(404).send('Not found');
});

//ajax music upload
router.post('/music-upload',upload_music.any(), function(req, res, next) {
    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
    }
});

router.post('/video-trim', function(req, res, next) {
    if(req.xhr) {
        var post = req.body;

        if(allowed_video_types.indexOf(post.type)<0){
            res.end(JSON.stringify({ success: false }));
            return false;
        }

        fs.writeFile("public/videos/upload.mp4", post.src, 'base64', function(err) {
            if(err){
                res.end(JSON.stringify({ success: false }));
            }

            crypto.pseudoRandomBytes(16, function (err, raw) {
                var file_name = raw.toString('hex') + Date.now() + '.mp4';

                fluent_ffmpeg('public/videos/upload.mp4')
                    .setStartTime(post.start_time)
                    .setDuration(post.duration)
                    .output('public/videos/'+file_name)
                    .on('end', function(err) {
                        if(!err){
                          fs.unlink('public/videos/upload.mp4');
                          var url = 'public/videos/'+file_name;
                          res.end(JSON.stringify({ success: true,url:url}));
                        }
                })
                .on('error', function(err){
                    console.log('error: ', +err);
                }).run();
            });
        });
    }else{
        res.end(JSON.stringify({ success: false }));
    }
});

router.post('/music-trim', function(req, res, next) {
    if(req.xhr) {
        var post = req.body,
            music_type = mime.lookup(post.src),
            file_type = path.extname(post.src);

      //  console.log(post)
       // console.log(mime.lookup(post.src))
        if(allowed_music_types.indexOf(music_type)<0){
            res.end(JSON.stringify({ success: false }));
            return false;
        }


        res.end(JSON.stringify({ success: true,url:post.src}));

        /*
        crypto.pseudoRandomBytes(16, function (err, raw) {
            var file_name = raw.toString('hex') + Date.now() + file_type;




            fluent_ffmpeg('public'+post.src)
            .setStartTime(post.start_time)
            .setDuration(post.duration)
            .output('public/mp3/'+file_name)
            .on('end', function(err) {
                if(err) throw(err);

                var url = 'public/mp3/'+file_name;
                res.end(JSON.stringify({ success: true,url:url}));
            })
            .on('error', function(err){
                console.log('error: ', +err);
            }).run();
        });
        */

    }else{
        res.end(JSON.stringify({ success: false }));
    }
});

router.post('/silde-data-upload',user_validation, function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if(typeof post.template_id == 'undefined' || !post.template_id
            || typeof post.slide_id == 'undefined' || !post.slide_id
            || typeof post.templateData == 'undefined' || !post.templateData) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,req.session.user.id,post.template_id);

            vizeo.update_silde_data(post.slide_id,post.templateData,function(row){
                if(row){
                    res.end(JSON.stringify({success: true}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            })
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/silde-all-data-update',user_validation, function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if(typeof post.template_id == 'undefined' || !post.template_id
            || typeof post.templateData == 'undefined' || !post.templateData
           || typeof post.UserVideosId == 'undefined' || !post.UserVideosId
            ) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,req.session.user.id,post.template_id);

            vizeo.update_silde_all_data(post.templateData,post.UserVideosId,function(result){
                if(result){
                    res.end(JSON.stringify({success: true}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            })
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/dropzon-upload-video',user_validation,upload_video.any(), function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files[0],
            post = req.body,
            user_id = req.session.user.id;
        if(typeof file == 'undefined' || typeof post.template_id == 'undefined' || !post.template_id) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,user_id,post.template_id),
                file_path = file.path.replace(/\\/g,'/').replace('public','');
                vizeo.save_user_videos(file.filename, file_path, function (row) {
                    res.end(JSON.stringify({success:true,url:file_path.replace('public',''),id:row.insertId}));
                    return true;
                });
        });
    }else{
        res.status(404).send('Not found');
    }
});


router.post('/delete-user-images',user_validation, function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            id = post.id,
            url = post.url,
            user_id = req.session.user.id;

        if(typeof id == 'undefined' || typeof url == 'undefined') {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,user_id,false);
                vizeo.delete_user_images(id, function (row) {
                    if(row){
                        fs.unlink('public'+url,function(){
                            res.end(JSON.stringify({success:true}));
                            return true;
                        });

                    }else{
                        res.end(JSON.stringify({fail: true}));
                        return false;
                    }
                });
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/get_icons',user_validation, function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            id = post.id;

        if(typeof id == 'undefined') {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var Templates = new video_templates(connection);
            if(id > 0){
                Templates.get_icon_group(id,function(rows){
                    if(rows){
                        res.end(JSON.stringify({success:true,data:rows}));
                    }else{
                        res.end(JSON.stringify({fail:true}));
                    }
                })
            }else if(id == 0){
                Templates.get_user_icons(req.session.user.id,function(rows){
                    if(rows){
                        res.end(JSON.stringify({success:true,data:rows}));
                    }else{
                        res.end(JSON.stringify({fail:true}));
                    }
                });
            }else{
                res.end(JSON.stringify({fail:true}));
            }
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/upload-icon',user_validation,upload_icon.any(),function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files[0],
            post = req.body,
            user_id = req.session.user.id;

            if(typeof file == 'undefined') {
                res.end(JSON.stringify({fail: true}));
                return false;
            }

            var type= file.mimetype.split('/');
            type = type[type.length - 1];

            var success = true;

            if(type == 'x-shockwave-flash')
                type = 'embed';
            else if(type == 'quicktime')
                type = 'video';
            else if(type == 'png' || type == 'jpeg' || type == 'jpg')
                type = 'img';
            else
                success = false;

            if(success == true){
                req.getConnection(function(err, connection) {
                    if (err) throw(err);

                    var Templates = new video_templates(connection);
                        file_path = file.path.replace(/\\/g,'/').replace('public','');
                        Templates.insert_user_icon(user_id, file_path,type,function (insertId) {
                            res.end(JSON.stringify({success:true,url:file_path,id:insertId,type:type}));
                            return true;
                        });
                });
            }else{
                fs.unlink(file[i].path);
                res.end(JSON.stringify({fail: true}));
            }
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/upload-blob',user_validation,upload.any(),function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            template_id = post.template_id,
            file = req.files[0];

        req.getConnection(function(err, connection) {
            if(err) {
                res.end(JSON.stringify({fail: true}));
                return false;
            }
            var file_name = file.filename,
                file_path = 'public/upload/' + file_name,
                vizeo = new video(connection,req.session.user.id, template_id),
                imageMagick = gm.subClass({ imageMagick: true });



            crypto.pseudoRandomBytes(16, function (err, raw) {
                if(err) {
                    res.end(JSON.stringify({ fail: true }));
                }

                var file_name = raw.toString('hex') + Date.now() + '.jpeg',
                    cover_image = "public/upload/"+file_name,
                    stream = fs.createReadStream(file_path).pipe(fs.createWriteStream(cover_image));

                stream.on('finish',function(){

                    imageMagick(file_path)
                    .resize(150)
                    .autoOrient()
                    .write(cover_image, function(err){
                        if(err){
                            res.end(JSON.stringify({ fail: true }));
                        }

                        // vizeo.save_user_images(file_name,file_path.replace('public',''),cover_image.replace('public',''),function(row){
                            res.end(JSON.stringify({success: true,name:file_name,path:file_path.replace('public',''),cover_image:cover_image.replace('public','')/*,id:row*/}));
                            return true;
                        // })
                    });
                })
            });
        });
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/delete-user-upload-video',user_validation, function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            id = post.id,
            url = post.url,
            user_id = req.session.user.id;

        if(typeof id == 'undefined' || typeof url == 'undefined') {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            if (err) throw(err);

            var vizeo = new video(connection,user_id,false);
                vizeo.delete_user_upload_video(id, function (row) {
                    if(row){
                        fs.unlink('public'+url,function(){
                            res.end(JSON.stringify({success:true,id:id}));
                            return true;
                        });

                    }else{
                        res.end(JSON.stringify({fail: true}));
                        return false;
                    }
                });
        });
    }else{
        res.status(404).send('Not found');
    }
});
module.exports = router;
