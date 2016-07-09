/**
 * Created by aleksa on 3/7/16.
 */


var  util = require('util'),
    moment=require('moment'),
    Promise = require("bluebird"),
    request = require('request'),
    GoogleSheets=require('../../Class/Google/Google.js');
var GoogleSpreadsheet = require("google-spreadsheet"),
    ReadJson = require("r-json"),
    google = require('googleapis'),
    GoogleSpreadsheet =require("google-spreadsheet");


    const creds = {
        client_email: 'templater@templater-1244.iam.gserviceaccount.com',
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmI2c0zwOh3SYd\nmEp92P5vopaeJwqnSwaF+9fuZkFEbcDQV7ov2iSER+grCDXAKPdukzFHdqxRpo3I\nl6OjTK857qWdadA7L16vwr7LEmq9C1izFCSCf3T/PmaIs39NFAjJhmxZBMhgnfjO\nEj7I2a3k0tQMJViTBBqXw9eN+pgvauWcwwXevqc2d9B9eOsJMT4/MbYiiaw/Bz4j\n4G1+0UgrIrCY0hrUVa7Br7172zAcMw8oUk9FbRfDql+sglJ3aoEhT+5cVqBDFVRk\nC8YmNpsQHfpzSykMJO3qechM+ukqhC/UJSXVcmXWNCSlq/YP9m0JhvdIn5czdlu/\ntNiSnDb1AgMBAAECggEBAJU6ybJqnFWhImKE76xY5Dp8LZRDd1NLlcF1tMCEAu4n\nM4Ewu6HN7O0Q9d7pUfaYFaCyABqz4xa4ZzSd2LOO5vo/fW2GpS70XrW7VMttcIj8\nDyFT33OEbx/x+gGiUZ93dmkmIF5ZaG84lkrroo+gz4zxPtzmEsiDcCuQEyeJx3cW\ntPV+W1kp4ri2s8/AjULDrI37uEuFcYeNDlEQnLAALSEmTl+fvRjJnHcoqdbG5wJH\nQwOcYsQBIEMP1XZZzpuM8A/aMJzY3SdijD1q0sdcqEVhoOrSadbDZfMFK6/fLaUQ\nDUoKmilWB4s8gtd7/HiTOjW5jvIeWhea36Vi+OwTbKECgYEA68dm/O9g8SxCucxA\nmwObIhUAYFNsKU/bHfWRR0zV3i6SFPs7rOxge+WwZO+EJ9cJqkehrK+yibe9U/yY\nR3RHAkqpbC1EMxtxSZ0BhpF3UFXDe7cpZoWKdzwiCURo0N1c6pNgR0BUQUP3QBWV\nAfUgeFgl9MVH3i3rm9nxlgcwLu0CgYEAtGMFFORVCSfWkeDb/f1CO8yj81n6PhoJ\nKpiAo7PxGjuXBj+EvngrTzx3TGioyB7Uj549ITPTMaWo1AxJHubs+xNVERkObO15\nBE+eJBrHfszWFhVv5nwyGSvuSzUtQMZEtvFjAgIKfKMpwOPIZbJwq0/J8W/QuPKp\n/7b+QjJOHykCgYBcET4m8HaDVkwr7xUfMtZGBbti4dBvhU5DsZtsIxW0L609YikY\nSikW2Eb78wdA41hT1KrOGsF1w3i7rfvskvwTagIkSrzB1Cp1m0h4Op9DkGnICmqx\nLN431xRXWA4x2O6qbqf+yqDb52VJ8eOAoy5tr8YKgWqh2H6TGhSbB+2JtQKBgAzA\nh0Zv0dcg2tlbNRIiikEh+WEltjwXqRg6ybVI7j11gvqtGNxCMIWcd66OI4hqLYqt\nnBKx0DdNR78d0zl9B7nEJxpbVBq9OvXkDwDsZ7f+ERBkmZGIrB39bg4hBz7yBT+N\nlvs4W7dt7XC2aZ9O2woxTMxlpDK+7Oen7xeM6NrpAoGASVAzHUcN5EWJB5tiOqi3\nT7IgBgsyzr0dNbLO1YiHNdNuUwwBWTy9rPDQOwgtTuHW0JyloR3aBKCPNehlEltP\nYh8zI33ide8Q1cgvM7Zb5FE3MR6mgpm7BSxW/sSOl9DQrNlbD52EooZ37KBNUJGD\nEKiAOTcKZi/MHLR3Rg2cq4s=\n-----END PRIVATE KEY-----\n'
    }



const sheet_shema_logo_revial_id='1kQa3VVGWsyP87AKNrY5tiE5lUbbD7cqjQ-ebmCfPJp4';


