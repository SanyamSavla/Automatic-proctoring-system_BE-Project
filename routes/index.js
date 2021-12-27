const express = require('express');
      router = express.Router();
      passport = require('passport');
      userModel = require('../models/user');
      imgModel = require('../models/image');
//var classModel = require('../models/class');
const bcrypt = require('bcryptjs');  
     multer = require('multer');
     crypto = require("crypto"),
    //EmailService = require("../../utils/EmailService"),
     async = require("async");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
 require('../routes/user');
/* GET home page. */

//Function used for running the routes below if not logged in 

router.get('/', function (req, res, next) {
  {
        try {
            var message = req.flash("error");
            return res.render('main/index',{
        messages: message,
        hasError: message.length > 0,
        userModel: userModel,

      });
        } catch (err) {
            return next({
                status: 400,
                message: err.message
            });
        }
    }
});

module.exports = router;