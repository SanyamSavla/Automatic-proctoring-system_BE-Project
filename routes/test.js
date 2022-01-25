const express = require('express');
const router = express.Router();
      passport = require('passport');
const userModel = require('../models/user');
const Test = require('../models/Test');

//var classModel = require('../models/class');
//var recordModel = require('../models/record');
//const clipboardy = require('clipboardy');
//const MailSender = require('../mail')
//var useragent = require('express-useragent');
//const user = require('../routes/user');
const request = require('request');
const session = require('express-session');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


//const { isLoggedIn, isAdmin } = require('../routes/user');

router.get('/userDash', function (req, res, next) {
    errorMsg = ""
    successMsg = ""
    if (req.session.errorMsg || req.session.successMsg) {
        errorMsg = req.session.errorMsg
        successMsg = req.session.successMsg
        req.session.errorMsg = undefined
        req.session.successMsg = undefined
    }

            res.render('test/user-dashboard', {
                user: req.user,
                errorMsg: errorMsg,
                successMsg: successMsg,
    })
});

router.get('/teacherDash', function (req, res, next) {
    errorMsg = ""
    successMsg = ""
    if (req.session.errorMsg || req.session.successMsg) {
        errorMsg = req.session.errorMsg
        successMsg = req.session.successMsg
        req.session.errorMsg = undefined
        req.session.successMsg = undefined
    }

    res.render('test/teacher-dashboard', {
                user: req.user, errorMsg: errorMsg,
                successMsg: successMsg,
    })
});

router.get('/addexam',isAdmin, function (req, res, next) {
        
    res.render('test/addexam', {
                user: req.user
    })
});
function isAdmin(req, res, next) {
    if (req.user.isAdmin) {
      next();
    } else {
      req.flash(
        "error",
        "Not Admin"
      );
      res.redirect("back");
    }
  };
  
router.post("/addexam",isAdmin, (req, res) => {
    
	try {

      
		const setting = {};
        const testDuration=req.body["testDuration"];
        const totalScore=req.body["totalScore"];
        const disableTabChange=req.body["disableTabChange"];
        const disableNeck=req.body["disableNeck"];
        const disableMobile=req.body["disableMobile"];
        setting.testDuration=testDuration;
        setting.totalScore=totalScore;
        setting.disableTabChange=disableTabChange;
        setting.disableNeck=disableNeck;
        setting.disableMobile=disableMobile;

    //    setting.push({testDuration:testDuration,
       //   totalScore:totalScore
   //   });
      //  console.log(setting)
       // console.log(req.body.testName)
        var obj = {
            teacher: req.user,
            settings:setting,
            testName:req.body.testName,
            testcode:req.body.testcode
          }
	//	const newTest = new Test({
	//		settings:setting,
      //      testName:req.body.testName,
        //    testcode:req.body.testcode
			
//		});
        console.log(obj)
        console.log(req.session);
        Test.create(obj, (err, item) => {
            if (err) {
                 console.log(err);
            }
            
        });
        req.flash("success","Added");
		res.redirect("/test/addexam");
	} catch (err) {
		console.log(err);
		req.flash(err, err.message);
		res.redirect("back");
	}
});

router.get('/viewexam',isAdmin, function (req, res, next) {
   
        try {
            var test =  Test.find({}).populate();
            Test.find({teacher: req.user._id}, function (err, allDetails) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("test/viewexam", { tests: allDetails })
                }
            })    
        } catch (err) {
            return next({
                status: 400,
                message: err.message
            });
        }
});

router.get('/:testid/addquestion',isAdmin, function (req, res, next) {
   
    try {
        console.log(req.params.testid);
        Test.find({_id: req.params.testid}, function (err, allDetails) {
            if (err) {
                console.log(err);
            } else {

                console.log(",,",allDetails._id)
                res.render("test/addquestion", { tests:req.params.testid })
            }
        })
        const tests2= Test.findById(req.params.testid).populate();   
       // console.log(tests)
        
    }
       
     catch (err) {
        return next({
            status: 400,
            message: err.message
        });
    }
});

router.post("/addquestion/:testid",isAdmin, async function(req, res)  {
    
	try {   
		const questions = [];
        const questionText=req.body["questionText"];
        const options=[];
        const a=req.body["a"];
        const b=req.body["b"];
        const c=req.body["c"];
        const d=req.body["d"];
        const ans=req.body["ans"];

        options.push( a,b,c,d);
        console.log( options);
        questions.push({questionText:questionText,
        options:options,
        correctOptions: ans
           });
        
        const question =  await Test.findById(req.params.testid);
           /*const newDesign = { };*/
           question.questions=questions
        
        
        console.log("addeed", questions);
        question.save();
        req.flash("success","Added");
		res.redirect("back");
	} catch (err) {
		console.log(err);
		req.flash(err, err.message);
		res.redirect("back");
	}
});

/// dummy---
router.get('/exam',async function(req,res){
    try {
            
        const orgId =await helpers.getIdFromHeader(req);
        // console.log("============="+orgId);
        // console.log(req.file);
        const reqBody = JSON.parse(req.body['test']);
        // console.log(reqBody);
        // console.log(req.file['path']);
        fs.rename(req.file['path'],`./${orgId}.csv`, function(err) {
            console.log(err);
        });
        const test = await Test.create({...reqBody,orgId: orgId})
        const org = await Org.findById(orgId);
        console.log(org)
        org.test.push(test._id)
        org.save().catch(err => console.log('Error saving org ',err));
        fs.readFile(`./${orgId}.csv`, async (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            const excelData = await neatCsv(data);
            for (var i = 0; i < excelData.length; ++i) {
        
          
                console.log(excelData[i].email);
                    var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dscvjti@gmail.com',
                        pass: 'palakdsc@P'
                    }
                    });
                    var variable1="hack";
                    var variable2=test.testName;
                    
                    var mailOptions = {
                    from: 'dscvjtigmail.com',
                    to: excelData[i].email,
                    subject: 'Organization Test Link Invitation',
                    html: "Dear Student<br> Thank you for applying to the"+variable2+"Test. The test would be of duration"+test.settings.testDuration+"with a total score of"+test.settings.testScore+"<a href='http://152.67.10.242/org/login'>Click here to be redirected to the Test</a>"
                };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    });
            }
            
                });
        
;
        return res.status(200).json(test);
    }catch (e) {
        return res.status(400).json({message: e.message });
    }
});

module.exports = router;