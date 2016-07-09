/**
 * Created by aleksa on 3/7/16.
 */


var EventEmitter = require('events'),
    util = require('util'),
    DataClay=require('./DataClay');








function DataClayEvents(){
    EventEmitter.call(this);

}

util.inherits(DataClayEvents, EventEmitter);

var Dataclay_events=new DataClayEvents();

Dataclay_events.on('insert',function(conn,user_template_id){
console.log('insert event start:')
    var Clay=Object.create(DataClay);
    Clay.init(conn,user_template_id)
        .then(Clay.get_user_template)
        .then(Clay.validate_data)
        .then(Clay.sheets_add_row)
        .error(function(err){
            throw(err)
        })
        .finally(function(){
            console.log('finally')
        })



})










module.exports=Dataclay_events;