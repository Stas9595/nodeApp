var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var exphbr = require('express-handlebars');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var addRouter = require('./routes/add');
var coursesRouter = require('./routes/courses');
var cardRouter = require('./routes/card');

var app = express();

const url = `mongodb+srv://Stasg:eyblbajd@cluster0.are8a.mongodb.net/shop?retryWrites=true&w=majority`;

var hbs = exphbr.create({
  defaultLayout: 'main',
  extname: 'hbs',
  layoutsDir: 'views/layouts'
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/card', cardRouter);

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

async function start() {
  try {
    await mongoose.connect(url, {useNewUrlParser: true})
  } catch (e) {
    console.log(e)
  }
}

start()

module.exports = app;
