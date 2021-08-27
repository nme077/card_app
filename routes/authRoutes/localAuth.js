const express = require('express'),
      router = express.Router(), 
      passport = require('passport'),
      User = require('../../models/user'),
      nodemailer = require('nodemailer'),
      { google } = require('googleapis'),
      async = require('async'),
      crypto = require('crypto');

// CONFIGURE GOOGLE
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

// Show register form
router.get('/register', (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect('/cards');
    } else {
        res.render('register');
    }
});
// Handle registration logic
router.post('/register', (req, res) => {
    const userInfo = {
        firstName: req.body.firstName,
        email: req.body.email
    };

    User.register(new User(userInfo), req.body.password, (err) => {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome, ${req.user.firstName}!`)
            res.redirect('/cards');
        });
    });
});

// Show login form
router.get('/login', (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect('/cards');
    } else {
        res.render('login');
    }
});

// Handle login
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Successfully logged in. Welcome!'
}), (req, res) => {
    if(req.session.returnTo) {
        return res.redirect(req.session.returnTo);
    }
    res.redirect('/cards');
}); 

// Show reset password page
router.get('/forgot', (req, res) => {
    res.render('forgot');
});

router.post('/forgot', (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, (err, user) => { 
                if(!user) {
                    req.flash('error', 'No account associated with that email exists');
                    return res.redirect('/forgot');
                }
                // Handle user signing in with other provider
                if(user.googleId) {
                    req.flash('error', 'Please login with Google');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(err => {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            // Get access token
            const accessToken = oAuth2Client.getAccessToken();

            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'cardapp77@gmail.com',
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });
            const mailOptions = {
                to: user.email,
                from: '"Cards" <cardapp77@gmail.com>',
                subject: 'Cards Password Reset',
                text: `Hi ${user.firstName}, \n\n Someone requested that the password for your Cards account be reset. \n\n Please click the following link or copy and paste it into your browser to reset your password. https://${req.headers.host}/reset/${token} \n\n If you did not request this, you can ignore this email or let us know. Your password won't change until you create a new password. \n\n Sincerely, \n Nicholas`,
                html: `
                <img src="https://i.imgur.com/uXnvrl0.png?2" style="width: 160px;">
                <h3>Hi ${user.firstName},</h3>

                <p>Someone requested that the password for your Cards account be reset. Please click button below or copy and paste the link into your browser to reset your password.</p>
                
                <button style="background: #3492eb; border-color: #3492eb; border-radius: 5px;"><a href="https://${req.headers.host}/reset/${token}" style="color: black; text-decoration: none;">Reset Password</a></button>

                <p>If you did not request this, you can ignore this email or let us know. Your password won't change until you create a new password.</p>
                <p>Sincerely,</p> 
                <p>Nicholas</p>`
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                if(err) {
                    req.flash('error', 'Something went wrong, try again');
                    return done(err, 'done');
                }
                req.flash('success', `An email has been sent to ${user.email} with further instructions to reset your password.`);
                done(err, 'done');
            });
        }
    ], function(err) {
        if(err) {
            console.log(err);
            return next(err);
        }
        res.redirect('/forgot');
    });
});

// Reset password view
router.get('/reset/:token', (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if(!user) {
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    })
});

router.post('/reset/:token', (req, res) => {
    async.waterfall([
        function(done) {
            User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
                if(!user) {
                    req.flash('error', 'Password reset token is invalid or has expired');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirmPassword) {
                    user.setPassword(req.body.password, (err) => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save((err) => {
                            req.logIn(user, (err) => {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash('error', 'Passwords do not match');
                    res.redirect('back');
                }
            });
        },
        function(user, done) {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'cardapp77@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            const mailOptions = {
                to: user.email,
                from: '"Cards" <cardapp77@gmail.com>',
                subject: 'Your password has been changed',
                text: `Hi ${user.firstName}, \n\n Your Cards password has just changed.`
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                if(err) {
                    req.flash('error', 'Something went wrong, try again');
                    return res.redirect('back');
                }
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            })
        }
    ], function(err) {
        if(err) {
            req.flash('error', 'Something went wrong, try again');
            return res.redirect('back');
        }
        res.redirect('/cards');
    })
});


module.exports = router;