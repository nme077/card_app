const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    firstName: String,
    email: {type: String, unique: true, required: true},
    numOfPhotos: String,
    numOfCards: String,
	username: {type: String, unique: true, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {Type: Boolean, default: false},
    googleId: String
});

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);