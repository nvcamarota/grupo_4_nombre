require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE
const session = require('express-session');
const bcrypt = require('bcryptjs');

const localsUserCheck = require("./middlewares/localsUserCheck");
const cookieCheck = require("./middlewares/cookieCheck");
const infoProvider = require('./middlewares/infoProvider');

const app = express();

const mainRouter = require('./routes/main');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE
app.use(session({
  secret: 'Malva2023',
  resave : false,
  saveUninitialized : true,
  cookie:{maxAge: 1000 * 60 * 20}
}));

app.use(cookieCheck)
app.use(localsUserCheck)
app.use(infoProvider)

app.use('/', mainRouter);
app.use( '/users', usersRouter);
app.use('/products', productsRouter);

/* APIs */
app
  .use('/api/users', require('./routes/api/userApi'))
  .use('/api/products', require('./routes/api/productsApi')) // API de productos
  .use("/api/cart",require('./routes/api/cartApi'))

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
