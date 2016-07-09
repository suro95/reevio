function Veeroll(connection)
{
	this.conn = connection;
}

Veeroll.prototype.getAllTemplates = function(callback){
	this.conn.query("select * from templates where templates_category_id = ? or templates_category_id = ?",[3,4],function(err,rows){
        if(err)return callback(err);
        if(rows.length)return callback(null,rows);
         callback(true);

    })
}
Veeroll.prototype.getUserVideos = function(user_id,callback){
	this.conn.query("SELECT v.*, t.name FROM user_videos v LEFT JOIN templates t ON (v.template_id=t.id) WHERE v.user_id=?",[user_id],function(err,rows){
        if(err)return callback(err);
        if(rows.length)return callback(null,rows);
         callback(true);
    })
}
Veeroll.prototype.getUsrVds = function(user_id,callback){
    this.conn.query("SELECT v.*, t.name FROM user_videos v LEFT JOIN templates t ON (v.template_id=t.id) WHERE v.user_id=? LIMIT 10",[user_id],function(err,rows){
        if(err)return callback(err);
        if(rows.length)return callback(null,rows);
         callback(true);
    })
}

Veeroll.prototype.getVideoLimit = function(user_id,count,limit,callback){
    this.conn.query("SELECT v.*, t.name FROM user_videos v LEFT JOIN templates t ON (v.template_id=t.id) WHERE v.user_id=? limit "+count+","+limit,[user_id],function(err,rows){
        if(err)return callback(err);
        if(rows.length)return callback(null,rows);
         callback(true);
    })
}
module.exports=Veeroll;
