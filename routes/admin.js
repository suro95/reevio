/**
 * Created by aleksa on 2/13/16.
 */
var express = require('express'),
	router = express.Router(),
    user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    users=require('../server/Class/Users/Users.js'),
    video_templates=require('../server/Class/Video/VideoTemplates.js'),
    allowed_videos_types=['video/mp4'],
    multer  = require('multer'),
    crypto  = require('crypto'),
    path = require('path'),
    fs = require('fs'),
    EasyZip = require('easy-zip').EasyZip,
    mime = require('mime'),
    Excel = require("exceljs"),
    unzip = require('unzip'),
    storage_videos = multer.diskStorage({
	    destination: 'public/videos',
	    filename: function (req, file, cb) {
	        crypto.pseudoRandomBytes(16, function (err, raw) {
	            var type= file.mimetype.split('/');
	            type = type[type.length - 1];
	            cb(null, raw.toString('hex') + Date.now() + '.' +type);
	        });
	    },

	}),
    upload_videos = multer({ storage: storage_videos }),

    storage = multer.diskStorage({
        destination: 'public/templates',
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                var type= file.mimetype.split('/');
                type = type[type.length - 1];
                cb(null, raw.toString('hex') + Date.now() + '.' +type);
            });
        },

    }),
    upload = multer({ storage: storage }),

    storage_logos = multer.diskStorage({
        destination: 'public/logos',
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                var type= file.mimetype.split('/');
                type = type[type.length - 1];
                cb(null, raw.toString('hex') + Date.now() + '.' +type);
            });
        },

    }),
    upload_logos = multer({ storage: storage_logos }),

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
                cb(null, raw.toString('hex') + Date.now() +'.'+type);
            });
        },

    }),
    upload_icon = multer({ storage: storage_icon }),

    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
	options = {
	    service: '',
	    auth: {
	        user: '',
	        pass: ''
	    }
	  },
	  transporter = nodemailer.createTransport(smtpTransport(options));


 router.get('/',user_validation, function(req, res, next) {
//router.get('/', function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var Users = new users(connection);
           Users.get_user_data(req.session.user.id,function(user_data){
        // Users.get_user_data(5,function(user_data){
				if(user_data.admin == 1){
					var Template=new video_templates(connection);
						Template.get_all_pending_videos(function(rows){
							res.render('admin',
									{
										video_all:rows,
									});
						});
				}else{
					res.redirect("/");
				}
		    });
	});

});

 router.get('/create-template',user_validation, function(req, res, next) {
//router.get('/create-template', function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    req.getConnection(function (err, connection) {
        if (err) return next(err);
        var Template = new video_templates(connection);
            Template.templates_category_all(function(rows){
                Template.plans_all(function(plans){
                    Template.get_icon_group_all(function(icon_group){
                        Template.get_all_categorys_slides(function(all_categorys_slides) {
                            res.render('create-template-new',{
                                category_all:rows,
                                plans_all:plans,
                                icon_groups:icon_group,
                                template_icons:'{}',
                                all_categorys_slides:all_categorys_slides == false ? all_categorys_slides : JSON.stringify(all_categorys_slides)
                            });
                        });
                    });
                })
            })
    });
});


