/**
 * Created by aleksa on 2/20/16.
 */
var moment=require('moment'),
    Promise = require("bluebird"),
    DataClay=require('../../Api/dataclay/DataClay');






var Credits={};
Credits.init=function(conn,user_id){
    this.user_id=user_id;
    this.conn=conn;
    this.rendering_price=1;//in credits
    return Promise.resolve(this);
}




Credits.get_user_credits=function(that){
console.log('get user credits')
    var sql="Select * from users where id=? limit 1";
    var credits={};
    credits.credits=0;
    credits.bonus=0;

     return new Promise(function(resolve,reject){
         that.conn.query(sql,[that.user_id],function(err,rows){
             if(err)return reject(err);
                 credits.credits= parseInt(rows[0].credits);
                 credits.bonus= parseInt(rows[0].bonus);
                 resolve(credits);
         })
     })

}





Credits.update_bonus=function(that,num){
    var sql="Update users set bonus=? where id=?";
    return new Promise(function(resolve,reject){
        that.conn.query(sql,[num,that.user_id],function(err,rows){
            if(err)return reject(err);
            if(rows.changedRows) return resolve(true)
            return reject(false);
        })
    })
}




Credits.update_credits=function(that,num){
    var sql="Update users set credits=? where id=?";
    return new Promise(function(resolve,reject){
        that.conn.query(sql,[num,that.user_id],function(err,rows){
            if(err)return reject(err);
            //if(rows.changedRows)
            return resolve(true)
            //return reject(false);
        })
    })
}





Credits.charge_rendering=function(obj){
    var that=obj.credits,
        price = obj.price,
        credits=obj.user_credits;

console.log(obj.rows.price)
    return new Promise(function(resolve,reject){
       /* if(credits.bonus){
            that.update_bonus(that,credits.bonus-1)
                .then(function(valid){
                    if(valid)return resolve();
                    return reject('bonus');
                })

        }else*/ if(credits.credits){
            that.update_credits(that,credits.credits-price)
                .then(function(valid){
                    if(valid)return resolve();
                    return reject('credits!!!');
                })

        }else{
            return reject("no credits ");
        }



    })



}

Credits.check_credits=function(credits){console.log('check credits')
    if(credits.bonus||credits.credits)return Promise.resolve(credits);
    return Promise.resolve(false);
}







Credits.middleware=function(req,res,next){
   
    if(!req.session.user||! req.session.user.id){
        next();
        return false;
    }
    req.getConnection(function(err, connection) {
        if (err) return next(err);
       var q="select * from users where id=? ";


        connection.query(q,[req.session.user.id],function(err,rows){
            if(err)throw err;
           // console.log(rows);
            if(!rows.length)return next();
            req.credits=rows[0].credits;
            req.is_admin = (rows[0].admin == 1)?true:false;
            next();
        })
    });





}






module.exports=Credits;










