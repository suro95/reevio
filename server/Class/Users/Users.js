/**
 * Created by aleksa on 1/30/16.
 */
var validator = require('validator'),
 bcrypt = require("bcryptjs"),
//bcrypt = '',
    moment=require('moment');




function Users(conn){
 this.conn=conn;
    this.reg_validation={};
    this.reg_post={
        'email':'',
        'password':'',
        repassword:'',
        agree:''
     };



}
Users.prototype.test=function(){
    var password='test';
    bcrypt.genSalt(10, function(err, salt) {
        if(err)throw err;
        bcrypt.hash(password, salt, function(err, hash) {
            if(err)throw err;
           console.log(hash);
        });
    });

}
Users.prototype.create_new_user=function(email,password,credits,packages,callback){
    var that=this;
    bcrypt.genSalt(10, function(err, salt) {
        if(err)throw err;
        bcrypt.hash(password, salt, function(err, hash) {
            if(err)throw err;
            that.conn.query("insert into users (email,password,credits,date,packages) values(?,?,?,?,?) ",[email,hash,credits,moment(new Date()).format("YYYY-MM-DD"),packages,callback],function(err,rows){
                if(err)throw err;
                if(rows.affectedRows)callback(true,rows.insertId);
                else callback(false);


            })





        });
    });






}



Users.prototype.validate_user_registration= function (post,callback) {

    var requred=['email','password','repassword'],
        that=this;
    this.check_property(requred,post,function(check_prop){
            if(check_prop){

                that.reg_post.email=post.email;
                that.reg_post.password=post.password;
                that.reg_post.repassword=post.repassword;

                if(!validator.isEmail(post.email)){
                    that.reg_validation.email='Email address is not valid!';
                }if(post.password.trim().length<5){
                    that.reg_validation.password='Password must be more than five characters length!';
                }else if(post.password.trim()!==post.repassword.trim()){
                    that.reg_validation.repassword='Passwords are not the same';
                }if(!('agree' in post)){
                    that.reg_validation.agree='This field is requred';
                }else{
                    that.reg_post.agree='checked';
                }
                if(Object.keys(that.reg_validation).length){
                    callback(false);
                    return false;
                }
                that.check_user_email(post.email,function(validate){

                    if(!validate){
                        that.reg_validation.email="User with that email address already exists!";
                    }

                    callback(validate);

                })


            }




   })









}

Users.prototype.check_user_email=function(email,callback){
    this.conn.query("select * from users where email=? ",[email],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(false);
        }else{
            callback(true);
        }


    })



}



Users.prototype.check_property=function(keys,obj,callback){
    for(var i= 0,l=keys.length;i<l;i++){
        if(!(keys[i] in obj)){
            callback(false);
            return false;
        }
    }
    callback(true);
}



// Users.prototype.validate_login=function(post,callback){
//     var that=this;
//     this.check_property(['email','password'],post,function(check_prop){
//         if(check_prop){
//          //   console.log('prop checked')
//             if(validator.isEmail(post.email)&&post.password.trim().length>=5){
//                 that.validate_user_pass(post.email,post.password,function(validation,user_id){
//                     if(validation)callback(true,user_id);
//                     else callback(false);

//                 })
//             }else{
//                 callback(false);
//             }



//         }else{

//                 callback(false);
//         }





//     });



// }

Users.prototype.validate_login=function(post,callback){
    var that=this;
    var success = true;
    var pass_err = '';
    var email_err = '';

    if(!post.email){
        success = false;
        email_err = 'This value is required';
    }

    if(!post.password){
        success = false;
        pass_err = 'This value is required';
    }

    if(success){
        if(!validator.isEmail(post.email)){
            success = false;
            email_err = 'Email address is not valid!';
        }

        if(post.password.trim().length < 5){
            success = false;
            pass_err = 'Password must be more than five characters length!';
        }

        if(success){
            that.validate_user_pass(post.email,post.password,function(validation,user_data){

                if(validation){
                    callback(true,user_data,email_err,pass_err);
                }else{
                    email_err = 'The entered email address is incorrect',
                    pass_err = 'The entered password is incorrect';
                    callback(false,false,email_err,pass_err);
                }
            })
        }else{
            callback(false,false,email_err,pass_err);
        }
    }else{

        callback(false,false,email_err,pass_err);
    }

}

Users.prototype.validate_email=function(post,callback){
    var that=this;
    var success = true;
    var email_err = '';

    if(!post.email){
        success = false;
        email_err = 'This value is required';
    }

    if(success){
        if(!validator.isEmail(post.email)){
            success = false;
            email_err = 'Email address is not valid!';
        }

        if(success){
            that.check_user_email_get_user_id(post.email,function(validation,row){

                if(validation){
                    callback(true,row,email_err);
                }else{
                    callback(true,false,email_err);
                }
            })
        }else{
            callback(false,false,email_err);
        }
    }else{

        callback(false,false,email_err);
    }

}

