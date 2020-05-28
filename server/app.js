var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const cors = require('cors')

const mongoose = require('mongoose');
//6xIjAX0c22cbQ48X
mongoose.connect('mongodb+srv://developer:6xIjAX0c22cbQ48X@development-ubzml.mongodb.net/emoji?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log('(MONGOOSE) Connection OK!')
}).catch((err) => {
  console.log(err)
})

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const verifyAccessToken = require('./routes/middleware/verifyAccessTokenMiddleware')

app.use('/', verifyAccessToken, indexRouter);
app.use('/users', usersRouter);

module.exports = app;


console.log('Express Work in port:3000!!')