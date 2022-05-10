require("dotenv").config({path:'./.env'});;
var createError = require('http-errors');
var express = require('express');
var bodyParser= require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport'); 
const LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      User = require("./models/user"),
      //teacher = require("./models/teacher"),
flash = require('connect-flash');
const validator= require('express-validator');
var MongoStore= require('connect-mongo');
var app = express();
const cors = require('cors');
require('./config/passport')(passport);
var genuuid=require('uuid/v4');
const axios = require('axios');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var testRouter = require('./routes/test');
routes = require("./routes");
//const db=require('./models');
//const routes = require("./routes");
//const multer = require("multer");
//const cv = require('opencv4nodejs');
const server = require('http').Server(app);
const io = require('socket.io')(server);
  
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
//mongoose.connect('mongodb://localhost:27017/attendance_portal',{useNewUrlParser: true, useUnifiedTopology: true})
const preset='ml_default';
const url="CLOUDINARY_URL=cloudinary://838184683621473:BQkNqSaTW59pwF8lDfGlaFIyPzo@dn24716of/image/upload";

const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

app.use(cors());

mongoose.Promise = global.Promise;
const databaseUri =process.env.MONGODB_URI ;

mongoose
  .connect(databaseUri, { useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false })
  .then(() => console.log(`Database connected`))
  .catch((err) => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
//require('./config/passport');

app.engine('ejs', require('ejs').renderFile);
app.set("view engine", "ejs");
// Require static assets from public folder
app.use(express.static((__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(cors());
app.use(cookieParser(process.env.globalSecret));
app.use(
  require("express-session")({
    secret: process.env.globalSecret,
    resave: false,
    saveUninitialized: false,
    genid: function(req) {
      return genuuid() // use UUIDs for session IDs
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require("moment");
app.use(flash());



//passport.use("user", new LocalStrategy(User.authenticate()));
 ////passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//passport.use("teacher", new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());


app.use(async function (req, res, next) {
  var cart = null;
  var custom_cart = null;
  var foundUser = null;

  res.locals.weburl = process.env.weburl;
  //res.locals.cart = cartListing(cart);
  //res.locals.custom_cart = customCartListing(custom_cart);
  //   console.log(res.locals.custom_cart);
  res.locals.user = req.user;
  res.locals.test=req.test;
  res.locals.teacher = req.teacher;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  res.locals.info = req.flash("success");
  next();
});

app.use(routes);
/*app.get('/', function(req, res) {
  res.render('main/index');
});

*/
// var MemoryStore = require('./node_modules/connect/lib/middleware/session/memory');
// const MemoryStore = require('memorystore')(session)
app.use(session({


  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  ////store: new MongoStore({mongooseConnection: mongoose.connection}),
  // store: new MemoryStore({ reapInterval: 6000 * 10 }) ,
  store: MongoStore.create({
    mongoUrl: databaseUri
}),
  cookie: {maxAge: 100*60*1000}
}));
//app.use(flash());
//app.use(passport.initialize());
//app.use(passport.session());
//app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use(flash());
app.use('/user', userRouter);
app.use('/', indexRouter);
app.use('/test',testRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
 // next(createError(404));
//});

// error handler

app.use((error, request, response, next) => {
  console.log(error);
  return response.status(error.status || 500).json({
    error: {
      message: error.message || "Oops! Something went wrong.",
    },
  });
});

port=(process.env.PORT||3000)
app.listen(port, '0.0.0.0',function(err){
  if(err){
    console.log(err)
  }
  else{
    console.log("Listening to port:",port)
  }
})



module.exports = app;