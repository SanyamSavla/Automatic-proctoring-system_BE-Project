
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');
// Load User model
//const User = require('../models/user');
const teacher = require('../models/teacher');

module.exports = function(passport) {
    passport.use( "company",
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        teacher.findOne({
          email: email
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'Tnot registered' });
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
      teacher.findById(id, function(err, user) {
        done(err, user);
      });
    });
  }
  
  
  
  
  