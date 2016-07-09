/**
 * Created by aleksa on 2/1/16.
 */

var moment=require('moment');

function VideoTemplates(conn,template_id,user_id){
    this.conn=conn;
    this.template_id=template_id;
    this.user_id=user_id;



};




VideoTemplates.prototype.get_template_by_id= function (callback) {
    this.conn.query("select * from templates where id=?",[this.template_id],function(err,rows){
        if(err)return callback(err);
        if(rows.length)return callback(null,rows[0]);
         callback(true);

    })



}
VideoTemplates.prototype.update_template_by_id= function (max_duration,name,type,target,description,aep,keyword,notes,file_name,cover_photo,aep_file,folder,json_data,price,music,callback) {
    var query="update templates SET max_duration =?, name = ?, type = ?, target = ?, description = ?, aep = ?, keyword = ?, notes = ?,file_name = ?, cover_photo = ?, aep_file = ?,folder=?,json_data=?,price=?,music=? WHERE id = ?";
    this.conn.query(query,[max_duration,name,type,target,description,aep,keyword,notes,file_name,cover_photo,aep_file,folder,json_data,price,music,this.template_id],function(err,rows){
        if(err)return callback(err);
        if(rows.length)return callback(rows);
         callback(true);

    })
}
VideoTemplates.prototype.get_template_by_category_id= function (category_id,callback) {
    this.conn.query("select * from templates where templates_category_id=?",[category_id],function(err,rows){
        if(err)throw err;
        if(rows.length)callback(rows);
        else callback(false);

    })



}

VideoTemplates.prototype.get_default_template= function (callback) {
    this.conn.query("select * from templates limit 1",function(err,rows){
        if(err)throw err;
        if(rows.length)callback(rows[0]);
        else callback(false);

    })



}
VideoTemplates.prototype.get_all_templates= function (callback) {
    this.conn.query("SELECT *,templates.name as template_name,templates.id as templates_id, templates_category.name as category_name,plans.name as plans_name FROM templates  LEFT JOIN templates_category on templates.templates_category_id = templates_category.id LEFT JOIN plans on templates.plans_id = plans.id",function(err,rows){
        if(err){
             callback(err);
            return false;
        }
        if(rows.length)callback(null,rows);
        else callback(null,false);

    })



}
VideoTemplates.prototype.get_template_grid= function (id,callback) {
    var _this = this;
    _this.conn.query("SELECT * FROM `templates` WHERE id="+id,function(err,rows){
        if(err){
             callback(err);
            return false;
        }
        if(rows.length){
            for (i in rows) {
                _this.get_category(rows[i]['templates_category_id'],i,function(category,index){
                    rows[index]['category'] = category;
                    if(index == rows.length-1){
                        callback(null,rows);
                    }
                })
            };
        }
        else callback(null,false);

    })
}
VideoTemplates.prototype.get_templates_limit= function (count,limit,callback) {
    this.conn.query("SELECT t.*, t_c.name as cat_name FROM templates t LEFT JOIN templates_category t_c ON (t.templates_category_id=t_c.id) WHERE t.status='complete' and t.child = 0",function(err,rows){
        if(err){
             callback(err);
            return false;
        }
        if(rows.length)callback(null,rows);
        else callback(null,false);

    })
}

VideoTemplates.prototype.get_templates_complete= function (packages,callback) {
    var _this = this;
    if(packages){
        _this.get_templates_user_packages(packages,function(rows){
           // console.log(rows);
            if(rows.length){
                for (i in rows) {
                    _this.get_category(rows[i]['templates_category_id'],i,function(category,index){
                        rows[index]['category'] = category;
                        if(index == rows.length-1){
                            callback(null,rows);
                        }
                    })
                };
            }
            else callback(null,false);
        });
    }else{
    _this.conn.query("SELECT * FROM `templates` WHERE templates.status='complete' and templates.child = 0 ORDER BY `templates`.`date` DESC",function(err,rows){
        if(err){
             callback(err);
            return false;
        }
        if(rows.length){
            for (i in rows) {
                _this.get_category(rows[i]['templates_category_id'],i,function(category,index){
                    rows[index]['category'] = category;
                    if(index == rows.length-1){
                        callback(null,rows);
                    }
                })
            };
        }
        else callback(null,false);

    })
    }
};

