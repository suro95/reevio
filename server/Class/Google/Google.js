/**
 * Created by Arevik on 05.03.2016.


var GoogleSpreadsheet = require("google-spreadsheet"),
    ReadJson = require("r-json"),
    google = require('googleapis'),
     credentials ='',
     client_secret = '',
    oauth2Client = new google.auth.OAuth2(client_secret.client_id,client_secret.client_secret, client_secret.redirect_uris),
    scopes = [
        'https://www.googleapis.com/auth/drive'
    ],
    url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });



function Google(sheet_id){
    this.sheet_id = sheet_id;
    this.my_sheet = new GoogleSpreadsheet(sheet_id);
    this.token = '';
}


Google.prototype.get_access=function() {
    return url;
};

Google.prototype.get_token=function(code,calback) {
    var _this = this;
    oauth2Client.getToken(code, function (err, tokens) {
        if (!err) {
            oauth2Client.setCredentials(tokens);
            _this.token = tokens;
            return calback(tokens);
        }
        return false;
    });
};

Google.prototype.get_info = function(calback) {
    var _this = this;
    _this.my_sheet.setAuthToken(this.token);

    _this.my_sheet.useServiceAccountAuth(credentials, function(err) {
        _this.my_sheet.getInfo(function(err, sheetInfo) {
            if(err) throw err;

            else calback(sheetInfo);
        });
    });
};

Google.prototype.get_rows = function(sheetInfo,calback) {
    var sheet = sheetInfo.worksheets[0];
    sheet.getRows( function( err, rows ){
        if(err) throw err;

        calback(rows);
    });
};

Google.prototype.add_row = function(data,sheetInfo,calback) {
    var sheet = sheetInfo.worksheets[0];
    sheet.addRow(data, function(err,row){
        if(err) throw err;

        calback(row);
    });
};

Google.prototype.delete_row = function(row,calback) {
    row.del();
};

Google.prototype.add_sheet = function(options,calback) {
    this.my_sheet.addWorksheet(options,function(err,row) {
        if (err) throw err;

        return calback(row);
    });
};

module.exports=Google;

 */