const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');
// we reference the User model here to check and/or create into the db the email and password that the user inputs

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
    // as a convention, json web tokens have a 'sub' property
    // 'sub' is short for 'subject'
    // similarly, 'iat' is another subproperty of json web tokens, which stands for 'issued at time'
}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'Email and/or passwords cannot be blank'})
    }

    // see if a user with the given email exists
    User.findOne({ email: email }, function(err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(422).send({ err: 'Email is in use'});
        }
        // the if statement directly above this line is basically saying if a user with email DOES exist,
        // '422' means 'unprocessible entity'

        // if a user with email does NOT exist, create and save user record
        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err) {
            if (err) {
                return next(err);
            }
            // respond to request indicating the user was created
            res.json({ token: tokenForUser(user) });
        });
    });




}