const express = require('express');
const user = require('./handlers/User');
const userAuth = require('./handlers/User/auth');
const org = require('./handlers/Org');
const orgAuth = require('./handlers/Org/auth');
const orgTest = require('./handlers/Test/orgTest');
const userTest = require('./handlers/Test/userTest');

const multer = require("multer");

const upload = multer({dest:'./uploads/'});

//const {isNotExpired,loginRequired} = require('./middlewares');
const router = express.Router();


router.post("/user/signup",upload.single('file'),userAuth.signup); 
router.post("/user/signout",userAuth.signout); 
router.post("/user/signin",user.signin); 
router.post("/user/:id/test/:testId",user.submitResponse);

router.post("/org/signup",orgAuth.signup); 
router.post("/org/signout",orgAuth.signout); 
router.post("/org/signin",org.signin); 

router.post("/org/create_test",upload.single('file'),orgTest.createTest); 
router.get("/org/get_all_tests",orgTest.getAllTests); 
router.get("/user/get_all_tests",userTest.getAllTests);

router.get("/org/sendmails",org.sendmail); 




router.get("/",(req,res)=>{
    res.send("API Online Check successful");
}); //landing page
router.get("/login",); // login form
router.get("/user",); // user registration page
router.get("/org_register",); //  org registration page
router.get("/user/home",); //user homepage, login required
router.get("/user/start_test/{testId}",); // auth before test and test rules page with start test button
router.get("/user/test/{testId}/",); // test page, full screen with webcam monitoring
router.get("/user/submitTest/{testId}",); // page after submitting test or test complete
router.get("/user/disqualify",);  // page after caught cheating
router.get("/user/results",); // page showing list of tests and results
router.get("/user/results/{testId}",);  //page to view detailed result of a particular test
router.get("/user/profile",);
router.get("/org/home",); // org homepage, login required
router.get("/org/createTest",);  //Page to create tests, upload csv for invites
router.get("/org/test/{testId}",); // Page to show results of test along logs

//router.use(loginRequired);


// router
//     .route('/user/:id/:entity')
//     .get(User.getProfile); // checked

module.exports=router;
<% if(hasError){ %>
    <div class="alert alert-danger">
        <% messages.forEach(function(errmessage){ %>
            <p style="text-align: center;"><%= message %></p>
            <% }) %>
        </div>
    <% } %>

    userModel.register(newUser, (err, userModel) => {
        if (err) {
           // var message = req.flash("error");
            console.log(err);
            res.flash(err);
            message="Error";
            return res.render("user/register",message=message);
        }
        
        res.redirect("/");
        console.log("redirected");
        res.flash("success", "Welcome to H&M INC");
        
    });


    return next({
        status: 400,
        messages: err.message
    });