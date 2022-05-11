const express = require('express');
      router = express.Router();
      passport = require('passport');
      // p=require('../config/p')
      userModel = require('../models/user');
      imgModel = require('../models/image');
      proctModel= require('../models/proctor');
let alert = require('alert'); 
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
//const cv = require('opencv');
//const server = require('http').Server(app);
//const io = require('socket.io')(server);
const {spawn} = require('child_process');
const request = require('request');


cloudinary.config({
    cloud_name: 'dn24716of',
    api_key: '838184683621473',
    api_secret: 'BQkNqSaTW59pwF8lDfGlaFIyPzo'
    });

app.use(express.static('uploads'));
  
router.get('/test2/:id', isLoggedIn,async function (req, res) {
    try{
   var dataToSend;
   var url = 'http://auto-proctoring-system-flask.herokuapp.com/camera/'+req.user._id.toString() ;
   
   var b;
   let ans;
   await request(url, async function (error, response, body) {
      console.log('body:', body);
      ans=body;  
      console.log('error:', error);

      if(body=="Unknown"){
        alert("Not known!")
      }
      else{
        alert(body, "found")
      }


      });
      await res.render('user/camera');
      return;
     } catch (err) {
      console.log(err)
  }

});

router.get('/check/:id', isLoggedIn,async function (req, res) {
  try{
 var dataToSend;
 var url = 'http://localhost:5000/camera/'+req.user._id.toString() ;
 let x=req.body;

 var b;
 await request(url, async function (error, response, body) {
    console.log('body:', body);
    ans=body;  
    console.log('error:', error);

    if(body=="Unknown"){
      alert("Not known!")
    }
    else{
      alert(body, "found")
    }


    });
    await res.render('user/camera');
    return;
   } catch (err) {
    console.log(err)
}

});

router.get("/test", (req, res, next) => {
  try {
    var dataToSend;
    console.log("here?1")
    // spawn new child process to call the python script
    const python = spawn('python', ['Python/test.py']);
    console.log("here?2")
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();     
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend)
    });

  } catch (err) {
      return next({
          status: 400,
          message: err.message
      });
  }
});


router
	.route("/register")
