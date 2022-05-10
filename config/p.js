const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/user');


module.exports = function(p) {
  p.use( 'teacher', 
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email, isAdmin:"true"
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

  p.serializeUser(function(user, done) {
    done(null, user.id);
  });

  p.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

 
}