const phuc_api_url='http://188.214.128.3/videoapi/OrderContent/AddOrder';




/**
 *
 *
 * DataClay class
 *
 * DESC:
 * call when user add new template. Than data are changed and validated
 * and new row is inserted in google sheets
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * @type {{}}
 */
var DataClay={}
DataClay.init=function(conn,user_template_id,template_data){
    var that=this;
    this.conn=conn;
    this.user_template_id=user_template_id;
    this.template_data=template_data;
     // Promise.reject('error')
    return  Promise.resolve(this);



}

DataClay.get_user_template=function(that){
    var query='SELECT uv.id,uv.template_id,uv.json_data,uv.date,uv.user_id,t.aep,t.target,t.type FROM user_videos as uv  left JOIN templates as t on uv.template_id=t.id where uv.id=? ',
        data={};
  return new Promise(function(resolve,reject){
        that.conn.query(query,[that.user_template_id],function(err,rows){
            if(err)return reject(err);
            if(!rows.length) return reject('no rows');
            return resolve({
                data:rows[0],
                that:that
            });



        })


    })
}

DataClay.static_format=function(params){

    var ret_data=[],
        tmp,
        data=params.data,
        template=params.template,
        obj={},
        aep="";
    try{
        var template_json=JSON.parse(template.json_data);
    }catch (e){
        return Promise.reject(e);
    }
    var totalcomp=1;
    for(var i in data){
        obj.aep=params.aep;
        obj.target=params.target;
        obj.id=params.id;
        obj['render-status']=params['render-status'];
        obj.totalcomp=totalcomp;
        obj.output=params.user_id+"_"+params.id+"_"+1//userid_orderid_slidenumber
        for(var y in data[i]){
            tmp=data[i][y];
            for(var y in tmp){
                for(var x in tmp[y]){

                    if(x.indexOf('image')>-1&&tmp[y][x].value.indexOf('http')==-1){
                        obj[x]="http://reevio.com"+tmp[y][x].value.replace('public/','/');

                    }else if(x.indexOf('video')>-1&&tmp[y][x].value.indexOf('http')==-1) {
                        obj[x] = "http://reevio.com" + tmp[y][x].value;


                    }else{
                        obj[x]=tmp[y][x].value;
                    }
                    if(tmp[y][x].color){
                        obj['color'+x.replace('text','')]=tmp[y][x].color.slice(1);
                    }

                }
            }
        }


    }

    return Promise.resolve(JSON.stringify([obj]));


}
DataClay.dynamic_format=function(params){

    var ret_data=[],
        tmp,
        data=params.data,
        template=params.template,
        obj={},
        aep="";
    try{
        var template_json=JSON.parse(template.json_data);
    }catch (e){
        return Promise.reject(e);
    }

var totalcomp=Object.keys(data).length;
    var num=0;
    for(var i in data){

       // console.log(template_json[i]);




        for(var y in data[i]){
         //   console.log(template_json[y].aep)
            aep=template_json[y].aep;
            obj={};
            obj.aep=aep;
            obj.target=params.target;
            obj.id=params.id;
            obj['render-status']=params['render-status'];
            obj.totalcomp=totalcomp;
            obj.output=params.user_id+"_"+params.id+"_"+(++num)//userid_orderid_slidenumber

            tmp=data[i][y];
            for(var y in tmp){
                for(var x in tmp[y]){
                    if(x.indexOf('image')>-1&&tmp[y][x].value.indexOf('http')==-1){
                            obj[x]="http://reevio.com"+tmp[y][x].value;


                    }if(x.indexOf('video')>-1&&tmp[y][x].value.indexOf('http')==-1) {
                        obj[x] = "http://reevio.com" + tmp[y][x].value;


                    }else{
                        obj[x]=tmp[y][x].value;
                    }

                    if(tmp[y][x].color){
                        obj['color'+x.replace('text','')]=tmp[y][x].color.slice(1);
                    }
               }
            }
        }
        ret_data.push(obj);

    }

//console.log(ret_data);
    return Promise.resolve(JSON.stringify(ret_data));

}

