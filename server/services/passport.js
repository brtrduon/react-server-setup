const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// passport is more of an ecosystem formed by what is referred to as 'strategies'
// so a strategy is like a method(?)

// create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // verify this username and password. call done with the user if it is the correct username and password
    // otherwise, call done with false
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        // compare passwords - is 'password' === user.password?
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        });
    });
});
// by default, the local strategy expects a field called 'username' and another field called 'password'
// since we already have a password field, we can leave that as it is, but since we are using email rather than username,
// we need to specify that

// setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    // whenever a request comes in, and when we want passport to handle it, it needs to look at the request header, specifically a header called 'authorization' 
    // to find the token
    secretOrKey: config.secret
    // this secret is used to decode the token
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // payload: decoded jwt token
    // done: callback function that we need to call depending on whether or not we are able to authenticate the user

    // see if the user ID in the payload exists in our db
    // if it does, call 'done' with that user
    // otherwise, call done without a user object
    User.findById(payload.sub, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        }
        // we pass through 'null' where the err should be since it means that there are no errors
        else {
            done(null, false);
        }
    });
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);