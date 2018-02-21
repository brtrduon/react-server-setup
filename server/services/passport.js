const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// passport is more of an ecosystem formed by what is referred to as 'strategies'
// so a strategy is like a method(?)

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