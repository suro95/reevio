/**
 * Created by aleksa on 3/17/16.
 */
var Promise=require('bluebird'),
    video_templates=require("../../Class/Video/VideoTemplates"),
    fs = require('fs'),
    request=require('request'),
    send_email=require('../../email/send_video_done');




var GetVideo={};




GetVideo.init=function(conn,users_videos_id,video_location){
    var that=this;
    return Promise.resolve({
        users_videos_id:users_videos_id,
        video_location:video_location,
        that:that,
        video_templates:new video_templates(conn),
        conn:conn
    })
}


GetVideo.validate_dataclay_data=function(obj){

    var query="select * from user_videos inner join users on user_videos.user_id=users.id where user_videos.id=?";
    return new Promise(function(resolve,reject){
    obj.conn.query(query,[obj.users_videos_id],function(err,rows){
        if(err)return reject(err);
        if(rows.length){
            obj.user_id=rows[0].user_id;
            obj.email=rows[0].email;
            obj.name=rows[0].name;
            obj.video_name=rows[0].video_name;
            return resolve(obj)
        };
        return (reject('tamplate with that id doesnt exists'))

    })


    })
}


GetVideo.save_video=function(obj){
        var query="update user_videos set file_location=?, status='done' where id=?";
    return new Promise(function(resolve,reject){
        obj.conn.query(query,[obj.video_location,obj.users_videos_id],function(err,rows){
            if(err)return reject(err);
            //console.log(rows);
            if(rows.affectedRows)return resolve(obj)
            return reject('no_affected_rows, video is not saved!')
        })
    })
}

GetVideo.crop_cover=function(obj){
    return new Promise(function(resolve,reject){
        var video_name = obj.video_location.replace('http://188.214.128.3/videos/',''),
            image_url = 'http://188.214.128.3/videoapi/VideoConverter/GetVideoThumnail?videourl='+video_name;

        if(!video_name)
            return reject("Can't get image.")

        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return reject(err);
            }
            var file_name = raw.toString('hex') + Date.now() + '.jpg',
                folder = 'user_video_cover/',
                file_path = 'public/'+ folder + file_name;

            request.get(image_url)
            .on('error', function(err) {
                return Promise.reject(err);
            })
            .pipe(fs.createWriteStream(file_path))
            .on('close',function(){
                var query = "update user_videos set video_cover=? where id=?";

                obj.conn.query(query,[folder+file_name,obj.users_videos_id],function(err,rows){
                    if(err)return reject(err);

                    if(rows.affectedRows)return resolve(obj)
                    return reject('no_affected_rows, video is not saved!')
                })
            })
        })
    })
}


GetVideo.notify_user=function(obj){
    
    var email=Object.create(send_email);
   // console.log(obj);
    email.init(obj.email,obj.name,'http://reevio.com/users/my-videos#play-'+obj.users_videos_id,obj.video_name)
    .then(email.set_options)
        .then(email.set_html)
        .then(email.send)
        .then(function(){
            return Promise.resolve();
        })
        .catch(function(err){
            return Promise.reject(err);
        })
    
     







}



















module.exports=GetVideo;