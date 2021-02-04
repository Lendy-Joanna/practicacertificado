'use strict';

var createError = require('http-errors');
var session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
const flash = require('connect-flash');
const passport = require('passport');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

require("./config/passport")(passport)

//Configuración de Mongoose
var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://test:test@cluster0.oa4ly.mongodb.net/Sesiones?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado,,'))
    .catch((err) => console.log(err));

var app = express();
app.use(session({ secret: 'secret', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
//use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Configurando Passport

var expressSession = require('express-session');
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

//Parsea manejo de datos en cuerpo de la solicitud
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;