.get((req, res, next) => {
		try {   var message = req.flash("error");
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

.post((req, res,next) => {
  try {
    userModel.countDocuments( userModel.findOne({rollnumber: req.body.rollnumber}), function(err, count) {
        //if (err) { return handleError(err) } //handle possible errors
        if(count==1){
            req.flash("error", "Same account exists");
            res.redirect("back");
           
            console.log("backkk");
        }
        else{
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
        //     newUser.save();
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
        }
        
    })
		
         //   let message = req.flash();
         
            
		} catch (err) {
            console.log("eee",err.message);
            req.flash("error", "Same account exists");
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


  //Teacher Register --

  router
	.route("/teacher-register")
.get((req, res, next) => {
		try {   var message = req.flash("error");
        return res.render("user/teacher-register", {
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

.post((req, res,next) => {
  try {
    userModel.countDocuments( userModel.findOne({email: req.body.email}), function(err, count) {
        //if (err) { return handleError(err) } //handle possible errors
        if(count==1){
            req.flash("error", "Same account exists");
            res.redirect("back");
           
            console.log("backkk");
        }
        else{
            console.log("111");
            const newUser = new userModel({
                name: req.body.name,
                
                contact: req.body.contactNum,
                
                email:req.body.email,
                
                password:req.body.password,
                isAdmin:"true",
            });
        //     newUser.save();
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
        }
        
    })
		
         //   let message = req.flash();
         
            
		} catch (err) {
            console.log("eee",err.message);
            req.flash("error", "Same account exists");
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
    function sessionidcheck(req, res, next) {
      console.log("...",req.user)
      
  }
    router.post(
        "/login",
        passport.authenticate("user", {
            failureRedirect: "/user/login",
            failureFlash: true,
            successFlash: "  Welcome !",
            successRedirect: "/user/upload"
        }),
        (req, res) => {
            console.log(req.session);
            res.redirect("/user/register", {userModel:req.user});
            console.log(req.session.genid)
        },
       
        
    );
router.get("/teacher-login", (req, res, next) => {
      try {
          var messages = req.flash("error");
          return res.render("user/teacher-login", {
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
      "/teacher-login", 
      passport.authenticate("user", {
          failureRedirect: "/user/teacher-login",
          failureFlash: true,
          successFlash: "  Welcome !",
          successRedirect: "/test/teacherDash"
      }),
      (req, res) => {
          console.log(req.session);
          console.log("...",req.teacher)
          res.redirect("/user/teacher-register", {teacherModel:req.teacher});
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
        
        userModel.findOneAndUpdate({_id: req.user._id},{"logged": "false"}, function(err, result){
        
          if(err){
            console.log(err)
        }
        else{
           
        }
      
      })
        req.logout();

        req.flash("success","logged out");
        res.redirect('/');
      });

      router.get('/profile', isLoggedIn, function (req, res, next) { 
        
      console.log(req.user.logged)
      if(!req.user.logged){
        // req.user.logged="true"
        userModel.findOneAndUpdate({_id: req.user._id},{"logged": "true"}, function(err, result){
        
          if(err){
            console.log(err)
        }
        else{
           
        }
      
      })
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
    
    }
      else{
     console.log("..[[")
     
     req.flash("success","Multiple logins")
     res.redirect("/logout")
      }
      
    });

    router.get('/upload', isLoggedIn, (req, res) => {
        var messages = req.flash('error');
     //   var count=   imgModel.findOne({user: req.user._id}).count();  
       
        imgModel.countDocuments( imgModel.findOne({user: req.user._id}), function(err, count) {
        //if (err) { return handleError(err) } //handle possible errors
        if(count==1){
            req.flash("success", "Successfully Updated!");
            res.redirect("/user/profile");
           
            console.log("redirected")
        }
        else{
            res.render('user/upload', { messages: messages, hasErrors: messages.length > 0 });

        }
        
    })
      });    

      router.post('/upload', isLoggedIn, async (req, res) => {
        var obj = {
            user: req.user,
            imageUrl: req.body.imageUrl
          }
          console.log("Object---",req.body.imageUrl)
        try {
           
          await  imgModel.create(obj, (err, item) => {
               console.log("Object---",obj)
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
         // saveimage(req.body.imageUrl,"./Python/uploads/"+req.user.rollnumber+".png")
        //  let data = fs.readFileSync(path.join(__dirname + '../../uploads/'))
        } catch (err) {
          console.error('Something went wrong', err);
        }


      });
     router.post('/save', async (req, res) => {
       var test={
         test:req.body.testid,
         imageUrl: req.body.imageUrl
       }
      var obj = {
        user: req.user,
        tests:test
        
      }
        try {     /*   
         
            */
        proctModel.countDocuments( proctModel.findOne({user: req.user._id}), function(err, count) {
          //if (err) { return handleError(err) } //handle possible errors
          console.log(count);
          if(count<1){
            proctModel.create(obj, (err, item) => {
              if (err) {
                   console.log(err);
              }
              });
          }
    
            /*const count=proctModel.countDocuments( proctModel.findOne({user: req.user._id}));
          //  console.log(count);
            if(count<1){ 
              proctModel.create(obj, (err, item) => {
                if (err) {
                     console.log(err);
                }
                });

             }*/
            
             else{

              proctModel.findOne({ user : req.user._id },function(err,item){
                for(i=0;i<item.tests.length;i++){

                  if(item.tests[i].test==req.body.testid){
                    item.tests[i].imageUrl.push(req.body.imageUrl)
                  }
                  else if((i==item.tests.length-1) && (item.tests[i].test!=req.body.testid)){

                    item.tests.push(test)
                  }

                }
                
                item.save(function(err,item)
                {
                  if(err) throw err;
                  console.log('itm updated');
                 // res.json(favorite);
                });
              }
            );


             }
            });
          console.log("savee??")
          function saveimage(url,path){
                var fullurl =url;
                var localpath= fs.createWriteStream(path)

                var request=https.get(fullurl, function (response){
                  //  console.log(response);
                    response.pipe(localpath);
                })
          }
        //  saveimage(req.body.imageUrl,"./images/"+req.user.rollnumber+ (Math.floor(Math.random() * 100))+".png")
          console.log(" SAVED")
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
   
router.get('/face',(req,res)=>{
  console.log("Hello");
  req.flash("Hi");
 
});

module.exports = router,{
    isLoggedIn, notLoggedIn, 
};