VideoTemplates.prototype.get_templates_user_packages = function(packages,callback){
    var _this = this;
    packages = packages.replace('[','(').replace(']',')');
    this.conn.query("SELECT * FROM `packages` WHERE name in "+packages+"",function(err,rows){
        var length = rows.length;
        var i = 0;
        var template_id = [];
        var user_package_tmp_id = '';
        var templates = '';
        while (i < length) {
            try {
                templates = JSON.parse(rows[i].templates);

                if(typeof templates === 'object'){
                    template_id = [];
                    for(k in templates){
                        if(typeof templates[k] === 'object'){
                            template_id.push(parseInt(templates[k]["id"]));
                        }else{
                            template_id.push(parseInt(templates[k]));
                        }
                    }
                    templates = template_id.join(',');
                }

            } catch (err) {
                templates = '';
            }

            if(templates){
                user_package_tmp_id+= templates+',';
                i++;
            }else{
                i++;
            }
        }

        user_package_tmp_id = user_package_tmp_id.substring(0,user_package_tmp_id.length-1);

        _this.conn.query("SELECT * FROM `templates` WHERE id in ("+user_package_tmp_id+") and templates.status='complete' and templates.child = 0 ORDER BY `templates`.`name` ",function(err,templates_packages){
            var query = ''; return callback(templates_packages);
            if(err){
                templates_packages = [];
                query = "SELECT * FROM `templates` WHERE templates.status='complete' and templates.child = 0 ORDER BY `templates`.`date` DESC";
            }else{
                query = "SELECT * FROM `templates` WHERE id in ("+user_package_tmp_id+") and templates.status='complete' and templates.child = 0 ORDER BY `templates`.`date` DESC";
            }

            if(query){
                 _this.conn.query("SELECT * FROM `templates` WHERE id not in ("+user_package_tmp_id+") and templates.status='complete' and templates.child = 0 ORDER BY `templates`.`date` DESC",function(err,templates_not_packages){
                    if(err){
                        callback(false);
                    }else{
                        templates_packages = templates_packages.concat(templates_not_packages);

                    }
                })
            }else{
                callback(false);
            }
        })
    });
};

VideoTemplates.prototype.get_category= function (template_category,index,callback) {
    var _this = this,
        query = '';

    try {
        var template_category = JSON.parse(template_category);

        if(typeof template_category === 'object')
            template_category = template_category.join(',');

    } catch (err) {
        var template_category = new Array();
    }

    query = "SELECT * FROM `templates_category` WHERE  templates_category.id in ("+template_category+")";

    if(query != ''){
        _this.conn.query(query,function(err,rows){
            if(err){
                callback(false,index);
                return false;
            }
            if(rows.length){
                callback(rows,index);
                return false;
            }else{
                callback(false,index);
                return false;
            }

        })
    }else{
        callback(false,index);
        return false;
    }
}


VideoTemplates.prototype.get_templates_child= function (child,callback) {
  var _this = this;
    _this.conn.query("SELECT * FROM `templates` WHERE templates.status='complete' and templates.child = "+child,function(err,rows){
        if(err){
             callback(err);
            return false;
        }
        if(rows.length){
            for (i in rows) {
                _this.get_category(rows[i]['templates_category_id'],i,function(category,index){
                    rows[index]['category'] = category;
                    if(index == rows.length-1){
                        callback(rows);
                    }
                })
            };
        }
        else callback(false);

    })
}
VideoTemplates.prototype.edit_template= function () {




}

