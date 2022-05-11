const express = require('express');
const router = express.Router();
      passport = require('passport');
const userModel = require('../models/user');
const Test = require('../models/Test');
      proctModel= require('../models/proctor');

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
    userModel.findOne({_id: req.user._id})
    .populate('score.test')
    .exec(function (err, allDetails){
        if (err) {
            console.log(err);
        } else {res.render('test/user-dashboard', {
            user: req.user,
            errorMsg: errorMsg,
            successMsg: successMsg,
            tests: allDetails,
        
        })   
        }
    });
            
});

router.get('/give-exam', function (req, res, next) {
    errorMsg = ""
    successMsg = ""
    if (req.session.errorMsg || req.session.successMsg) {
        errorMsg = req.session.errorMsg
        successMsg = req.session.successMsg
        req.session.errorMsg = undefined
        req.session.successMsg = undefined
    }
    Test.find({}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.render('test/give-exam', {
                user: req.user,
                errorMsg: errorMsg,
                successMsg: successMsg,
                tests: allDetails
         })
           
        }
    })   
          
});
let flag=0;
let visited;

router.get('/:testid/exam', async function (req, res, next) {
    
    // visited = req.session.visitCount ? (visited + 1) : 1;
    //     console.log("Reload",visited)
      
    
    //   req.session.cookie._expires=false;
    
    await userModel.findOne({_id: req.user._id} , (function(err, result) {
        flag=0;
        if (err) {
          
          console.log(err);
        } else {
          for (i=0; i<result.score.length; i++) {
            if(result.score[i].test==req.params.testid){
                    console.log(result.score[i].test)
                    console.log(req.params.testid)
                    flag+=1;
            }
            else{
                
            }
          }
          console.log("flag--",flag)
       }
      })
    );
    
    errorMsg = ""
    successMsg = ""
    var message = req.flash("error");
    if (req.session.errorMsg || req.session.successMsg) {
        errorMsg = req.session.errorMsg
        successMsg = req.session.successMsg
        req.session.errorMsg = undefined
        req.session.successMsg = undefined
    }
    console.log("flag",flag)
    
        if(flag<1){
    await Test.find({_id: req.params.testid}, function (err, allDetails) {
            if (err) {
                console.log(err);
            } else {res.render('test/exam', {
                user: req.user,
                errorMsg: errorMsg,
                successMsg: successMsg,
                tests:req.params.testid,
                questions: allDetails,message: message,
                hasError: message.length > 0,
            })
            
            
            }
        })
        
    }
    else{
        
        req.flash("success","EXAM GIVEN ALREADY");
	    res.redirect("/test/userDash");

    }
            
          
});

router.post("/submit-exam/:testid",async  function(req, res)  {
    
	try {   
        const quest =  await Test.findById(req.params.testid);        
        const length=quest.questions.length;
        const res=quest.responses.length;
        //console.log(quest);
        const correct=[]; // correct answers
       const logs=[];
        
        // for (i = 0; i < length; i++) {
        //     const corr= quest.questions[i].correctOptions[0];
        //    // console.log(corr)
        //         correct.push(corr);
        //     }
        const corr=[];
        quest.questions.forEach(function(corrt){
            
        // corrt.correctOptions.forEach(function(ans){
        //     console.log("ans",ans)
        //     corr.push(ans);
        // });
        correct.push(corrt.correctOptions)
    }); 
        //  for (i = 0; i < length; i++) {
        //     quest.questions[i].correctOptions.forEach(function(cort){
        //         corr.push(cort)
                
        //     });
        //     correct.push(corr);
        //    // console.log(corr)
                
        //     }

        console.log(correct);
		const answers = []; // answers of student
        const responses = [];
        

                        for (i = 0; i < length; i++) {
                            //const answer = req.body[i];
                            answers.push(
                                req.body[i]
                            );
                        }
        //LOGS
        //res.json([{     logs:logs      }])
                       

                        //calculate score 
        var c=0;
        var x=0;
        for (i = 0; i < correct.length; i++) {
            
            if( correct[i].length >1 ){
            for(j=0;j<correct[i].length;j++){

                if(answers[i][j]==correct[i][j]){
                    // console.log( "---",i,"==", answers[i][j]," ..",correct[i][j])    
                   x= 1;
                }
                else{
                   x=0;
                }
            //    c+=1;
 
            }
            if(x==1){
                c+=1;
            }
            else{
                continue;
            }
        }
        else{
            
            if(answers[i]==correct[i]){
                c+=1;
            }
            else{
                continue;
            }
        }
           
        }
        console.log("Score of",req.user.name,"is",(c));
        console.log( answers);
        responses.push({
            userId:req.user,
            answers:answers,
            score:c,
            //logs:data
           });
        
       // const question =  await Test.findById(req.params.testid);
        
        //Test.updateOne({_id:req.params.testid},{$push:{"questions" : questions}})
      //  question.questions=questions
        
        /*for (i = 0; i < res; i++) {
            if(quest.responses[i].userId==req.user){
                }  
                   
       }*/
       const question = await Test.updateOne({_id:req.params.testid},{$push:{"responses" : responses}})
            
      //  const test = await Test.create({...reqBody,orgId: orgId})  
        console.log("addeed", responses);
        var obj={
            test:req.params.testid,
            score:c
        }
        const active_user = await userModel.updateOne({_id:req.user._id},{$push:{"score" : obj}})

       req.flash("success","Added");
	    res.redirect("/test/userDash");
        
	} catch (err) {
		console.log(err);
		req.flash(err, err.message);
		res.redirect("/test/userDash");
	}
});

