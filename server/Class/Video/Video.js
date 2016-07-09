/**
 * Created by aleksa on 2/6/16.
 */

var moment=require('moment');


function Video(conn,user_id,project_id){
    this.conn=conn;
    this.user_id=user_id;
    this.project_id=project_id;
}



Video.prototype.get_user_project_videos=function(id,callback){
    var sql="select * from user_videos where id=? and user_id=?;"

    this.conn.query(sql,[id,this.user_id],function(err,rows){

        if(rows.length){
            callback(rows[0]);
        }else{
            callback(false);
        }
    })
}

Video.prototype.insert_user_videos=function(template_data,callback){
    var InsertedTempladeData = {};
    if(template_data){
        Object.keys(template_data).forEach(function(key) {
          InsertedTempladeData[key] = {};
          InsertedTempladeData[key][key] = {};
        });

        query = "INSERT INTO user_videos ( user_id,template_id,json_data,date,status) VALUES (?,?,?,?,?)";
        this.conn.query(query,[this.user_id,this.project_id,JSON.stringify(InsertedTempladeData), moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),'not_done'],function(err,rows){
            if(err)throw err;
            if(rows.affectedRows)callback(rows.insertId,InsertedTempladeData);
            else callback(false);
        });
    }
}

Video.prototype.Base64Image = function(dataString){
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
       // console.log(matches);
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = matches[2];

    return response;
}

Video.prototype.get_user_project_images=function(callback){
    var sql="select * from user_images where template_id=? and user_id=?;"

    this.conn.query(sql,[this.project_id,this.user_id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }
        callback([]);
    })
}

Video.prototype.get_user_all_images=function(limit,offset,callback){
    var sql="SELECT * FROM user_images WHERE user_id=? LIMIT ? OFFSET ?;"

    this.conn.query(sql,[this.user_id,limit,offset],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }
        callback([]);
    })
}

Video.prototype.delete_user_images=function(id,callback){
    var sql="DELETE FROM `user_images` WHERE id=?"

    this.conn.query(sql,[id],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows){
            callback(true);
        }else
            callback(false);
    })
}

Video.prototype.user_videos=function(callback){
    var sql="select * from users_videos_upload where template_id=? and user_id=?;"

    this.conn.query(sql,[this.project_id,this.user_id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }
        callback([]);
    })
}

Video.prototype.delete_user_upload_video=function(id,callback){
    var sql="DELETE FROM `users_videos_upload` WHERE id=?"

    this.conn.query(sql,[id],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows){
            callback(true);
        }else
            callback(false);
    })
}


Video.prototype.get_musics=function(callback){
    var sql="select * from musics;"

    this.conn.query(sql,function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }
        callback([]);
    })
}

Video.prototype.save_user_images= function (name,path,cover_image,callback) {
    var query="insert into user_images (user_id,template_id,name,path,date,cover_image) values(?,?,?,?,?,?)";
    this.conn.query(query,[this.user_id,this.project_id,name,path,Date.now(),cover_image],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows.insertId);
        else callback(false);

    })



}

Video.prototype.save_user_videos= function (name,path,callback) {
    var query="insert into users_videos_upload (user_id,template_id,name,path,date) values(?,?,?,?,?)";
    this.conn.query(query,[this.user_id,this.project_id,name,path,moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows);
        else callback(false);

    })



}

Video.prototype.save_user_voices= function (name,path,callback) {
    var query="insert into user_voices (user_id,template_id,name,path,date) values(?,?,?,?,?)";
    this.conn.query(query,[this.user_id,this.project_id,name,path,Date.now()],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);
    })
}

Video.prototype.save_user_music=function (name,path,original_name,callback) {
    var query="insert into user_music (user_id,template_id,music_path,music_name,create_date,original_name) values(?,?,?,?,?,?)";
    this.conn.query(query,[this.user_id,this.project_id,name,path,Date.now(),original_name],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);
    })
}

Video.prototype.user_music=function(callback){
    var sql="select * from user_music where user_id=? and template_id=?;"

    this.conn.query(sql,[this.user_id,this.project_id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }
        callback([]);
    })
}

Video.prototype.update_silde_data= function (slide_id, templateData, callback) {
       var query="SELECT * FROM `user_videos` WHERE user_id = ? AND template_id = ? ;",
        _this = this;
    this.conn.query(query,[this.user_id,this.project_id],function(err,rows){
        if(err)throw err;

        if(typeof rows[0] != 'undefined'){
            var data = rows[0],
                json = JSON.parse(data.json_data);

            json[slide_id] = JSON.parse(templateData);

            query = "UPDATE user_videos SET `json_data` = ? WHERE id = ? ;";
            _this.conn.query(query,[JSON.stringify(json),data.id],function(err,rows){
                if(err)throw err;
                if(rows.affectedRows)callback(true);
                else callback(false);
            });
        }else{
            var jsone_data = {};
            jsone_data[slide_id] = JSON.parse(templateData);
            query = "INSERT INTO user_videos ( user_id,template_id,json_data,date,status) VALUES (?,?,?,?,?)";
            _this.conn.query(query,[_this.user_id,_this.project_id,JSON.stringify(jsone_data), moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),'not_done'],function(err,rows){
                if(err)throw err;
                if(rows.affectedRows)callback(true);
                else callback(false);
            });
        }
    })
}

Video.prototype.update_silde_all_data= function (templateData,id, callback) {
    var query="SELECT * FROM `user_videos` WHERE id = ? and  user_id = ? AND template_id = ? ;",
        _this = this;
       // console.log(id);
    this.conn.query(query,[id,_this.user_id,_this.project_id],function(err,rows){
        if(err)throw err;

        if(typeof rows[0] != 'undefined'){
            var data = rows[0];
            query = "UPDATE user_videos SET `json_data` = ? WHERE id = ? ;";
            _this.conn.query(query,[templateData,data.id],function(err,rows){
                if(err)throw err;
                if(rows.affectedRows)callback(true);
                else callback(false);
            });
        }else{
            callback(false);
           /* query = "INSERT INTO user_videos ( user_id,template_id,json_data,date) VALUES (?,?,?,?)";
            _this.conn.query(query,[_this.user_id,_this.project_id,templateData,Date.now()],function(err,rows){
                if(err)throw err;
                if(rows.affectedRows)callback(true);
                else callback(false);
            });*/
        }
    })
}

Video.prototype.get_user_videos_count=function(callback){
    var sql="select COUNT(id) from user_videos where user_id=?;"

    this.conn.query(sql,[this.user_id],function(err,rows){
        if(rows.length){
            callback(rows[0]['COUNT(id)']);
        }else{
            callback(false);
        }
    })
}


module.exports=Video;