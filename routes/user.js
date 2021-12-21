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

//const MailSender = require('../mail')
//require("../models/user");
//var api = require('../api/api')

var fs = require('fs');
var path = require('path');


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
            successRedirect: "/user/login"
        }),
        (req, res) => {
            console.log(req.session);
            res.redirect("/user/register");
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

      
module.exports = router;