router.get('/edit-template/:template_id/:page?',user_validation, function(req, res, next) {
 // router.get('/edit-template/:template_id', function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    var get = req.params,
        template_id = get.template_id,
        template_data = [];
    if (template_id && template_id.isNumeric()) {
        //console.log('template id: '+template_id);
        req.getConnection(function (err, connection) {
            if (err) return next(err);
            var Template = new video_templates(connection, template_id);
            Template.templates_category_all(function(category_all){
                Template.plans_all(function(plans_all){
                    Template.get_all_categorys_slides(function(all_categorys_slides) {
                        Template.get_template_by_id(function (err, rows) {
                            if (err)res.status(500).send('server error');
                            try {
                                template_data = JSON.parse(rows.json_data);
                            } catch (e) {
                                res.status(500).send('server error ! Template error');
                                return false;
                            }

                            var folder = rows.folder;

                            if(!folder){
                                folder = '/'+rows.cover_photo.split('/')[1];
                            }

                            try {
                                var template_category =  JSON.parse(rows.templates_category_id);
                            } catch (e) {
                                var template_category =  '';
                            }
                            if(template_category == ''){
                                template_category = '[]';
                            }else if(parseInt(template_category) > 0){
                                template_category = '['+template_category+']';
                            }

                            try {
                                var template_plan = JSON.parse(rows.plans_id);
                            } catch (e) {
                                var template_plan = '';
                            }
                            if(template_plan == ''){
                                template_plan = '[]';
                            }else if(parseInt(template_plan) > 0){
                                template_plan = '['+template_plan+']';
                            }
                            var page = false;
                            if(get.page && get.page.isNumeric()) {
                                page = get.page;
                            }

                            Template.get_icon_group_all(function(icon_group){
                                res.render('edit-template', {
                                    template_data: template_data,
                                    name: rows.name,
                                    category: template_category,
                                    type: rows.type,
                                    aep: rows.aep,
                                    target: rows.target,
                                    description: rows.description,
                                    keyword: rows.keyword,
                                    notes: rows.notes,
                                    file_name: rows.file_name,
                                    cover_photo: rows.cover_photo,
                                    aep_file: rows.aep_file,
                                    template_id:rows.id,
                                    max_duration:rows.max_duration,
                                    folder:folder,
                                    plans_id:template_plan,
                                    category_all:category_all,
                                    plans_all:plans_all,
                                    price:rows.price,
                                    music:rows.music,
                                    icon_groups:icon_group,
                                    template_icons:rows.icon_groups!=''?rows.icon_groups:'{}',
                                    graphic:rows.graphic,
                                    page:page,
                                    all_categorys_slides:all_categorys_slides == false ? all_categorys_slides : JSON.stringify(all_categorys_slides)
                                });
                            });
                        });
                    });
                });
            });
        });
    }
})
 router.get('/download-aep-icon/:template_id',user_validation, function(req, res, next) {
//router.get('/download-aep-zip/:template_id', function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    var get=req.params,
        template_id=get.template_id,
        zip = new EasyZip();

    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var Template=new video_templates(connection,template_id);

        Template.get_template_by_id(function(err,rows){
            var folder_name = rows.file_name.split('/')[1];

            zip.zipFolder('public/templates/'+folder_name+'/aep',function(){
                zip.writeToResponse(res,'attachment');
            });
        });
    });
});

 router.post('/update-template-status',user_validation, function(req, res) {
//router.post('/update-template-status', function(req, res) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            template_id = post.id;

        if(typeof post.id == 'undefined' || !post.id || typeof post.value == 'undefined' || !post.value) {
            res.end(JSON.stringify({fail: 'first fail'}));
            return false;
        }

        req.getConnection(function(err, connection) {
            if (err) {
                res.end(JSON.stringify({fail: 'secund fail'}));
                return false;
            }

            var Template=new video_templates(connection,template_id);

            Template.update_template_status(post.value,function(rows){
                if (!rows) {
                    res.end(JSON.stringify({fail:'sever error'}));
                    return false;
                }

                res.end(JSON.stringify({ success: true }));
            });
        });
    }else{
        res.status(404).send('Not found');

    }
});

 router.get('/templates-list/:page?',user_validation, function(req, res, next) {
//router.get('/templates-list', function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    var get = req.params
        page = 0,
        domain=req.protocol + '://' + req.get('host');
    if(get.page && get.page.isNumeric()) {
        page = get.page;
    }
    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var videoTemplates = new video_templates(connection);
        videoTemplates.get_all_templates( function(err,rows){
            var templates = rows.length;
            videoTemplates.templates_category_all( function(all_category){
                videoTemplates.plans_all( function(all_plans){
                    videoTemplates.packages( function(packages){
                        for (var i = 0; i < templates; i++){
                            var template_category_name = '',
                                category_arr = new Array(),
                                template_plans_name = '',
                                plans_arr = new Array();
                            try {
                                var template_category = JSON.parse(rows[i].templates_category_id);

                                for(k in all_category){
                                    if(typeof template_category == 'object'){
                                        for(var j in template_category){
                                            if(all_category[k].id == template_category[j]){
                                                template_category_name+=all_category[k].name+', ';
                                                category_arr.push(all_category[k].id);
                                            }
                                        }
                                    }else{
                                        if(all_category[k].id == template_category){
                                            template_category_name+=all_category[k].name+', ';
                                            category_arr.push(all_category[k].id);
                                        }
                                    }
                                }

                            } catch (err) {
                                template_category_name = '';
                            }

                            try {
                                var template_plans = JSON.parse(rows[i].plans_id);

                                for(k in all_plans){
                                    if(typeof template_plans == 'object'){
                                        for(var j in template_plans){
                                            if(all_plans[k].id == template_plans[j]){
                                                template_plans_name+=all_plans[k].name+', ';
                                                plans_arr.push(all_plans[k].id);
                                            }
                                        }
                                    }else{
                                        if(all_plans[k].id == template_plans){
                                            template_plans_name+=all_plans[k].name+', ';
                                            plans_arr.push(all_plans[k].id);
                                        }
                                    }
                                }

                            } catch (err) {
                                template_plans_name = '';
                            }

                            rows[i].date = moment(rows[i].date).format('ll');
                            rows[i].category_name = template_category_name;
                            rows[i].category_arr = JSON.stringify(category_arr);
                            rows[i].plans_name = template_plans_name;
                            rows[i].plans_arr = JSON.stringify(plans_arr);
                            template_category_name = '';
                            template_plans_name = '';

                            var packages_str = '';
                            var packages_arr = [];
                            for (var j = 0; j < packages.length; j++) {
                                try{
                                    var package_templates = JSON.parse(packages[j].templates);
                                }catch(e){
                                    var package_templates = [];
                                }
                                for(k in package_templates){
                                    if(typeof package_templates[k] === 'object'){
                                        if(package_templates[k]["id"] == rows[i].templates_id){
                                            packages_str+= packages[j].name+', ';
                                            packages_arr.push(""+packages[j].id);
                                        }
                                    }else{
                                        if(package_templates[k] == rows[i].templates_id){
                                            packages_str+= packages[j].name+', ';
                                            packages_arr.push(""+packages[j].id);
                                        }
                                    }
                                }
                            }
                            rows[i].packages = packages_str;
                            rows[i].packages_arr = JSON.stringify(packages_arr);

                            // var plans_str = '';
                            // var plans_arr = [];
                            // for (var j = 0; j < all_plans.length; j++) {
                            //     if(all_plans[j].templates){
                            //         if(JSON.parse(all_plans[j].templates).indexOf(""+rows[i].templates_id+"") > -1){
                            //             plans_str+= all_plans[j].name+', ';
                            //             plans_arr.push(''+all_plans[j].id+'');
                            //         }
                            //     }
                            // }
                            // rows[i].plans = plans_str;
                            // rows[i].plans_arr = JSON.stringify(plans_arr);

                            // var category_str = '';
                            // var category_arr = [];
                            // for (var j = 0; j < all_category.length; j++) {
                            //     if(all_category[j].templates){
                            //         if(JSON.parse(all_category[j].templates).indexOf(""+rows[i].templates_id+"") > -1){
                            //             category_str+= all_category[j].name+', ';
                            //             category_arr.push(''+all_category[j].id+'');
                            //         }
                            //     }
                            // }
                            // rows[i].category = category_str;
                            // rows[i].category_arr = JSON.stringify(category_arr);;
                        }
                        res.render('template-list',
                            {
                                templates:rows,
                                packages:packages ? JSON.stringify(packages) : false,
                                all_packages:packages,
                                all_plans:all_plans ? JSON.stringify(all_plans) : false,
                                plans_all:all_plans,
                                all_category:all_category ? JSON.stringify(all_category) : false,
                                category_all:all_category,
                                page:page,
                                domain:domain
                            });
                    });
                });
            });
        });
    });
});


