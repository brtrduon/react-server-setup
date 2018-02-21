const User = require('../models/user');
// we reference the User model here to check and/or create into the db the email and password that the user inputs

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

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
            res.json({ success: true });
        });
    });




}