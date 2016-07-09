/**
 * Created by aleksa on 3/14/16.
 */

//adapter patern
var video_templates=require('./VideoTemplates'),
   // video=require('./Video'),
    Promise=require("bluebird"),
    credits=require("../Users/Credits"),
    moment=require('moment');


var VideoAdapter={};

VideoAdapter.init=function(conn,post,user_id,user_packages){
   // console.log(post);
return Promise.resolve({
        video_templates:new video_templates(conn,post.template_id,user_id),
        credits:Object.create(credits),
        post:post,
        user_id:user_id,
        user_packages:user_packages,
        conn:conn
    })
}
/*
VideoAdapter.video_templates=function(conn,template_id,user_id){
    return Promise.resolve(new video_templates(conn,template_id,user_id));
}
*/
VideoAdapter.video_templates_get_by_id=function(obj){
var video_templates=obj.video_templates;
    return new Promise(function(resolve,reject){
        video_templates.get_template_by_id(function(err,rows){
            if(err)return reject(err);
            obj.rows=rows;
            return resolve(obj);
        });
    });
}


VideoAdapter.validate_user_data=function(obj){
    var rows=obj.rows,
        post=obj.post,
        user_data=post.slider_data,
        template_data,
        name_data,
        reject_msg=[],
        max= 0,
        user_value="";

    try{
        template_data=JSON.parse(rows.json_data);
    }catch(e){
        reject_msg.push("template_data_error");
        return Promise.reject(reject_msg)
    }
    try{
        user_data=JSON.parse(user_data);
    }catch(e){
        reject_msg.push("user data error");
        return Promise.reject(reject_msg)
    }

    var my_InsertedTempladeData = {},
		success = true;

	for(var position_id in user_data){
		var slide_id = Object.keys(user_data[position_id])[0];
		for(var key in template_data[slide_id]){
			if(typeof template_data[slide_id][key] === 'object' && template_data[slide_id][key] !== null){

				if(typeof user_data[position_id][slide_id][key] != typeof undefined){

					if(Object.keys(template_data[slide_id][key]).length != Object.keys(user_data[position_id][slide_id][key]).length){
						success = false;
						break;
					}
				}else{
					success = false
					break;
				}

			}
		}
	}

    if(success)return Promise.resolve(obj);
    return Promise.reject({"validation": "The Validation isn't ok"});
}






VideoAdapter.check_user_credits=function(obj){ 
    var Credits=obj.credits;
    //console.log(Credits);
    return new Promise(function(resolve,reject){
        Credits.init(obj.conn,obj.user_id)
            .then(Credits.get_user_credits)
            .then(Credits.check_credits)
            .then(function(have_credits){
                console.log(have_credits);
                if(have_credits){
                    obj.user_credits=have_credits;
                    return resolve(obj);
                }
               return reject({"validation": "Not enough credits."});

            })

    })
}


VideoAdapter.save_user_video=function(obj){
    var video_templates=obj.video_templates,
        project_id= 1,
        date=moment().format('YYYY-MM-DD'),
        template_id=obj.post.template_id,
        video_name=obj.post.video_name,
        json_data=obj.post.slider_data,
        percent=obj.post.percent;
    return new Promise(function(resolve,reject){
        video_templates.save_user_videos(project_id,template_id,json_data,date,video_name,percent,function(err,rows){
            if(err)return reject(err);
            obj.inserted_id=rows;
            return resolve(obj);
         })
     })
}

VideoAdapter.update_user_video=function(obj){
    var video_templates=obj.video_templates,
        project_id= 1,
        date=moment().format('YYYY-MM-DD'),
        json_data=obj.post.slider_data,
        video_name=obj.post.video_name,
        id=obj.post.id,
        percent=obj.post.percent;
    return new Promise(function(resolve,reject){
        video_templates.update_user_videos(id,json_data,video_name,percent,function(err,rows){
            if(err)return reject(err);
            return resolve(obj);
         })
     })
}


VideoAdapter.charge=function(obj){
    var Credits=obj.credits;

  return new Promise(function(resolve,reject){
      Credits.charge_rendering(obj)
          .catch(function(err){
            reject(err)
          })
          .finally(function(){
                resolve(obj);
          })
  })
}

VideoAdapter.check_user_packages_with_template=function(obj){
    var video_templates=obj.video_templates,
        user_packages = obj.user_packages,
        template = obj.rows;

    return new Promise(function(resolve,reject){
        video_templates.check_user_packages(user_packages,template.price,function(err,is_valid,template_price){
            if(is_valid && !err){
                obj.price = template_price;
                return resolve(obj);
            }else{
                return reject({"validation": "User have not plan for this template."});
            }
        })
    })
}

module.exports=VideoAdapter;