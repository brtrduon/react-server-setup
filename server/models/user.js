const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define our model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    // in the line directly above this one, pretty much no duplicate emails are allowed in the db
    password: String
});

// on save hook, encrypt password
// before saving a model, run this function
userSchema.pre('save', function(next) {
    const user = this;
    // the line directly above this line is giving access to the user model

    // generate a salt, then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        // hash (i.e. encrypt) the password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            // overwrite plain text password with encrypted password
            user.password = hash;
            // save the model
            next();
        });
    });
});

// create the model class
const modelClass = mongoose.model('user', userSchema);
// represents all users rather than one specific user

// export the model
module.exports = modelClass;