DataClay.format_data=function(obj){
   var data=obj.data,
        id=data.id,
        json_data=data.json_data,
        status= 1,
        user_data,
        aep=data.aep,
        type=data.type,
        that=obj.that,
       target=data.target,
       user_id=data.user_id;

    //console.log(that.template_data);

    try{
        user_data=JSON.parse(json_data);
    }catch(e){
        return Promise.reject(e);
    }

    if(type==='dynamic'){
        return new Promise(function(resolve,reject){

// id, render-status, target,output,totalcomp
            DataClay.dynamic_format({
                data:user_data,
                template:that.template_data,
                target:target,
                id:id,
                'render-status':'ready',
                totalcomp:false,
                output:false,//userid_orderid_slidenumber
                user_id:user_id,

            })
                .then(function(formated_data){
                   //  console.log(formated_data);
                    return resolve({
                        id:id,
                        json_data:formated_data,
                        status:1
                    })




                })



        })

        }else{


        return new Promise(function(resolve,reject){


            DataClay.static_format({
                    data:user_data,
                    template:that.template_data,
                    target:target,
                    id:id,
                    'render-status':'ready',
                    totalcomp:false,
                    output:false,//userid_orderid_slidenumber
                    user_id:user_id,
                aep:aep,

                })
                .then(function(formated_data){
                      console.log(formated_data);
                    return resolve({
                        id:id,
                        json_data:formated_data,
                        status:1
                    })




                })



        })







    }

}


DataClay.call_api=function(obj){


//var content=JSON.stringify(obj.json_data).replace(/\\\\/g,'\\');
  //  console.log(content.slice(1,-1));


    var post={
        OrderId:obj.id,
        Content: obj.json_data.slice(1,-1),
        status:obj.status
    };


  console.log(post);

// return Promise.reject('stop');
return new Promise(function(resolve,reject){
    request.post({url:phuc_api_url, form:post}, function(err,httpResponse,body){
      var obj=JSON.parse(body);
        if(obj.result&&obj.result=='success')return resolve('success');
        return reject(obj);

    })
})

}






//depraced
DataClay.validate_data=function(obj){
    var data=obj.data,
        user_data=data.json_data,
        target=data.target,
        user_videos_id=data.id,
        aep=data.aep,
        user_id=data.user_id,
        template_id=data.template_id,
        output,
        that=obj.that;


    try{
        var json_data=JSON.parse(user_data);
    }catch (e){
        return Promise.reject('json in not valid  from database in dataclay validate_data function ');
    }


    var docs_sema= {
        ids: user_videos_id,
        'aep': aep,
        'render-status': 'ready',
        //'output':user_id+"_"+ user_videos_id+ "_" + slide_number,
        'totalcomp': 1,
        'target':target,
        date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  }


// userid_orderid_1
    for(var i in json_data){
        var text_num= 1,
            color_num= 1,
            text_col;

        for(var slide_id in json_data[i]){
            if(json_data[i][slide_id].inputs){
                for( var inp in json_data[i][slide_id].inputs){
                    docs_sema[inp]=json_data[i][slide_id].inputs[inp].value;
                    if(json_data[i][slide_id].inputs[inp].color){
                        docs_sema["color"+inp.split('.')[1]]=json_data[i][slide_id].inputs[inp].color.slice(1);
                    }
                }


            } if(json_data[i][slide_id].images){
                for( var inp in json_data[i][slide_id].images){
                    docs_sema[inp]="http://reevio.com"+json_data[i][slide_id].images[inp].value;

                }


            }



        }


     //   output=user_id+"_"+ user_videos_id+ "_" + i;
        docs_sema.output=user_id+"_"+ user_videos_id+ "_" + i;

that.sheets_add_row(docs_sema);
  console.log(docs_sema);
    }


return Promise.resolve(docs_sema);


    /*
    return new Promise(function(resolve,reject){
        //set user data(user_videos.json_data)
          for(i in user_data){
            for(y in user_data[i]){
                for(x in user_data[i][y]){
                    sheet_shema[x]=user_data[i][y][x].value;
                    if('color' in user_data[i][y][x]){
                        sheet_shema[x+'-color']=user_data[i][y][x].color;
                    }
                }
            }
        }
        //---------------------------------------------
        //set required data
        sheet_shema.user_template_id=user_template_id;
        sheet_shema.aep=aep;
        sheet_shema.date=moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        //-----------------------------------------------------------------

        //checking if all required data are set
        for(var ii in sheet_shema){
            if(sheet_shema[ii]===false){
                reject('Required fields are not set!')

            }if(sheet_shema[ii]===true){
                sheet_shema[ii]="";
            }
        }
        //-------------------------------------

        data.sheet_shema=sheet_shema;
        data.sheet_id=sheet_id;
        resolve(data);



    })
*/


}
//depraced
DataClay.sheets_add_row=function(data){
    var that=this,
        Sheet=new GoogleSpreadsheet(sheet_shema_logo_revial_id);
   // console.log(data)

   // return new Promise(function(resolve,reject){
        Sheet.useServiceAccountAuth(creds, function(err){
            if(err)throw(err);
            Sheet.getInfo( function( err, sheet_info ){
                if(err)throw(err);
                Sheet.addRow(1, data,function(err){
                    if(err)throw(err);
                    return(true);
                });

            });

        })

  //  });


}




module.exports=DataClay;