router.post('/save-template',user_validation, function(req, res, next) {
// router.post('/save-template', function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
        var post = req.body,
            template_id = post.template_id,
            tmplate_data = post.tmplate_data;

        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var Users = new users(connection);
            Users.update_template(template_id, tmplate_data, function(row){
                res.end(JSON.stringify({ success: true }));
            });
        });
    }else{
        res.end(JSON.stringify({ success: false }));
    }
});

 router.get('/download/:id',user_validation, function(req, res, next) {
//router.get('/download/:id', function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    var get=req.params;

    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var Template=new video_templates(connection);
        Template.get_videos_by_id(get.id,function(row){
            var workbook = new Excel.Workbook(),
                sheet = workbook.addWorksheet("My Sheet"),
                worksheet = workbook.getWorksheet("My Sheet"),
                file = row.name+'_'+row.user_id+'.csv',
                file_path = 'public/csv/'+file,
                video_data = JSON.parse(row.video_json),
                img_url = '';

            worksheet.columns = [
                { header: "Id", key: "id", width: 10 },
                { header: "Json", key: "json", width: 10 },
                { header: "Cropped img url", key: "img_url", width: 10 }
            ];

            Object.keys(video_data).forEach(function (inputs_key) {
                if (video_data[inputs_key]['images'] != undefined) {
                    var img = video_data[inputs_key]['images'];
                    Object.keys(img).forEach(function (key) {
                        if (img[key]['path'] != undefined) {
                            img_url += img[key]['path']+', ';
                        }
                    });
                }
            });

            worksheet.addRow({id: row.id, json: row.video_json, img_url: img_url });
            workbook.csv.writeFile(file_path)
                .then(function() {
                    var filename = path.basename(file_path),
                        mimetype = mime.lookup(file_path);

                    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                    res.setHeader('Content-type', mimetype);

                    var filestream = fs.createReadStream(file_path);
                    filestream.pipe(res);
                });

            // for execl export
            //workbook.xlsx.writeFile(file_path)
            //    .then(function() {
            //        var filename = path.basename(file_path),
            //            mimetype = mime.lookup(file_path);
            //
            //        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            //        res.setHeader('Content-type', mimetype);
            //
            //        var filestream = fs.createReadStream(file_path);
            //        filestream.pipe(res);
            //    });
        });
    });

});

 router.post('/update-template',user_validation,upload.any(),function(req, res, next) {
//router.post('/update-template',upload.any(),function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
        var post = req.body,
            files =  req.files,
            file_name = '',
            cover_photo = '',
            // category = typeof post.category == 'undefined'? '':JSON.stringify(post.category),
            aep = post.aep,
            max_duration = post.max_duration,
            type = post.type,
            target = post.target,
            desc = post.desc,
            music = typeof post.music == 'undefined'? 'false' : 'true',
            aep_file = '',
            keyword = post.keyword,
            notes = post.notes,
            template_id = post.template_id,
            folder = '',
            // plan = typeof post.plan == 'undefined'? '':JSON.stringify(post.plan),
            price = post.price,
            i = 0;

        if(post.name == undefined || !post.name){
            res.end(JSON.stringify({ fail: true }));
        }
        req.getConnection(function (err, connection) {
            if (err) return next(err);

            var Template = new video_templates(connection, template_id);
            Template.get_template_by_id(function (err, rows) {
                if (err)res.status(500).send('server error');

                    folder = rows.folder;

                    if(!folder){
                        folder = '/'+rows.cover_photo.split('/')[1];
                    }
                var path = 'public/templates'+folder,
                    file_name = rows.file_name,
                    cover_photo = rows.cover_photo,
                    json_data = JSON.parse(rows.json_data),
                    aep_file = rows.aep_file;

                if(type == 'static'){
                    for(var i in json_data){
                        delete json_data[i]['aep'];
                        delete json_data[i]['aep_file'];
                    }
                    aep_file = '';
                }
                json_data = JSON.stringify(json_data);

                var j = 0;
                if(files.length > 0){
                    for(var i = 0; i < files.length; i++){
                        var file_path = files[i].path;

                        if(files[i].fieldname == 'cover_photo'){
                            cover_photo = folder+'/cov.jpg';
                            var filename = path+'/cov.jpg';
                        }
                        if(files[i].fieldname == 'video'){
                            file_name = folder+'/vid.mp4';
                            var filename = path+'/vid.mp4';
                        }
                        if(files[i].fieldname == 'aep_file'){
                            aep_file = folder+'/aep/aep.aep';
                            var filename = path+'/aep/aep.aep';
                        }
                        var source = fs.createReadStream(file_path);
                        var dest = fs.createWriteStream(filename);
                        source.pipe(dest);
                        fs.unlink(files[i].path);
                        source.on('end', function() {
                            j++;
                            if(j == files.length){
                                updete(file_name,cover_photo,aep_file,json_data);
                            }
                        });
                        source.on('error', function(err) {
                             res.end(JSON.stringify({fail: true}));
                        });
                    }
                }else{
                   updete(file_name,cover_photo,aep_file,json_data);
                }
            });
        });

        var updete = function(file_name,cover_photo,aep_file,json_data){
            req.getConnection(function(err, connection) {
                if (err) throw(err);
                var Templates = new video_templates(connection,template_id);
                    Templates.update_template_by_id(max_duration,post.name,type,target,desc,aep,keyword,notes,file_name,cover_photo,aep_file,folder,json_data,price,music,function(rows){
                        if(rows){
                            res.end(JSON.stringify({ max_duration:max_duration,success: true,videos_path:file_name,cov_path:cover_photo,type:type}));
                        }else{
                            res.end(JSON.stringify({ fail: true }));
                        }
                    });
            });
        }
    }else{
        res.status(404).send('Not found');
    }
});