/* templates_logos table functional*/
VideoTemplates.prototype.insert_logo= function (original_name,file_name,path,callback) {
    var query="insert into templates_logos (original_name,file_name,date,path) values(?,?,?,?);";
    this.conn.query(query,[original_name,file_name,moment().format('YYYY-MM-DD'),path],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);
    })
}

VideoTemplates.prototype.get_logos= function (callback) {
    this.conn.query("select * from templates_logos;",function(err,rows){
        if(err)return callback(err);
        if(rows.length)return callback(null,rows);
        callback(false);
    })
}




VideoTemplates.prototype.save_user_videos= function (project_id,template_id,json_data,date,video_name,percent,callback) {
    var query="insert into user_videos (template_id,project_id,json_data,date,user_id,status,video_name,percent) values(?,?,?,?,?,?,?,?)";
    this.conn.query(query,[template_id,project_id,json_data,date,this.user_id,'pending',video_name,percent],function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);

    })
}

VideoTemplates.prototype.update_user_videos= function (id,json_data,video_name,percent,callback) {
    var query="update user_videos SET json_data = '"+json_data+"', video_name='"+video_name+"',percent="+percent+" WHERE id = '"+id+"'";
    this.conn.query(query,function(err,rows){
        if(err)return callback(err);
        if(rows.affectedRows)return callback(null,rows.insertId);
        callback(false);

    })
}


VideoTemplates.prototype.get_logo_template_fields = function (callback) {

    var query="select * from logo_templates";
    this.conn.query(query, function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows);
        else callback(false);
    });
}

VideoTemplates.prototype.get_my_videos= function (order,count, callback) {
//console.log('get_my_videos------------------------------------------------------');
    if(order == null || order == "all"){
//console.log('if')
        //var query="select * from user_videos where user_id=?";
        // var query="SELECT `user_videos`.* , `templates`.`name`,templates_category.id as category_id  FROM `user_videos` LEFT JOIN `templates` ON `templates`.`id` = `user_videos`.`template_id` LEFT JOIN `templates_category` ON `templates_category`.`id` = `templates`.`id`  WHERE user_id=? LIMIT "+count+",100";
        var query="SELECT `user_videos`.* , `templates`.`cover_photo`,`templates`.`name`,`templates`.`templates_category_id`  FROM `user_videos` LEFT JOIN `templates` ON `templates`.`id` = `user_videos`.`template_id` WHERE user_id=? ORDER BY id DESC";
//console.log(query);
        this.conn.query(query,[this.user_id],function(err,rows){
            if(err)throw err;
//7console.log(rows);
            if(rows.length)callback(rows);
            else callback(false);

        })

    }else{

        var query="select * from user_videos where user_id=? order by id desc";

        this.conn.query(query,[this.user_id, order],function(err,rows){
            if(err)throw err;

            if(rows.length)callback(rows);
            else callback(false);

        })
    }



}

VideoTemplates.prototype.delete_user_video= function (id, callback) {
    var query='DELETE FROM `user_videos` WHERE id = ?';

    this.conn.query(query,[id],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })
}

VideoTemplates.prototype.get_videos_by_id= function (id,callback) {
    //var query="select * from user_videos where id=?";
    var query="SELECT *,user_videos.json_data AS video_json FROM `user_videos` JOIN templates ON user_videos.template_id = templates.id  WHERE user_videos.id = ?";
    this.conn.query(query,[id],function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows[0]);
        else callback(false);

    })



}

VideoTemplates.prototype.get_all_pending_videos= function (callback) {
    var query="select * from user_videos where status=?";
    this.conn.query(query,'pending',function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows);
        else callback(false);

    })



}

VideoTemplates.prototype.get_user_id_pending_videos= function (id,callback) {
    var query="select * from user_videos where id=?";
    this.conn.query(query,[id],function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows[0]);
        else callback(false);

    })



}

VideoTemplates.prototype.update_user_videos_pending= function (id,file_location,callback) {
    var query="update user_videos SET file_location = ?, status = ? WHERE id = ?";
    this.conn.query(query,[file_location,'completed',id],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(rows);
        else callback(false);

    })



}

