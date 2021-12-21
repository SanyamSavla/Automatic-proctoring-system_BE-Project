const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/user');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressValidator = require('express-validator');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(expressValidator());
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            console.log(user.password)
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}


module.exports = function(passport) {

passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, email, password, done) {
      var name = req.body.name;
      var classs = req.body.class
      var rollnumber = req.body.rollnumber
     // var teacher = req.body.teacher
      var student = req.body.student
      var messages = [];
      var year = req.body.year
     // req.checkBody('email', 'Invalid email').notEmpty().isEmail();
     // req.checkBody('password', 'Invalid password').notEmpty();
      var errors = req.validationErrors();
      if (errors) {
          errors.forEach(function (error) {
              messages.push(error.msg);
          });
          return done(null, false, req.flash('error', messages));
      }
      else if (!validateEmail(email)) {
          messages.push("Email Domain: @somaiya.edu required")
          return done(null, false, req.flash('error', messages));
      }
      else if (year == "Year") {
          messages.push("Please select a year")
          return done(null, false, req.flash('error', messages));
      }
      else if (classs == "Class") {
          messages.push("Please select a class")
          return done(null, false, req.flash('error', messages));
      }
      else {
          if (rollnumber) {
              User.findOne({ 'rollnumber': rollnumber }, function (err, user) {
                  if (err) {
                      return done(err)
                  }
                  if (user) {
                      console.log(rollnumber)
                      return done(null, false, { message: 'Roll number already in use.' });
                  }
                  else {
                      User.findOne({ 'email': email }, function (err, user) {
                          if (err) {
                              return done(err);
                          }
                          if (user) {
                              return done(null, false, { message: 'Email already in use.' });
                          }
                          else {
                              var newUser = new userModel();
                              newUser.name = name;
                              newUser.email = email;
                              newUser.password = newUser.encryptPassword(password);
                              newUser.class = classs
                              newUser.rollnumber = rollnumber
                                 if (student) {
                                  newUser.who = student
                                  if (!year) {
                                      messages.push("Please enter all details")
                                      return done(null, false, req.flash('error', messages));
                                  }
                                  else {
                                      newUser.year = year
                                  }
                              }
                              else {
                                  newUser.who = ""
                              }
                              newUser.save(function (err, result) {
                                  if (err) {
                                      throw err;
                                  }
                                  return done(null, newUser);
                              });
                          }



                      });
                  }
              })
          } else {
              User.findOne({ 'email': email }, function (err, user) {
                  if (err) {
                      return done(err);
                  }
                  if (user) {
                      return done(null, false, { message: 'Email already in use.' });
                  }
                  else {
                      var newUser = new User();
                      newUser.name = name;
                      newUser.email = email;
                      newUser.password = newUser.encryptPassword(password);
                      newUser.class = classs
                      newUser.rollnumber = rollnumber
                      if (teacher == "0") {
                          newUser.who = teacher
                      }
                      else if (student) {
                          newUser.who = student
                          if (!year) {
                              messages.push("Please enter all details")
                              return done(null, false, req.flash('error', messages));
                          }
                          else {
                              newUser.year = year
                          }
                      }
                      else {
                          newUser.who = ""
                      }
                      newUser.save(function (err, result) {
                          if (err) {
                              throw err;
                          }
                          return done(null, newUser);
                      });
                  }



              });
          }

      }

  }));
}