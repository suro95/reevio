/**
 * Created by aleksa on 2/3/16.
 */
require('../functions.js');

var RouterManager={
    conn:false,
    session:false,
    page:false,
    res:false,
    req:false,
    init:function(req, res, next){
        var that=this;
        this.res=res;
        this.req=req;
        if('session' in req)that.session=req.session;

        req.getConnection(function(err, connection) {
            if (err) return next(err);
            that.conn=connection;


            that.page=req.originalUrl.split('/').remove_empty();
            that.route=that.page[0];
            that.page.splice(0,1);
            //console.log("Route: "+that.route);
            //console.log("Page:"+that.page);
            if(Object.keys(that.passeport_need_pages).indexOf(that.route)>-1){
                if(that.route=='member'){
                    that.validate_member(that.page,function(){


                    });
                }

            }else{
                next();
            }





        })


    },
    passeport_need_pages:{
        member:['templates','my-videos','project-view','new-project','order-status','preview-info'],

    },
    validate_member:function(page,callback) {
        if (!this.session) {
            this.res.redirect('/auth/login');
        }
        if (this.req.session.user) {
            next();
            return true;
        }
        this.res.redirect('/auth/login');
    }








    };

















module.exports=RouterManager;