VideoTemplates.prototype.update_template_status= function (status,callback) {
    var query="update templates SET  status = ? WHERE id = ?";
    this.conn.query(query,[status,this.template_id],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(rows);
        else callback(false);
    })
}

VideoTemplates.prototype.insert_music= function (music_path,music_name,create_date,callback) {
    var query="insert into music (user_id,template_id,music_path,music_name,create_date) values(?,?,?,?,?)";
    this.conn.query(query,[this.user_id,this.template_id,music_path,music_name,create_date],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows.insertId);
        else callback(false);

    })

}

VideoTemplates.prototype.get_music_all= function (callback) {
    var query="select * from music where user_id=? and template_id=?";
    this.conn.query(query,[this.user_id,this.template_id],function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows);
        else callback(false);

    })

}

VideoTemplates.prototype.get_music= function (id,callback) {
    var query="select * from music where id=? and user_id=? and template_id=?";
    this.conn.query(query,[id,this.user_id,this.template_id],function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows[0]);
        else callback(false);

    })

}

VideoTemplates.prototype.delete_music= function (id,callback) {
    var query="DELETE FROM `music` WHERE id=? and user_id=? and template_id=?";
    this.conn.query(query,[id,this.user_id,this.template_id],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(id);
        else callback(false);

    })

}

VideoTemplates.prototype.templates_category_all= function (callback) {
    var query="select * from templates_category";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows);
        else callback(false);

    })

}

VideoTemplates.prototype.insert_category= function (name,callback) {
    var query="insert into templates_category (name)values(?)";
    this.conn.query(query,[name],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows.insertId);
        else callback(false);

    })

}

VideoTemplates.prototype.delete_category= function (id,callback) {
    var query="DELETE FROM `templates_category` WHERE id ="+id;
    this.conn.query(query,function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);
    })

}


VideoTemplates.prototype.get_templates_category_by_id= function (name,callback) {
    var query="select * from templates_category where name=?";
    this.conn.query(query,[name],function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows[0]);
        else callback(false);

    })

}

VideoTemplates.prototype.get_templates_category_all= function (callback) {
    this.conn.query("SELECT * FROM templates",function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows);
        else callback(false);

    })

}

VideoTemplates.prototype.insert_plan= function (name,callback) {
    var query="insert into plans (name)values(?)";
    this.conn.query(query,[name],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows.insertId);
        else callback(false);

    })

}

VideoTemplates.prototype.delete_plan= function (id,callback) {
    var query="DELETE FROM `plans` WHERE id ="+id;
    this.conn.query(query,function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);
    })

}

VideoTemplates.prototype.upadet_plan= function (id,name,callback) {
    this.conn.query("update plans set name=? where id=?",[name,id],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);

    })

}

/*
VideoTemplates.prototype.create_new_template= function (max_duration,template_name,file_name,cover_photo,templates_category_id,type,aep,desc,target,aep_path,keyword,notes,folder,plan,price,json_data,callback) {
    this.conn.query("insert into templates (max_duration,name,date,file_name,cover_photo,templates_category_id,aep,type,target,description,aep_file,status,keyword,notes,folder,plans_id,price,json_data)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [max_duration,template_name,moment().format('YYYY-MM-DD'),file_name,cover_photo,templates_category_id,aep,type,target,desc,aep_path,'not_done',keyword,notes,folder,plan,price,json_data],function(err,rows){
            if(err)throw err;
            if(rows.affectedRows)callback(rows.insertId);
            else callback(false);

        })

}
*/
VideoTemplates.prototype.create_new_template= function (child,max_duration,template_name,file_name,cover_photo,type,aep,desc,target,aep_path,keyword,notes,folder,price,json_data,music,callback) {
    this.conn.query("insert into templates (child,max_duration,name,date,file_name,cover_photo,aep,type,target,description,aep_file,status,keyword,notes,folder,price,json_data,music)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [child,max_duration,template_name,moment().format('YYYY-MM-DD'),file_name,cover_photo,aep,type,target,desc,aep_path,'not_done',keyword,notes,folder,price, json_data,music ],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows.insertId);
        else callback(false);

    })

}
// (child,max_duration,name,file_name,cover_photo,templates_category_id,type,aep,description,target,aep_file,keyword,notes,'/'+folder,plans_id,price,JSON.stringify(json_data)
VideoTemplates.prototype.create_chaild_template= function (child,max_duration,template_name,file_name,cover_photo,templates_category_id,type,aep,desc,target,aep_path,keyword,notes,folder,plans_id,price,json_data,callback) {
    this.conn.query("insert into templates (child,max_duration,name,date,file_name,cover_photo,templates_category_id,aep,type,target,description,aep_file,status,keyword,notes,folder,price,json_data,plans_id)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [child,max_duration,template_name,moment().format('YYYY-MM-DD'),file_name,cover_photo,templates_category_id,aep,type,target,desc,aep_path,'not_done',keyword,notes,folder,price, json_data,plans_id],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows.insertId);
        else callback(false);

    })

}

