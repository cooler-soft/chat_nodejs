var PORT = 8080;
var options = {
//    'log level': 0
};
// dependencies
var express         = require('express'),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    csrf            = require("csurf"),
    bodyParser      = require('body-parser'),
    routes          = require('./routes/index'),
    sessions        = require('./routes/session'),
    users           = require('./routes/users'),
    auth            = require('./routes/auth'),
    register        = require('./routes/register'),
    room            = require('./routes/room'),
    couch           = require('./routes/couch');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.pretty = true;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessions.session);

// middleware of session authenticate user
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        couch.Users.findOneByView('_design/findOneByView/_view/findOneByView', req.session.user.email, function(err, user) {
            if (user) {
                req.user = user;
                delete req.user.password;
                req.session.user = req.user;
                res.locals.user = req.user;
            }
            next();
        });
    } else {
        next();
    }
});

// Csrf protection
app.use(csrf()).use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Routers
app.use('/', routes.index);
app.use('/users', users);
app.use('/room', room);
app.use('/auth', auth);
app.use('/register', register);
app.use('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/auth');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.locals.pretty = false;
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            title: 'Chat Room - Error',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    title: 'Chat Room - Error',
    message: err.message,
    error: {}
  });
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/room');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});

module.exports = app;
