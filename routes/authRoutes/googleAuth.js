const express = require('express'),
      router = express.Router(), 
      passport = require('passport'),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      User = require('../../models/user')


// Configure Passport - Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}, (err, foundUser) => {
        if(err || foundUser) {
            return done(err, foundUser);
        }
        
        const verifiedEmail = profile.emails.find(email => email.verified) || profile.emails[0];

        User.findOne({ email: verifiedEmail.value }, (emailErr, foundUserByEmail) => {
            if(foundUserByEmail) {
                // do not continue if user was authenticated with local strategy
                return done(null, false, 'Please login with email and password, account was originally created with this.');
            }
            const userInfo = {
                username: profile.displayName,
                firstName: profile.name.givenName,
                email: verifiedEmail.value,
                googleId: profile.id
            };
    
            // pass null password since using Google Auth
            new User(userInfo).save((createdErr, createdUser) => {
                return done(createdErr, createdUser);
            })
        })
  })
}
));

// Login with Google
router.get('/auth/google', passport.authenticate('google', { 
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] 
}));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/cards');
  }
);

module.exports = router;