router.post('/upload-video',user_validation,upload_videos.any(),function(req, res, next) {
// router.post('/upload-video',upload_videos.any(),function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');

        var files=req.files;
            post = req.body;

        if(!files.length){
            res.end(JSON.stringify({ success: false }));
            return false;
        }

        var mime=files[0].mimetype;

        if(allowed_videos_types.indexOf(mime)<0){
            res.end(JSON.stringify({ success: false }));
            return false;
        }

        var file_location=files[0].path.replace('public', '');

        req.getConnection(function (err, connection) {
            if (err) throw(err);
            var Templates = new video_templates(connection);
				Templates.update_user_videos_pending(post.user_videos_id,file_location,function(success){
					Templates.get_user_id_pending_videos(post.user_videos_id,function(rows){

						var Users = new users(connection);
						Users.get_user_data(rows.user_id,function(user_data){
							var mailOptions = {
							    from: '',
							    to: user_data.email,
							    subject: '',
							    text: '',
							    html: ''
							  }
							transporter.sendMail(mailOptions, function(error, response){
								res.end(JSON.stringify({ success: true,user_videos_id: post.user_videos_id}));
							});
						});
					});
				 });
        });
    }else{
		res.status(404).send('Not found');
	}

});

router.post('/add-template',user_validation,upload.any(),function(req, res, next) {
// router.post('/add-template',upload.any(),function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
           // res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            files =  req.files,
            name = post.name.toLowerCase().replace(/ /g,'-'),
            file_name = '',
            cover_photo = '',
            // category = typeof post.category == 'undefined'? '':JSON.stringify(post.category),
            aep = post.aep,
            type = post.type,
            target = post.target,
            max_duration = post.max_duration,
            desc = post.desc,
            aep_file = '',
            music = typeof post.music == 'undefined'? 'false' : 'true',
            keyword = post.keyword,
            notes = post.notes,
            // plan = typeof post.plan == 'undefined'? '':JSON.stringify(post.plan),
            price = post.price,
            path = 'public/templates/'+name,
            json_data = '',
            i = 0;

        if(post.name == undefined || !post.name){
            res.end(JSON.stringify({ fail: true }));
        }

        var insert = function(file_name,cover_photo,aep_file,slide_timeline_images){
            req.getConnection(function(err, connection) {
                if (err) throw(err);
                var Templates = new video_templates(connection);
                    Templates.create_new_template(0,max_duration,post.name,file_name,cover_photo,type,aep,desc,target,aep_file,keyword,notes,folder,price,json_data,music,function(id){
                        if(id){
                            res.end(JSON.stringify({ success: true,template_id:id,max_duration:max_duration,folder:folder,videos_path:file_name,cov_path:cover_photo,aep_path:aep_file,type:type,slide_timeline_images:slide_timeline_images}));
                        }else{
                            res.end(JSON.stringify({ fail: true }));
                        }
                    });
            });
        }

        var folderSelect = function(path){
            if(fs.existsSync(path)){
                i++
                var count =path.indexOf('(');
                    if(count == -1){
                        path = path+'('+i+')';
                    }else{
                        path = path.slice(0, count ) + '('+i+')';
                    }
                folderSelect(path);
            }else{
                fs.mkdirSync(path);
            }
        }

        folderSelect(path);

        if(i>0)
            path = path+'('+i+')';

        fs.mkdirSync(path+'/aep');

        var j = 0,
            k = 0,
            slide_timeline_images = Array(),
            folder = path.replace('public/templates','');

        if(files.length > 0){
            for(var i = 0; i < files.length; i++){
                var file_path = files[i].path;

                if(files[i].fieldname == 'cover_photo'){
                    cover_photo = folder+'/cov.jpg';
                    var filename = path+'/cov.jpg';
                }
                if(files[i].fieldname == 'video'){
                    file_name = folder+'/vid.mp4';
                    var filename = path+'/vid.mp4';
                }
                if(files[i].fieldname == 'timline_slides'){
                    var slide_timeline_image = folder+'/'+files[i]['filename'];
                    var filename = path+'/'+files[i]['filename'];
                    slide_timeline_images.push(slide_timeline_image);
                    j--;
                    k++;
                }
                if(files[i].fieldname == 'aep_file'){
                    aep_file = folder+'/aep/aep.aep';
                    filename = path+'/aep/aep.aep';
                }
                var source = fs.createReadStream(file_path);
                var dest = fs.createWriteStream(filename);
                source.pipe(dest);
                fs.unlink(files[i].path);
                source.on('end', function() {
                    j++;
                    if(j == files.length - k){
                        insert(file_name,cover_photo,aep_file,slide_timeline_images);
                    }
                });
                source.on('error', function(err) {
                     res.end(JSON.stringify({fail: true}));
                });
            }
        }else{
           insert(file_name,cover_photo,aep_file,slide_timeline_images);
        }
    }else{
        res.status(404).send('Not found');
    }

});

 router.post('/upload-aep',user_validation,function(req, res, next) {
//router.post('/upload-aep',function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            aep_file = post.file_data,
            folder_name = post.folder_name;

        if(post.file_data == undefined || !post.file_data ||
            post.folder_name == undefined || !post.folder_name ){
            res.end(JSON.stringify({ fail: true }));
        }

        if (!fs.existsSync('public/templates/'+folder_name+'/aep')){
            fs.mkdirSync('public/templates/'+folder_name+'/aep');
        }
                // res.end(JSON.stringify({ fail: true }));

        crypto.pseudoRandomBytes(16, function (err, raw) {
            var file_name = raw.toString('hex') + Date.now() + '.aep';

            fs.writeFile('public/templates/'+folder_name+'/aep/'+file_name, aep_file, 'base64', function(err) {
                if(err){
                    res.end(JSON.stringify({ fail: true }));
                }
                var file_path = 'public/templates/'+folder_name+'/aep/'+file_name;
                res.end(JSON.stringify({ success: true, path: folder_name+'/aep/'+file_name}));

            });

        });
    }else{
        res.status(404).send('Not found');
    }

});

