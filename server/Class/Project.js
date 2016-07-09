/**
 * Created by aleksa on 2/5/16.
 */






function Project(connect,user_id){
    this.conn=connect;
    this.user_id=user_id;
}


Project.prototype.get_user_projects=function(callback){


    var sql="select * from projects where user_id=?;"

    this.conn.query(sql,[this.user_id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }
        callback([]);

    })

}



Project.prototype.get_user_projects_videos=function(callback){


    var sql="select p.id,p.project_name,p.business_name,count(v.id) as total_videos,website_url,fb_url,youtube_channel  " +
        "from projects p left join   user_videos v on p.user_id=v.user_id where p.user_id=?;"

    this.conn.query(sql,[this.user_id],function(err,rows){
        if(err)throw err;
        if(rows.length){
           callback(rows);
            return true;
        }
        callback([]);

    })

}

Project.prototype.create_new_project=function(){
    //arevik code for creating new project
}


Project.prototype.get_project_by_id=function(project_id,callback){
    var sql="select p.id,p.project_name,p.business_name,count(v.id) as total_videos,website_url,fb_url,youtube_channel,v.template_id,v.file_location,v.status  " +
        "from projects p left join   user_videos v on p.user_id=v.user_id where p.user_id=? and p.id=?;"

    this.conn.query(sql,[this.user_id,project_id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }
        callback([]);

    })



}


Project.prototype.get_user_project_videos=function(project_id,callback){
    if(!project_id){
        var that=this;
        this.get_default_project(function(rows){
            if(!rows)return false;
            that.conn.query('select * from user_videos where project_id=? and user_id=?',[rows[0].project_id,that.user_id],function(err,rows){
                if(err)throw(err);
                callback(rows)
            });
        })
    }else{
        this.conn.query('select * from user_videos where project_id=? and user_id=?',[project_id,this.user_id],function(err,rows){
            if(err)throw(err);
            callback(rows)
        });
    }

}

Project.prototype.get_default_project=function(callback){
    var sql="select * from projects where user_id=? limit 1";
    this.conn.query(sql,[this.user_id],function(err,rows){
        if(err)throw(err);
        if(rows.length)callback(rows)
        else callback(false);


    })
}

























module.exports=Project;







