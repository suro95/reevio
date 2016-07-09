/**
 * Created by Armen on 5/23/16.
 */

var moment=require('moment');

function RigTemplates(conn,template_id,user_id){
    this.conn=conn;
    this.template_id=template_id;
    this.user_id=user_id;
};


RigTemplates.prototype.get_all_templates= function (callback) {
    this.conn.query("SELECT * FROM rig_templates;",function(err,rows){
        if(err){
             callback(err);
            return false;
        }
        if(rows.length)callback(null,rows);
        else callback(null,false);
    })
}

RigTemplates.prototype.get_template_by_id= function (callback) {
    this.conn.query("SELECT * FROM rig_templates WHERe id=?;",[this.template_id],function(err,rows){
        if(err){
            callback(err);
            return false;
        }
        if(rows.length)callback(null,rows[0]);
        else callback(null,false);
    })
}

RigTemplates.prototype.add_template = function (name,rigged_by,status,type,source,aep_file_path,slides,callback) {
    var query = "INSERT INTO rig_templates (name,rigged_by,status,type,source,aep_file_path,slides) VALUES (?,?,?,?,?,?,?);";

    this.conn.query(query,[name,rigged_by,status,type,source,aep_file_path,slides],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);

    })
}

RigTemplates.prototype.update_template = function (name,rigged_by,status,type,source,slides,callback) {
    var query = "UPDATE rig_templates SET name=?,rigged_by=?,status=?,type=?,source=?,slides=? WHERE id = ?;";

    this.conn.query(query,[name,rigged_by,status,type,source,slides,this.template_id],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);

    })
}

RigTemplates.prototype.get_rigged_by= function (callback) {
    this.conn.query("SELECT * FROM rig_rigged_by;",function(err,rows){
        if(err){
            callback(err);
            return false;
        }
        if(rows.length)callback(null,rows);
        else callback(null,false);
    })
}

RigTemplates.prototype.get_rig_category= function (callback) {
    this.conn.query("SELECT * FROM rig_category;",function(err,rows){
        if(err){
            callback(err);
            return false;
        }
        if(rows.length)callback(null,rows);
        else callback(null,false);
    })
}

RigTemplates.prototype.get_rig_source= function (callback) {
    this.conn.query("SELECT * FROM rig_source;",function(err,rows){
        if(err){
            callback(err);
            return false;
        }
        if(rows.length)callback(null,rows);
        else callback(null,false);
    })
}

RigTemplates.prototype.get_rig_fonts= function (callback) {
    this.conn.query("SELECT * FROM rig_fonts;",function(err,rows){
        if(err){
            callback(err);
            return false;
        }
        if(rows.length)callback(null,rows);
        else callback(null,false);
    })
}

RigTemplates.prototype.add_rig_category= function (name,callback) {
    this.conn.query("INSERT INTO rig_category (name) VALUES (?);",[name],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);
    })
}

RigTemplates.prototype.add_rigged_by = function (name,callback) {
    var query = "INSERT INTO rig_rigged_by (name) VALUES (?);";

    this.conn.query(query,[name],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);

    })
}

RigTemplates.prototype.add_rig_source = function (name,callback) {
    var query = "INSERT INTO rig_source (name) VALUES (?);";

    this.conn.query(query,[name],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);

    })
}

RigTemplates.prototype.add_rig_fonts = function (name,callback) {
    var query = "INSERT INTO rig_fonts (name) VALUES (?);";

    this.conn.query(query,[name],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);

    })
}

module.exports=RigTemplates;



