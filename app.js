var createError = require('http-errors');
var express = require('express');
var path = require('path');
var csrf = require('csurf');
var session = require('express-session');
var MongoStore = require('connect-mongodb-session')(session)
var cookieParser = require('cookie-parser');
var exphbr = require('express-handlebars');
var logger = require('morgan');
var mongoose = require('mongoose');
var Handlebars = require('handlebars');
var varMiddleware = require('./middleware/variables');
var userMiddleware = require('./middleware/user');
var flash = require('connect-flash');
var keys = require('./keys');

//routes
var indexRouter = require('./routes/index');
var addRouter = require('./routes/add');
var coursesRouter = require('./routes/courses');
var cardRouter = require('./routes/card');
var ordersRoutes = require('./routes/orders');
var authRoutes = require('./routes/auth');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

var app = express();

var hbs = exphbr.create({
  defaultLayout: 'main',
  extname: 'hbs',
  layoutsDir: 'views/layouts',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGO_URI
})

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', indexRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/card', cardRouter);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

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
  res.render('error', {
    errormessage: err.message,
    url: req.url,
    method: req.method,
    status: err.status
  });
});

async function start() {
  try {
    await mongoose.connect(keys.MONGO_URI,  {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (e) {
    console.log(e)
  }
}

start()

module.exports = app;
