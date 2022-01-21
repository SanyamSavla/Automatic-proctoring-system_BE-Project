var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
//var classModel = require('../models/class');
//var recordModel = require('../models/record');
//const clipboardy = require('clipboardy');
//const MailSender = require('../mail')
//var useragent = require('express-useragent');
const { isLoggedIn } = require('../routes/user');
const request = require('request');
const session = require('express-session');

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

router.get('/addexam', function (req, res, next) {
    res.render('test/addexam', {
                user: req.user
    })
});


module.exports = router;