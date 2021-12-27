const express = require('express');
      router = express.Router();
      passport = require('passport');
      userModel = require('../models/user');
      imgModel = require('../models/image');
//var classModel = require('../models/class');
const bcrypt = require('bcryptjs');  
   //  multer = require('multer');
     crypto = require("crypto"),
    //EmailService = require("../../utils/EmailService"),
     async = require("async");
     var app = express();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//const MailSender = require('../mail')
//require("../models/user");
//var api = require('../api/api')
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
var fs = require('fs');
var path = require('path');
const https= require("https");
const nodeWebCam = require('node-webcam');

cloudinary.config({
    cloud_name: 'dn24716of',
    api_key: '838184683621473',
    api_secret: 'BQkNqSaTW59pwF8lDfGlaFIyPzo'
    });

app.use(express.static('uploads'));

router
	.route("/register")
.get((req, res, next) => {
		try {
			var message = req.flash("error");
			return res.render("user/register", {
				title: "Signup",
                message: message,
                hasError: message.length > 0,
			});
		} catch (err) {
			return next({
				status: 400,
				message: err.message
			});
		}
	})

.post(async(req, res,next) => {
		try {
         //   let message = req.flash();
           
            console.log("111");
			const newUser = new userModel({
				name: req.body.name,
				class: req.body.class,
				contact: req.body.contact,
                rollnumber: req.body.rollnumber,
                email:req.body.email,
                year:req.body.year,
                password:req.body.password,
			});
            await newUser.save();
            req.flash("success", "Successfully Updated!");
            res.redirect("/user/login/");
            console.log("redirected");
         //   req.flash("message", "Welcome");
            
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
        });

		} catch (err) {
            req.flash("error", err.message);
		    res.redirect("back");
            
            //message="erorr";
			//req.flash("error", err.message);
	    	//res.render("user/register",{message:message});
			
			    //res.redirect("/user/register");
               
			//	req.flash("success", "Successfully Updated!");
              //  console.log(JSON.stringify(newUser));
            //console.log("User added in database");
		}
	});

router.get("/login", (req, res, next) => {
        try {
            var messages = req.flash("error");
            return res.render("user/login", {
                title: "Login",
                messages: messages,
                hasError: messages.length > 0,
            });
        } catch (err) {
            return next({
                status: 400,
                message: err.message
            });
        }
    });
    
    router.post(
        "/login",
        passport.authenticate("local", {
            failureRedirect: "/user/login",
            failureFlash: true,
            successFlash: "  Welcome !",
            successRedirect: "/user/upload"
        }),
        (req, res) => {
            console.log(req.session);
            res.redirect("/user/register", {userModel:req.user});
        }
    );

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect("/user/login");
    }
     
    function notLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/user/login');
      }

      router.get('/logout', isLoggedIn, function (req, res, next) {
        req.logout();
        req.flash('success','logged out');
        res.redirect('/');
      });

      router.get('/profile', isLoggedIn, function (req, res, next) { 
       var success="Successs";
        const imageUrl=   imgModel
        .findOne({user: req.user._id})
        //.populate("imageUrl") // key to populate
        .then(user => {
                console.log("...",user.imageUrl)
                res.render('user/profile', {
                    user: req.user,
                    imageUrl:user.imageUrl,
                  //  success:success
                    success: parseInt(success)
                });
                
        });  
          var success = req.query.success
       console.log("imae",imageUrl);
      
    });

    router.get('/upload', isLoggedIn, (req, res) => {
        var messages = req.flash('error');
     //   var count=   imgModel.findOne({user: req.user._id}).count();  
       
             imgModel.countDocuments({}, function(err, count) {
        //if (err) { return handleError(err) } //handle possible errors
        if(count==1){
            req.flash("success", "Successfully Updated!");
            res.redirect("/user/profile");
           
            console.log("redirected")
        }
        else{
            res.render('user/upload', { messages: messages, hasErrors: messages.length > 0 });

        }
        //and do some other fancy stuff
    })
      });    

      router.post('/upload', isLoggedIn, async (req, res) => {
        var obj = {
            user: req.user,
            imageUrl: req.body.imageUrl
          }
        try {
           
             imgModel.create(obj, (err, item) => {
                if (err) {
                     console.log(err);
                }
            });
                        //    const newimg = new imgModel({
                        //     imageUrl: req.body.imageUrl
                    //     });
                            //    console.log(req.body.user)
                            //await newimg.save();
                        //   res.json(imgModel.imageUrl);
          res.redirect('/user/profile');
          console.log("here??")
          function saveimage(url,path){
                var fullurl =url;
                var localpath= fs.createWriteStream(path)

                var request=https.get(fullurl, function (response){
                  //  console.log(response);
                    response.pipe(localpath);
                })
          }
          saveimage(req.body.imageUrl,"./uploads/"+req.user.rollnumber+".png")
        //  let data = fs.readFileSync(path.join(__dirname + '../../uploads/'))
        } catch (err) {
          console.error('Something went wrong', err);
        }


      });
    //var webcam = nodeWebCam.create(options);
    router.post('/u', isLoggedIn, async (req, res) => {
        req.flash("success", "Successfully Updated!");
          res.redirect('/user/profile');

      });
   


module.exports = router,{
    isLoggedIn, notLoggedIn, 
};