VideoTemplates.prototype.update_template= function (id,data,callback) {
    this.conn.query("update templates set json_data=? where id=?",[JSON.stringify(data),id],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);

    })

}

VideoTemplates.prototype.update_template_json_data= function (id,json_data,callback) {
    this.conn.query("update templates set json_data=? where id=?",[json_data,id],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);

    })

}

VideoTemplates.prototype.delete_template= function (id,callback) {
    var query="DELETE FROM `templates` WHERE id=?";
    this.conn.query(query,[id],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(id);
        else callback(false);

    })

}



VideoTemplates.prototype.insert_template_data=function(template_id,json_data,date,callback){
    this.conn.query("insert into template_data (template_id,json_data,date,status,user_id) values(?,?,?,?,?)",[template_id,json_data,date,'pending',this.user_id],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);

    })




}

VideoTemplates.prototype.update_template_aep=function(template_id,aep,callback){
    this.conn.query("update templates set aep=? where id=?",[aep,template_id],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);

    })




}

VideoTemplates.prototype.plans_all= function (callback) {
    var query="select * from plans";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows);
        else callback(false);

    })

}

VideoTemplates.prototype.icon_group_insert= function (name,group_json,callback) {

    var _this = this;
    var query="insert into icon_group (name,group_json,date) values(?,?,?)";
    this.conn.query(query,[name,group_json,moment().format('YYYY-MM-DD')],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)return callback(rows.insertId);
        callback(false);

    })
}

VideoTemplates.prototype.get_icon_group = function (id,callback) {
    var _this = this;
    var query="select * from icon_group where id=?";
    this.conn.query(query,[id],function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows[0]);
        else callback(false);

    })

};

VideoTemplates.prototype.get_icon_group_all = function (callback) {
    var _this = this;
    var query="select * from icon_group";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.length)callback(rows);
        else callback(false);

    })

};

VideoTemplates.prototype.update_template_icon_group = function (icon_groups,callback) {
    var _this = this;
    var query="update templates SET icon_groups = '"+icon_groups+"' WHERE id = '"+_this.template_id+"'";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })

};

VideoTemplates.prototype.update_template_graphic_status = function (graphic,callback) {
    var _this = this;
    var query="update templates SET graphic = '"+graphic+"' WHERE id = '"+_this.template_id+"'";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })

};

VideoTemplates.prototype.get_icon_group_templates = function (templates_icons,callback) {

    var _this = this;
    if(Object.keys(templates_icons).length){
        var query="select * from icon_group where";
        for(var i = 1 ; i <= Object.keys(templates_icons).length ; i++){

            if(i == 1){
                query+=' id ='+templates_icons[i];
            }else{
                query+=' or id ='+templates_icons[i];
            }
            if(i == Object.keys(templates_icons).length){
                 _this.conn.query(query,function(err,rows){
                    if(err)throw err;

                    if(rows.length)callback(rows);
                    else callback({});
                })
            }
        }
    }else{
        callback({});
    }

};