router.post("/submit-log/:testid",async  function(req, res){
    try {  
        const data = req.body.logs;
        const date=req.body.date;
        const end= req.body.end;
        const flag=req.body.uf;
        const responses = [];
        responses.push({
            userId:req.user,
            logs:data,
            testStartedAt:date,
            testCompletedAt:end,
            flag:flag,
           });
        const question = await Test.updateOne({_id:req.params.testid},{$push:{"logs" : responses}})
        console.log("find ", question);
        
        console.log("addeed -- ", responses);
        console.log('body: ',  req.body);
        console.log('body: ',  req.body.logs);
        
   
} catch (err) {
    console.log(err);
    req.flash(err, err.message);
    //res.redirect("back");
}

});

var collectionOne=[];
router.get('/logs/:testid', function (req, res, next) {
    try {
     
        console.log(req.params.testid);
       
            /*userModel.find().exec(function(err, result) {
              if (err) {
                throw err;
              } else {
                for (i=0; i<result.length; i++) {
                  collectionOne[i] = result[i];
               //   console.log("coll-",collectionOne[i])
                }
             }
            });
            */
            Test.findOne({_id: req.params.testid})
            .populate('logs.userId responses.userId')
            .exec(function (err, p) {
                if (err) return handleError(err);
                else{
                    console.log("p",p);
                    
                    res.render("test/logs", { testid:req.params.testid , tests:p })
                }
               
              }
          /*  .then(p=> {
                
                console.log("p",p);
                console.log("p",p.logs[0].userId.name)
                res.render("test/logs", { testid:req.params.testid , tests:p })
    
            }*/
                );

    /*    Test.find({_id: req.params.testid}, function (err, allDetails) {
            if (err) {
                console.log(err);
            } else {
                
             //   console.log(",,",allDetails)
                       }
        })  */

      
        }
    catch (err) {
        return next({
            status: 400,
            message: err.message
        });
    }
            
          
});

router.get('/stats/:testid/:userid', function (req, res, next) {
    try {
        console.log(req.user._id);
        
        Test.findOne({_id: req.params.testid}, function (err, allDetails) {
            if (err) {
                console.log(err);
            } else {

                console.log(",,",allDetails)
                res.render("test/userstats", { testid:req.params.testid , tests:allDetails,user:req.params.userid, username:req.user.name })
            }
        }) 

      
        }
    catch (err) {
        return next({
            status: 400,
            message: err.message
        });
    }
            
          
});

router.get('/:testid/:userid/logs', function (req, res, next) {
    try {
        
        Test.findOne({_id: req.params.testid}, function (err, allDetails) {
            if (err) {
                console.log(err);
            } else {

                console.log(",,",allDetails)
                res.render("test/logstats", { testid:req.params.testid , tests:allDetails , user:req.params.userid})
            }
        }) 

      
        }
    catch (err) {
        return next({
            status: 400,
            message: err.message
        });
    }
            
          
});

router.get('/results', function (req, res, next) {
    errorMsg = ""
    successMsg = ""
    var message = req.flash("error");
    if (req.session.errorMsg || req.session.successMsg) {
        errorMsg = req.session.errorMsg
        successMsg = req.session.successMsg
        req.session.errorMsg = undefined
        req.session.successMsg = undefined
    }

    userModel.findOne({_id: req.user._id})
    .populate('score.test')
    .exec(function (err, allDetails){
        if (err) {
            console.log(err);
        } else {res.render('test/exam-results', {
            user: req.user,
            errorMsg: errorMsg,
            successMsg: successMsg,
            tests: allDetails,message: message,
            hasError: message.length > 0,
        })   
        }
    });
    /* Test.find({}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {res.render('test/exam-results', {
            user: req.user,
            errorMsg: errorMsg,
            successMsg: successMsg,
            tests: allDetails,message: message,
            hasError: message.length > 0,
        })   
        }
    }) */ 
            
          
});

router.get('/:testid/images', function (req, res, next) {
    errorMsg = ""
    successMsg = ""
    var message = req.flash("error");
    if (req.session.errorMsg || req.session.successMsg) {
        errorMsg = req.session.errorMsg
        successMsg = req.session.successMsg
        req.session.errorMsg = undefined
        req.session.successMsg = undefined
    }
    proctModel.findOne({user: req.user._id}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {res.render('test/image', {
            user: req.user,
            testid:req.params.testid,
            errorMsg: errorMsg,
            successMsg: successMsg,
            proctor: allDetails,message: message,
            hasError: message.length > 0,
        })   
        }
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
    Test.find({teacher: req.user._id}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.render('test/teacher-dashboard', {
                user: req.user, errorMsg: errorMsg,
                successMsg: successMsg,
                user:req.user,
                tests:allDetails
                    
        })
            }
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

                console.log(",,",allDetails)
                res.render("test/addquestion", { tests:req.params.testid , questions:allDetails })
            }
        }) 

      
    }
       
     catch (err) {
        return next({
            status: 400,
            message: err.message
        });
    }
});

router.post("/addquestion/:testid",isAdmin,async  function(req, res)  {
    
	try {   
		const questions = [];
        const questionText=req.body["questionText"];
        const options=[];
        const a=req.body["a"];
        const b=req.body["b"];
        const c=req.body["c"];
        const d=req.body["d"];
        const ans=req.body["ans"];
        console.log("ans",ans)

        options.push( a,b,c,d);
        console.log( options);
        questions.push({questionText:questionText,
        options:options,
        correctOptions: ans
           });
        
       // const question =  await Test.findById(req.params.testid);
        
        //Test.updateOne({_id:req.params.testid},{$push:{"questions" : questions}})
      //  question.questions=questions
        const question = await Test.updateOne({_id:req.params.testid},{$push:{"questions" : questions}})
      //  const test = await Test.create({...reqBody,orgId: orgId})  
        console.log("addeed", question);
        var obj={
            question
        }
      
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