Users.prototype.validate_email_register=function(post,callback){
    var that=this;
    var success = true;
    var email_err = '';

    if(!post.email){
        success = false;
        email_err = 'This value is required';
    }

    if(success){
        if(!validator.isEmail(post.email)){
            success = false;
            email_err = 'Email address is not valid!';
        }

        if(success){
            that.check_user_email_get_user_id(post.email,function(validation,row){

                if(validation && row == false){
                    callback(true,email_err);
                }else{
                    email_err = "There's user registered with that email";
                    callback(false,email_err);
                }
            })
        }else{
            callback(false,false,email_err);
        }
    }else{

        callback(false,false,email_err);
    }

}

Users.prototype.check_user_email_get_user_id=function(email,callback){
    this.conn.query("select * from users where email=? ",[email],function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(true,rows[0]);
        }else{
            callback(true,false);
        }


    })



}

Users.prototype.create_token=function(user_id,token,callback){
    this.conn.query("INSERT INTO `token_password`(`user_id`, `token`, `date`) VALUES (?,?,?) ",[user_id,token,moment(new Date()).format("YYYY-MM-DD HH:mm")],function(err,rows){
        if(err)throw err;
        if(rows.affectedRows){
            callback(true);
        }else{
            callback(false);
        }


    })



}

Users.prototype.check_token=function(token,callback){
    this.conn.query("select * from token_password where token='"+token+"' and date > '"+moment(new Date()).subtract(1, 'day').format("YYYY-MM-DD HH:mm")+"' ORDER BY `token_password`.`id` DESC",function(err,rows){
        if(err)throw err;
        if(rows.length){
            callback(rows[0]);
        }else{
            callback(false);
        }


    })



}

Users.prototype.validate_user_pass=function(email,pass,callback){

    this.conn.query("select * from users where email=? ",[email],function(err,rows){
        if(err)throw err;
      //  console.log(rows);
       if(rows.length){
//console.log(rows[0].password);
                   bcrypt.compare(pass, rows[0].password, function(err, res) {
                       callback(res,rows[0]);
                   });
      }else{
           callback(false);
       }

    })


}


Users.prototype.get_user_data=function(user_id,callback){
    this.conn.query("select * from users where id=? ",[user_id],function(err,rows){
        if(err)throw err;
        if(rows.length) callback(rows[0]);
        else callback([]);

    })



}
Users.prototype.change_password=function(user_id,pass){
    var that=this;
    bcrypt.genSalt(10, function(err, salt) {
        if(err)throw err;
        bcrypt.hash(pass, salt , function(err, hash) {
            if(err)throw err;
            that.conn.query("UPDATE users SET password=? where id=? ",[hash,user_id],function(err,rows){
                if(err)throw err;



            })





        });
    });


}
Users.prototype.change_useremail=function(user_id,useremail){
    var that=this;
    that.conn.query("UPDATE users SET email=? where id=? ",[useremail,user_id],function(err,rows){
        if(err)throw err;
    })
}

Users.prototype.change_username=function(user_id,name,callback){
    var that=this;
    that.conn.query("UPDATE users SET name=? where id=? ",[name,user_id],function(err,rows){
        if(err)throw err;
        if(rows){
            callback(true);
        }else{
            callback(false);
        }
    })
}

Users.prototype.update_last_time_login=function(user_id){
    var query='UPDATE users set last_login=? where id=?';
    this.conn.query(query,[moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),user_id],function(err,rows){
        if(err)throw err;
    })

}
Users.prototype.get_last_time_login=function(user_id,callback){
    var query='select last_login from users where id=?';
    this.conn.query(query,[user_id],function(err,rows){
        if(err)throw err;
        callback(rows[0].last_login);
    })

}

Users.prototype.update_template=function(template_id, tmplate_data, callback){
    var query="UPDATE templates SET json_data=? WHERE id=?";

    this.conn.query(query,[tmplate_data,template_id],function(err, rows){
        if(err)throw err;
        if(rows.affectedRows){
            callback(true);
        }else{
            callback(false);
        }
    });
}

Users.middleware=function(req,res,next){
    if(!req.session.user || !req.session.user.id){
        next();
        return false;
    }
    req.getConnection(function(err, connection) {
        if (err) return next(err);
       var q="Select * from users where id=?";


        connection.query(q,[req.session.user.id],function(err,rows){
            if(err)throw err;

            if(rows.length){
                try{
                    req.packages = JSON.parse(rows[0].packages);
                }catch(e){
                    req.packages = [];
                }
            }else{
                req.packages = [];
            }
            next();
        })
    });
}

module.exports=Users;