VideoTemplates.prototype.insert_user_icon= function (user_id,path,type,callback) {

    var _this = this;
    var query="insert into user_icons (user_id,path,type,date) values(?,?,?,?)";
    this.conn.query(query,[user_id,path,type,moment().format('YYYY-MM-DD')],function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)return callback(rows.insertId);
        callback(false);

    })
};

VideoTemplates.prototype.get_user_icons=function(user_id,callback){
    var sql="select * from user_icons where user_id=?;"
console.log(user_id);
    this.conn.query(sql,[user_id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }else{
            callback(false);
        }
    })
};

VideoTemplates.prototype.update_template_plan = function (plan,callback) {
    var _this = this;
    var query="update templates SET plans_id = '"+plan+"' WHERE id = '"+_this.template_id+"'";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })

};

VideoTemplates.prototype.check_user_packages = function (user_packages,price,callback) {
    var template_price = 0,
        is_valid = false,
        is_package_have_value = false,
        packages_query = "SELECT * FROM `packages` WHERE `name` in (?)",
        _this = this;

    this.conn.query(packages_query,[user_packages],function(err,packages_row){
        if(err) callback(true);

        for(i in packages_row){
            var package = packages_row[i];

            try{
                var templates = JSON.parse(package.templates);
            }catch(e){
                var templates = [];
            }

            if(templates.indexOf(_this.template_id) > -1){
                is_valid = true
            }

            for(j in templates){
                if(typeof templates[j] == 'object'){
                    if(templates[j]["id"] == _this.template_id){
                        if(template_price == 0){
                            template_price = templates[j]["price"];
                            is_package_have_value = true;
                            is_valid = true;
                        }

                        if(templates[j]["price"] < template_price){
                            template_price = templates[j]["price"];
                            is_package_have_value = true;
                            is_valid = true;
                        }
                    }
                }
            }
        }

        if(!is_package_have_value)
            template_price = price;

        if(is_valid)callback(false,is_valid,template_price);
        else callback(true);
    })
};

VideoTemplates.prototype.packages = function (callback) {
    var _this = this;
    var query="select * from packages";
    this.conn.query(query,function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }else{
            callback(false);
        }

    })

};

VideoTemplates.prototype.update_package_templates = function (packages_price,package_checked,template_id,callback) {
    var _this = this,
        packages_str = '';

    if(typeof package_checked == 'undefined')
        package_checked = [];

    _this.packages(function(rows) {
        if(rows){
            for (var i = 0 ; i < rows.length;i++) {
                var templates = [];
                try{
                    if(rows[i].templates != ''){
                        templates = JSON.parse(rows[i].templates);
                    }

                    if(!templates)
                        templates = [];
                }catch(e){
                    templates = [];
                }

                // remove template Id from other peckages
                if(package_checked.indexOf(rows[i].id) == -1){
                    if(templates.indexOf(template_id) > -1){
                        var index = templates.indexOf(template_id);
                        templates.splice(index, 1);
                    }else{
                        for(j in templates){
                            if(typeof templates[j] === 'object'){
                                if(templates[j].id == template_id){
                                    templates.splice(j, 1);
                                }
                            }
                        }
                    }
                }

                for(k in package_checked){
                    var package_id = package_checked[k];

                    if(package_id == rows[i].id){
                        if(templates.indexOf(template_id) > -1){
                            var index = templates.indexOf(template_id);
                            templates.splice(index, 1);
                            templates.push({'id':template_id,'price':packages_price[package_id]});
                            packages_str+= rows[i].name+', ';
                        }else{
                            var exist = false;
                            for(j in templates){
                                if(typeof templates[j] === 'object'){
                                    if(templates[j].id == template_id){
                                        packages_str+= rows[i].name+', ';
                                        exist = true;
                                        templates[j].price = packages_price[package_id];
                                    }
                                }
                            }
                            if(!exist){
                                packages_str+= rows[i].name+', ';
                                templates.push( {'id':template_id,'price':packages_price[package_id]});
                            }
                        }
                    }
                }

                _this.update_package(rows[i].id,JSON.stringify(templates),function(success){})
            }
            _this.packages(function(packages_rows) {
                callback(packages_rows,packages_str);
            })
        }
    })
};