router.post('/upload-slide-video',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            aep_file = post.file_data,
            folder_name = post.folder_name;

        if(post.file_data == undefined || !post.file_data ||
            post.folder_name == undefined || !post.folder_name ){
            res.end(JSON.stringify({ fail: true }));
        }

        if (!fs.existsSync('public/templates/'+folder_name+'/slideVideo')){
            fs.mkdirSync('public/templates/'+folder_name+'/slideVideo');
        }

        crypto.pseudoRandomBytes(16, function (err, raw) {
            var file_name = raw.toString('hex') + Date.now() + '.mp4';

            fs.writeFile('public/templates/'+folder_name+'/slideVideo/'+file_name, aep_file, 'base64', function(err) {
                if(err){
                    res.end(JSON.stringify({ fail: true }));
                }
                var file_path = 'public/templates/'+folder_name+'/slideVideo/'+file_name;
                res.end(JSON.stringify({ success: true, path: folder_name+'/slideVideo/'+file_name}));

            });

        });
    }else{
        res.status(404).send('Not found');
    }

});

 router.post('/img-upload',user_validation,upload.any(),function(req, res, next) {
//router.post('/img-upload',upload.any(),function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files[0],
            post = req.body;

        if(typeof file == 'undefined' ||
            typeof post.folder_name == 'undefined' || !post.folder_name ||
            typeof post.image_type == 'undefined' || !post.image_type ||
            typeof post.slide_id == 'undefined' || !post.slide_id) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        var source = fs.createReadStream(file.path);
        var dest = fs.createWriteStream('public/templates'+post.folder_name+"/"+file.filename);
        var new_file = post.folder_name+"/"+file.filename;
        source.pipe(dest);
        source.on('end', function() {
            fs.unlink(file.path, function() {
                if(typeof post.slide_path != 'undefined' && post.slide_path){
                    fs.unlink('public'+post.slide_path, function() {
                        res.end(JSON.stringify({success: true,path:new_file,image_type:post.image_type,slide_id:parseInt(post.slide_id)}));
                    })
                }else{
                    res.end(JSON.stringify({success: true,path:new_file,image_type:post.image_type,slide_id:parseInt(post.slide_id)}));
                }
            });
        });
        source.on('error', function(err) {
             res.end(JSON.stringify({fail: true}));
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/placeholder-upload',user_validation,upload_logos.any(),function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files[0],
            path = '/logos/'+file.filename,
            post = req.body;

        if(typeof file == 'undefined') {
            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
            Templates.insert_logo(file.originalname,file.filename,path,function(err,row_id){
                if(err) return err;

                res.end(JSON.stringify({success: true}));
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/get-logos',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
            Templates.get_logos(function(err,rows){
                if(err) return err;

                res.end(JSON.stringify({success: true,rows:rows}));
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

 router.post('/delete-slide',user_validation,function(req, res, next) {
//router.post('/delete-slide',function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.cov == 'undefined' || !post.cov ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        fs.unlink('public/'+post.cov, function() {
            if( typeof post.slide != 'undefined' || post.slide ){
                fs.unlink('public/'+post.slide, function() {
                    res.end(JSON.stringify({success: true,cov:true,slide:true}));
                });
            }else{
                res.end(JSON.stringify({success: true,cov:true,slide:false}));
            }
        });
    }else{
        res.status(404).send('Not');
    }
});

 router.post('/delete-template',user_validation,function(req, res, next) {
//router.post('/delete-template',function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.id == 'undefined' || !post.id ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection,post.id);
            Templates.get_template_by_id(function(rows1,rows){
                var folder_name = rows.file_name.split('/')[1];
                Templates.delete_template(post.id,function(row){
                    if(row){
                        var deleteFolderRecursive = function(path) {
                          if( fs.existsSync(path) ) {
                            fs.readdirSync(path).forEach(function(file,index){
                              var curPath = path + "/" + file;
                              if(fs.lstatSync(curPath).isDirectory()) { // recurse
                                deleteFolderRecursive(curPath);
                              } else { // delete file
                                fs.unlinkSync(curPath);
                              }
                            });
                            fs.rmdirSync(path);
                          }
                        };
                        deleteFolderRecursive('public/templates/'+folder_name);
                        res.end(JSON.stringify({ success: true}));
                    }else{
                        res.end(JSON.stringify({fail: true}));
                    }
                })
            });
        });
    }else{
        res.status(404).send('Not');
    }
});


router.post('/add-category',user_validation,function(req, res, next) {
// router.post('/add-category',function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.category == 'undefined' || !post.category ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection,post.id);
            Templates.insert_category(post.category,function(insertId){
                if(insertId){
                    res.end(JSON.stringify({ success: true,id:insertId,name:post.category}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/delete-category',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.id == 'undefined' || !post.id ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
        console.log(post.id);
            Templates.delete_category(post.id,function(success){
                if(success){
                    res.end(JSON.stringify({ success: true,id:post.id}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/add-plan',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.plan == 'undefined' || !post.plan ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection,post.id);
            Templates.insert_plan(post.plan,function(insertId){
                if(insertId){
                    res.end(JSON.stringify({ success: true,id:insertId,name:post.plan}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/delete-plan',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.id == 'undefined' || !post.id ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
            Templates.delete_plan(post.id,function(success){
                if(success){
                    res.end(JSON.stringify({ success: true,id:post.id}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/upadet-plan',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.id == 'undefined' || !post.id || typeof post.plan == 'undefined' ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
            Templates.upadet_plan(post.id,post.plan,function(success){
                if(success){
                    res.end(JSON.stringify({ success: true,plan:post.plan}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/clon-template',user_validation, function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            id = post.id;
        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var Templates = new video_templates(connection,id);
            Templates.get_template_by_id(function(err,row){
                if(row){

                    var i = 0;
                    var folder_old = row.folder.replace(/\\/g,'/').replace('/','');
                    console.log(folder_old);
                    if(!folder_old){
                        folder_old = row.cover_photo.split('/')[1];
                    }

                    var path = 'public/templates/'+folder_old;
                    var folderSelect = function(path){
                        if(fs.existsSync(path)){
                            i++
                            var count =path.indexOf('(');
                                if(count == -1){
                                    path = path+'('+i+')';
                                }else{
                                    path = path.slice(0, count ) + '('+i+')';
                                }
                            folderSelect(path);
                        }else{
                            fs.mkdirSync(path);
                        }
                    }

                    folderSelect(path);

                    if(i>0){
                        var count =folder_old.indexOf('(');
                            if(count > 0){
                                folder = folder_old.slice(0, count ) + '('+i+')';
                            }else{
                                folder = folder_old+'('+i+')';
                            }
                    }

                    var name = row.name,
                        file_name = row.file_name,
                        cover_photo = row.cover_photo,
                        templates_category_id = row.templates_category_id,
                        aep = row.aep,
                        type = row.type,
                        target = row.target,
                        description = row.description,
                        aep_file = row.aep_file,
                        status = row.status,
                        keyword = row.keyword,
                        // folder = row.folder,
                        plans_id = row.plans_id,
                        notes = row.notes,
                        price = row.price,
                        max_duration=row.max_duration;

                    if(file_name){
                        file_name = '/'+folder+'/'+file_name.split("/")[file_name.split("/").length-1];
                    }

                    if(cover_photo){
                        cover_photo = '/'+folder+'/'+cover_photo.split("/")[cover_photo.split("/").length-1];
                    }

                    if(aep_file){
                        aep_file = '/'+folder+'/aep/'+aep_file.split("/")[aep_file.split("/").length-1];
                    }

                    var json_data = JSON.parse(row.json_data);
                    var length = Object.keys(json_data).length;
                    for(i=1 ; i <= length ; i++){
                        var cov = json_data[i]['cov'];
                            slide = json_data[i]['slide'],
                            aep_file =(typeof json_data[i]['aep_file'] != 'undefined') ? json_data[i]['aep_file'] : '';

                        if(cov){
                            cov = '/'+folder+'/'+cov.split("/")[cov.split("/").length-1];
                        }

                        if(slide){
                            slide = '/'+folder+'/'+slide.split("/")[slide.split("/").length-1];
                        }

                        if(aep_file){
                            aep_file = '/'+folder+'/'+aep_file.split("/")[aep_file.split("/").length-1];
                        }

                        json_data[i]['cov'] = cov;
                        json_data[i]['slide'] = slide;
                        json_data[i]['aep_file'] = aep_file;

                        if(i == length){
                            console.log('before create new template');



                                                    //max_duration,template_name,file_name,cover_photo,templates_category_id,type,aep,desc,target,aep_path,keyword,notes,folder,plan,price,json_data,callback
                            Templates.create_new_template(0,max_duration,name,file_name,cover_photo,templates_category_id,type,aep,description,target,aep_file,keyword,notes,'/'+folder,plans_id,price,JSON.stringify(json_data),'false',function(id){
                                if(id){
                                    console.log(id);
                                    var k = 1;
                                    var file_count = 0
                                    var copy = function(path , new_path){
                                        fs.readdir(path, function(err, list) {
                                            file_count += list.length
                                            list.forEach(function(file) {
                                                var current = fs.lstatSync(path+'/'+file);

                                                if(current.isDirectory()){
                                                    k++;
                                                    fs.mkdirSync(new_path+'/'+file);
                                                    copy('public/templates/'+folder_old+'/'+file,'public/templates/'+folder+'/'+file)
                                                }else{
                                                    var source = fs.createReadStream(path+'/'+file);
                                                    var dest = fs.createWriteStream(new_path+'/'+file);
                                                    source.pipe(dest);

                                                    source.on('end', function() {
                                                        k++;
                                                        if(file_count == k){
                                                            res.end(JSON.stringify({ success: true,id:id }));

                                                        }
                                                    });
                                                    source.on('error', function(err) {
                                                        res.end(JSON.stringify({fail: true}));
                                                    });
                                                }
                                            });

                                        });
                                    }
                                    copy('public/templates/'+folder_old,'public/templates/'+folder);
                                }else{
                                    console.log('no id')
                                }
                            });




                        }
                    }
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.end(JSON.stringify({fail: true}));
    }
});

router.post('/child-template',user_validation, function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            id = post.id;
        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var Templates = new video_templates(connection,id);
            Templates.get_template_by_id(function(err,row){
                if(row){

                    var i = 0;
                    var folder_old = row.folder.replace(/\\/g,'/').replace('/','');
                    console.log(folder_old);
                    if(!folder_old){
                        folder_old = row.cover_photo.split('/')[1];
                    }

                    var path = 'public/templates/'+folder_old;
                    var folderSelect = function(path){
                        if(fs.existsSync(path)){
                            i++
                            var count =path.indexOf('(');
                                if(count == -1){
                                    path = path+'('+i+')';
                                }else{
                                    path = path.slice(0, count ) + '('+i+')';
                                }
                            folderSelect(path);
                        }else{
                            fs.mkdirSync(path);
                        }
                    }

                    folderSelect(path);

                    if(i>0){
                        var count =folder_old.indexOf('(');
                            if(count > 0){
                                folder = folder_old.slice(0, count ) + '('+i+')';
                            }else{
                                folder = folder_old+'('+i+')';
                            }
                    }

                    var name = row.name,
                        file_name = row.file_name,
                        cover_photo = row.cover_photo,
                        templates_category_id = row.templates_category_id,
                        aep = row.aep,
                        type = row.type,
                        target = row.target,
                        description = row.description,
                        aep_file = row.aep_file,
                        status = row.status,
                        keyword = row.keyword,
                        // folder = row.folder,
                        plans_id = row.plans_id,
                        notes = row.notes,
                        price = row.price,
                        max_duration=row.max_duration;

                    if(file_name){
                        file_name = '/'+folder+'/'+file_name.split("/")[file_name.split("/").length-1];
                    }

                    if(cover_photo){
                        cover_photo = '/'+folder+'/'+cover_photo.split("/")[cover_photo.split("/").length-1];
                    }

                    if(aep_file){
                        aep_file = '/'+folder+'/aep/'+aep_file.split("/")[aep_file.split("/").length-1];
                    }

                    var json_data = JSON.parse(row.json_data);
                    var length = Object.keys(json_data).length;
                    for(i=1 ; i <= length ; i++){
                        var cov = json_data[i]['cov'];
                            slide = json_data[i]['slide'],
                            aep_file =(typeof json_data[i]['aep_file'] != 'undefined') ? json_data[i]['aep_file'] : '';

                        if(cov){
                            cov = '/'+folder+'/'+cov.split("/")[cov.split("/").length-1];
                        }

                        if(slide){
                            slide = '/'+folder+'/'+slide.split("/")[slide.split("/").length-1];
                        }

                        if(aep_file){
                            aep_file = '/'+folder+'/'+aep_file.split("/")[aep_file.split("/").length-1];
                        }

                        json_data[i]['cov'] = cov;
                        json_data[i]['slide'] = slide;
                        json_data[i]['aep_file'] = aep_file;

                        if(i == length){
                            console.log('before create new template');

                            var child = id;

                                                    //max_duration,template_name,file_name,cover_photo,templates_category_id,type,aep,desc,target,aep_path,keyword,notes,folder,plan,price,json_data,callback
                            Templates.create_chaild_template(child,max_duration,name,file_name,cover_photo,templates_category_id,type,aep,description,target,aep_file,keyword,notes,'/'+folder,plans_id,price,JSON.stringify(json_data),function(id){
                                if(id){
                                    console.log(id);
                                    var k = 1;
                                    var file_count = 0
                                    var copy = function(path , new_path){
                                        fs.readdir(path, function(err, list) {
                                            file_count += list.length
                                            list.forEach(function(file) {
                                                var current = fs.lstatSync(path+'/'+file);

                                                if(current.isDirectory()){
                                                    k++;
                                                    fs.mkdirSync(new_path+'/'+file);
                                                    copy('public/templates/'+folder_old+'/'+file,'public/templates/'+folder+'/'+file)
                                                }else{
                                                    var source = fs.createReadStream(path+'/'+file);
                                                    var dest = fs.createWriteStream(new_path+'/'+file);
                                                    source.pipe(dest);

                                                    source.on('end', function() {
                                                        k++;
                                                        if(file_count == k){
                                                            res.end(JSON.stringify({ success: true,id:id }));

                                                        }
                                                    });
                                                    source.on('error', function(err) {
                                                        res.end(JSON.stringify({fail: true}));
                                                    });
                                                }
                                            });

                                        });
                                    }
                                    copy('public/templates/'+folder_old,'public/templates/'+folder);
                                }else{
                                    console.log('no id')
                                }
                            });




                        }
                    }
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.end(JSON.stringify({fail: true}));
    }
});

router.post('/icon-upload',user_validation,upload_icon.any(),function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var file = req.files,
            post = req.body;

        if(typeof file == 'undefined' ||
            typeof post.name == 'undefined' || !post.name) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        var group_json = {};
        var j = 1;
        for (var i = 0; i < file.length; i++) {
            var type= file[i].mimetype.split('/');
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
                group_json[j] = {};
                group_json[j]['path'] = '/icons/'+file[i].filename;

                group_json[j]['type'] = type;

            }else{
                fs.unlink(file[i].path);
            }

            if(j == file.length){
                req.getConnection(function(err, connection) {
                    if (err) return next(err);

                    var Templates = new video_templates(connection);

                    Templates.icon_group_insert(post.name,JSON.stringify(group_json),function(row){
                        res.end(JSON.stringify({ success: true,id:row,name:post.name}));
                    });
                });
            }
            j++;
        }

    }else{
        res.status(404).send('Not');
    }
});

router.post('/update-template-icons',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if(typeof post.template_id == 'undefined' || !post.template_id ||
            typeof post.icon_groups == 'undefined' || !post.icon_groups) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection,post.template_id);
            Templates.update_template_icon_group(post.icon_groups,function(row){
                res.end(JSON.stringify({ success: true}));
            });
        });

    }else{
        res.status(404).send('Not');
    }
});

router.post('/graphic-change',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if(typeof post.template_id == 'undefined' || !post.template_id || 
            typeof post.graphic == 'undefined' || !post.graphic) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection,post.template_id);
            Templates.update_template_graphic_status(post.graphic,function(row){
                res.end(JSON.stringify({ success: true,graphic:post.graphic}));
            });
        });

    }else{
        res.status(404).send('Not');
    }
});


router.post('/update-plan',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;
        if(typeof post.template_id == 'undefined' || !post.template_id ||
            typeof post.plan == 'undefined' || !post.plan) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection,post.template_id);
            Templates.update_template_plan(post.plan,function(row){
                res.end(JSON.stringify({ success: true}));
            });
        });

    }else{
        res.status(404).send('Not');
    }
});

router.post('/package-update',user_validation,upload.any(),function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            package_checked = post.package_checked,
            packages_price = post.package;

        if(typeof post.template_id == 'undefined' || !post.template_id) {
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection);
            Templates.update_package_templates(packages_price,package_checked,post.template_id,function(rows,packages_str){
                res.end(JSON.stringify({ success: true,packages_str:packages_str,packages_rows:rows}));
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/category-update',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;
        if(typeof post.template_id == 'undefined' || !post.template_id) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }

        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection);
            Templates.update_categorys_templates(post.categorys,post.template_id,function(row){
                if(row){
                    Templates.get_category(post.categorys,1,function(row){
                        var categorys_str = '';
                        if(row){
                            for (i in row) {
                                categorys_str+= row[i].name+' ,'
                                console.log(i);
                            }
                        }
                        res.end(JSON.stringify({ success: true,categorys_str:categorys_str}));
                    })
                }else{
                    res.end(JSON.stringify({fail: true}));
                    return false;
                }
            });
        });

    }else{
        res.status(404).send('Not');
    }
});

router.post('/plans-update',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;
        if(typeof post.template_id == 'undefined' || !post.template_id) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection);
            Templates.update_plans_templates(post.plans,post.template_id,function(row){
                 if(row){
                    Templates.get_plan(post.plans,1,function(row){
                        var plans_str = '';
                        if(row){
                            for (i in row) {
                                plans_str+= row[i].name+' ,'
                                console.log(i);
                            }
                        }
                        res.end(JSON.stringify({ success: true,plans_str:plans_str}));
                    })
                }else{
                    res.end(JSON.stringify({fail: true}));
                    return false;
                }
            });
        });

    }else{
        res.status(404).send('Not');
    }
});

router.post('/get-template-aep',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;
        if(typeof post.id == 'undefined' || !post.id) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        var template_id = post.id;
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection,template_id);
            Templates.get_template_by_id(function(err,row){
                res.end(JSON.stringify({ success: true,template:row}));
            });
        });

    }else{
        res.status(404).send('Not');
    }
});

