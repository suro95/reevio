/**
 * Created by Armen on 5/23/16.
 */
var express = require('express'),
	router = express.Router(),
    user_validation=require('../server/Class/SessionManager/ValidateUserSession.js'),
    users=require('../server/Class/Users/Users.js'),
    rig_templates=require('../server/Class/Rig/RigTemplates.js'),
    allowed_videos_types=['video/mp4'],
    multer  = require('multer'),
    crypto  = require('crypto'),
    path = require('path'),
    fs = require('fs'),
    EasyZip = require('easy-zip').EasyZip,
    mime = require('mime'),
    Excel = require("exceljs"),
    storage_videos = multer.diskStorage({
	    destination: 'public/rig/upload',
	    filename: function (req, file, cb) {
	        crypto.pseudoRandomBytes(16, function (err, raw) {
	            var type= file.mimetype.split('/');
	            type = type[type.length - 1];
	            cb(null, raw.toString('hex') + Date.now() + '.aep');
	        });
	    },

	}),
    upload = multer({ storage: storage_videos });


router.get('/',user_validation, function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var rigTemplates = new rig_templates(connection);
        rigTemplates.get_all_templates( function(err,rows){
            res.render('rig-homepage',{templates:rows});
        });
    });
});

router.get('/edit/:template_id',user_validation, function(req, res, next) {
    var get = req.params,
        template_id = get.template_id;

    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var rigTemplates = new rig_templates(connection,template_id);
        rigTemplates.get_template_by_id( function(err,rows){
            res.render('rig-detail',{template:rows});
        });
    });
});

router.get('/add',user_validation, function(req, res, next) {
    var get = req.params,
        template_id = get.template_id;

    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var rigTemplates = new rig_templates(connection,template_id);
        rigTemplates.get_rigged_by( function(err,rows){
            rigTemplates.get_rig_category( function(err,rows_category){
                rigTemplates.get_rig_source( function(err,rows_source){
                    rigTemplates.get_rig_fonts( function(err,rows_fonts){
                        res.render('rig-add-template',{rigged_by:rows,category:rows_category,source:rows_source,fonts:rows_fonts});
                    });
                });
            });
        });
    });
});

router.post('/add-template',user_validation,upload.any(),function(req, res, next) {
    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            files =  req.files,
            name = post.name,
            type = post.type,
            rigged_by = post.rigged_by,
            templaet_type = post.templaet_type,
            source = post.source,
            fonts = post.fonts,
            duration = post.duration,
            video_placeholder_length = post.video_placeholder_length,
            image_dimensions = post.image_dimensions,
            upload_aep_file = '',
            slide_aep_1 = '',
            slide_aep_2 = '',
            slide_json = {};

        for(file in files){
            switch(files[file].fieldname) {
                case 'upload_aep_file':
                    upload_aep_file = files[file].destination + '/' + files[file].filename;
                    break;
            }
        }

        for(var i = 0; i < duration.length; i++){
            var slide_name = 'slide'+(i+1),
                aep_file_name = 'slide_aep_'+(i+1);

            slide_json[slide_name] = {};
            slide_json[slide_name]['duration'] = duration[i];
            slide_json[slide_name]['video_placeholder_length'] = video_placeholder_length[i];
            slide_json[slide_name]['image_dimensions'] = image_dimensions[i];
            slide_json[slide_name]['error'] = '';

            for(file in files){
                if(files[file].fieldname == aep_file_name){
                    slide_json[slide_name]['aep'] = files[file].destination + '/' + files[file].filename; 
                }
            }

            if(typeof slide_json[slide_name]['aep'] == 'undefined')
                slide_json[slide_name]['aep'] = '';
        }

        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var rigTemplates = new rig_templates(connection);
            rigTemplates.add_template(name,rigged_by,type,templaet_type,source,upload_aep_file,JSON.stringify(slide_json) ,function(err,rows){
                if(err) res.end(JSON.stringify({ success: false }));
                res.end(JSON.stringify({ success: true }));
            });
        });
    }else{
        res.status(404).send('Not found');
    }

});

router.post('/update-template',user_validation,upload.any(),function(req, res, next) {
    if(req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            name = post.name,
            template_id = post.template_id,
            type = post.type,
            rigged_by = post.rigged_by,
            templaet_type = post.templaet_type,
            source = post.source,
            duration = post.duration,
            video_placeholder_length = post.video_placeholder_length,
            image_dimensions = post.image_dimensions,
            error = post.error,
            aep = post.aep,
            slide_json = {};


        for(var i = 0; i < duration.length; i++){
            var slide_name = 'slide'+(i+1);

            slide_json[slide_name] = {};
            slide_json[slide_name]['duration'] = duration[i];
            slide_json[slide_name]['video_placeholder_length'] = video_placeholder_length[i];
            slide_json[slide_name]['image_dimensions'] = image_dimensions[i];
            slide_json[slide_name]['error'] = error[i];
            slide_json[slide_name]['aep'] = aep[i];
        }

        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var rigTemplates = new rig_templates(connection,template_id);
            rigTemplates.update_template(name,rigged_by,type,templaet_type,source,JSON.stringify(slide_json) ,function(err,rows){
                if(err) res.end(JSON.stringify({ success: false }));
                res.end(JSON.stringify({ success: true }));
            });
        });
    }else{
        res.status(404).send('Not found');
    }

});

router.post('/add-new-name',user_validation,function(req, res, next) {
    if(req.xhr) {
        // res.setHeader('Content-Type', 'application/json');
        var post = req.body,
            name = post.new_naem,
            type = post.type;


        req.getConnection(function(err, connection) {
            if (err) return next(err);

            var rigTemplates = new rig_templates(connection);

            switch(type){
                case "rigged_by":
                    rigTemplates.add_rigged_by(name ,function(err,rows){
                        if(err) res.end(JSON.stringify({ success: false }));
                        res.end(JSON.stringify({ success: true ,id: rows}));
                    });
                    break;
                case "templaet_type":
                    rigTemplates.add_rig_category(name ,function(err,rows){
                        if(err) res.end(JSON.stringify({ success: false }));
                        res.end(JSON.stringify({ success: true,id: rows}));
                    });
                    break;
                case "source":
                    rigTemplates.add_rig_source(name ,function(err,rows){
                        if(err) res.end(JSON.stringify({ success: false }));
                        res.end(JSON.stringify({ success: true,id: rows}));
                    });
                    break;
                case "fonts":
                    rigTemplates.add_rig_source(name ,function(err,rows){
                        if(err) res.end(JSON.stringify({ success: false }));
                        res.end(JSON.stringify({ success: true,id: rows}));
                    });
                    break;
            }
        });
    }else{
        res.status(404).send('Not found');
    }

});

module.exports = router;