VideoTemplates.prototype.update_package = function (id,templates,callback) {
    var query="update packages SET templates = '"+templates+"' WHERE id = '"+id+"'";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })
};

VideoTemplates.prototype.get_package_templates=function(id,callback){
    var sql="select * from packages where id=?;"
    this.conn.query(sql,[id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows[0]);
            return true;
        }else{
            callback(false);
        }
    })
};

VideoTemplates.prototype.get_plans_templates=function(id,callback){
    var sql="select * from plans where id=?;"
    this.conn.query(sql,[id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows[0]);
            return true;
        }else{
            callback(false);
        }
    })
};

VideoTemplates.prototype.update_plans_templates = function (plans,template_id,callback) {

    var query="update templates SET plans_id = '"+plans+"' WHERE id = '"+template_id+"'";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })
};

VideoTemplates.prototype.get_categorys_templates=function(id,callback){
    var sql="select * from templates_category where id=?;"
    this.conn.query(sql,[id],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows[0]);
            return true;
        }else{
            callback(false);
        }
    })
};

VideoTemplates.prototype.update_categorys_templates = function (categorys,template_id,callback) {
    var query="update templates SET templates_category_id = '"+categorys+"' WHERE id = '"+template_id+"'";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })
};


VideoTemplates.prototype.get_plan= function (template_plan,index,callback) {
    var _this = this,
        query = '';

    try {
        var template_plan = JSON.parse(template_plan);

        if(typeof template_plan === 'object')
            template_plan = template_plan.join(',');

    } catch (err) {
        var template_plan = new Array();
    }

    query = "SELECT * FROM `plans` WHERE  plans.id in ("+template_plan+")";

    if(query != ''){
        _this.conn.query(query,function(err,rows){
            if(err){
                callback(false,index);
                return false;
            }
            if(rows.length){
                callback(rows,index);
                return false;
            }else{
                callback(false,index);
                return false;
            }

        })
    }else{
        callback(false,index);
        return false;
    }
}


VideoTemplates.prototype.get_all_categorys_slides = function (callback) {
    var _this = this;
    var query="select * from templates_slides_category";
    this.conn.query(query,function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows);
            return true;
        }else{
            callback(false);
        }

    })

};

VideoTemplates.prototype.insert_package= function (name,credits,token,callback) {
    var query="insert into packages (name,credits,token)values(?,?,?)";
    this.conn.query(query,[name,credits,token],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(rows.insertId);
        else callback(false);

    })

}

VideoTemplates.prototype.edit_package = function (id,name,credits,callback) {
    var query="update packages SET name = '"+name+"',credits = '"+credits+"' WHERE id = '"+id+"'";
    this.conn.query(query,function(err,rows){
        if(err)throw err;

        if(rows.affectedRows)callback(true);
        else callback(false);

    })
};

VideoTemplates.prototype.delete_package= function (id,callback) {
    var query="DELETE FROM `packages` WHERE id ="+id;
    this.conn.query(query,function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);
    })

}

VideoTemplates.prototype.check_package_token= function (token,callback) {
    var query="select * FROM `packages` WHERE token ='"+token+"'";
    console.log(query);
    this.conn.query(query,function(err,rows){

        if(err)throw err;
        if(rows)callback(rows[0]);
        else callback(false);
    })

}

VideoTemplates.prototype.upadet_category= function (id,name,callback) {
    this.conn.query("update templates_category set name=? where id=?",[name,id],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows)callback(true);
        else callback(false);

    })

}
module.exports=VideoTemplates;