router.post('/update-template-aep-static',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;
        if( typeof post.id == 'undefined' || !post.id ||
            typeof post.aep == 'undefined' || !post.aep) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        var template_id = post.id;
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection,template_id);
                Templates.update_template_aep(template_id,post.aep,function(err,row){
                    res.end(JSON.stringify({ success: true,template:row}));
                });
        });

    }else{
        res.status(404).send('Not');
    }
});

router.post('/update-template-aep-dynamic',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;
        if( typeof post.id == 'undefined' || !post.id ||
            typeof post.json_data == 'undefined' || !post.json_data) {
                res.end(JSON.stringify({fail: true}));
                return false;
        }
        var template_id = post.id;
        req.getConnection(function(err, connection) {
            if (err) return next(err);
            var Templates = new video_templates(connection,template_id);
                Templates.update_template_json_data(template_id,post.json_data,function(err,row){
                    res.end(JSON.stringify({ success: true,template:row}));
                });
        });

    }else{
        res.status(404).send('Not');
    }
});

router.post('/add-category-tag',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.category == 'undefined' || !post.category ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection,post.id);
            Templates.insert_category(post.category,function(insertId){
                if(insertId){
                    Templates.get_all_categorys_slides(function(all_categorys_slides){
                        res.end(JSON.stringify({ success: true,id:insertId,name:post.category,all_categorys_slides:all_categorys_slides}));
                    });
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/add-package',user_validation,function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            domain=req.protocol + '://' + req.get('host');

        if( typeof post.name == 'undefined' || !post.name ||
            typeof post.credits == 'undefined' || !post.credits ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        crypto.pseudoRandomBytes(3, function (err, raw) {
            req.getConnection(function(err, connection) {
                var Templates=new video_templates(connection);
                var token = raw.toString('hex').substring(0, 5);
                Templates.insert_package(post.name,post.credits,token,function(insertId){
                    if(insertId){
                        res.end(JSON.stringify({success: true,id:insertId,linck:domain+"/free-signin/"+token}));
                    }else{
                        res.end(JSON.stringify({fail: true}));
                    }
                });
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/edit-package',user_validation,function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.id == 'undefined' || !post.id ||
            typeof post.name == 'undefined' || !post.name ||
            typeof post.credits == 'undefined' || !post.credits ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
            Templates.edit_package(post.id,post.name,post.credits,function(row){
                if(row){
                    res.end(JSON.stringify({success: true}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/delete-package',user_validation,function(req, res, next) {
    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.id == 'undefined' || !post.id ){

            res.end(JSON.stringify({fail: true}));
            return false;
        }

        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
        console.log(post.id);
            Templates.delete_package(post.id,function(success){
                if(success){
                    res.end(JSON.stringify({ success: true,id:post.id}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

router.post('/upadet-category',user_validation,function(req, res, next) {
    if(!req.is_admin)
        res.redirect("/");

    if(req.xhr){
        res.setHeader('Content-Type', 'application/json');
        var post = req.body;

        if( typeof post.id == 'undefined' || !post.id || typeof post.category == 'undefined' ){
            res.end(JSON.stringify({fail: true}));
            return false;
        }
        req.getConnection(function(err, connection) {
            var Templates=new video_templates(connection);
            Templates.upadet_category(post.id,post.category,function(success){
                if(success){
                    res.end(JSON.stringify({ success: true,category:post.category}));
                }else{
                    res.end(JSON.stringify({fail: true}));
                }
            });
        });
    }else{
        res.status(404).send('Not');
    }
});

module.exports = router;




































