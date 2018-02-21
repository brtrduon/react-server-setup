const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define our model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    // in the line directly above this one, pretty much no duplicate emails are allowed in the db
    password: String
});

// create the model class
const modelClass = mongoose.model('user', userSchema);
// represents all users rather than one specific user

// export the model
module.exports = modelClass;