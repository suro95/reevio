var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    users = require('./routes/users'),
    video = require('./routes/video'),
    admin = require('./routes/admin'),
    editor = require('./routes/editor'),
    rig = require('./routes/rig'),
    member = require('./routes/member'),
    youtube = require('./routes/youtube'),
    library = require('./routes/library'),
    dataclay = require('./routes/dataclay_api'),
    api = require('./routes/api'),
    add_new_template=require('./routes/add_new_template'),
    auth = require('./routes/auth'),
    ajax = require('./routes/ajax'),
    everyauth = require('everyauth'),
    app = express(),
    expressValidator = require('express-validator'),
    html2jade = require('html2jade'),
    mysql = require('mysql'), // node-mysql module
    myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
        host     : 'localhost',
        user     : 'root',
       password : '',//1q2w3e4rR
        //  password : '',//1q2w3e4rR
        database : 'reeviovideo'
    },
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    RedisStore = require('connect-redis')(session),
    credits=require('./server/Class/Users/Credits'),
    users_mid=require('./server/Class/Users/Users');

var busboy = require('connect-busboy');
//nodemon --ignore 'sessions/*.json'  app.js
//forever start  -o out.log -e err.log app.js
//require('./server/functions.js');
//app.enable('trust proxy');

app.set('trust proxy', function (ip) {return true;
    if (ip === '127.0.0.1' || ip === '123.123.123.123'){
         console.log(ip);
    }
     console.log(ip);
});









// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(busboy());
app.use(expressValidator({
    customValidators: {
        isValidUrl: function(url) {
            var bool = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);

            if(!bool) {
                return false;
            } else {
                return true;
            }
        }
    }
}));
//-------------------------------------
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '100mb' }));
app.use(everyauth.middleware(app));

app.use(cookieParser());
var SessionOptions = {
    retries: 1
};

app.use(session({
     store: new FileStore(SessionOptions),
     secret: 'keyboard cat',
     resave: true,
     saveUninitialized: true,
     cookie: { maxAge: 60 * 60 * 1000 }
 }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(myConnection(mysql, dbOptions, 'single'));
app.use(credits.middleware);
app.use(users_mid.middleware);
//app.use(rememberme.cookie);
//routes
app.use('/', routes);
app.use('/users', users);
app.use('/library',library);
app.use('/video', video);
app.use('/member', member);
app.use('/auth', auth);
app.use('/editor', editor);
app.use('/add-new-template', add_new_template);
app.use('/dataclay', dataclay);
app.use('/api', api);
app.use('/admin', admin);
app.use('/ajax',ajax);
app.use('/youtube',youtube);
app.use('/rig',rig);
//end routes


app.set('port',  3002);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
console.log(app.get('env'));
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});









module.exports = app;
