const passport = require('passport');
const user = require('../models/user');

const express = require('express'),
      router = express.Router(),
      Card = require('../models/card'),
      User = require('../models/user'),
      middleware = require('../middleware');

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Landing page
router.get('/', (req, res) => {
    res.render('landing');
});

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
        username: req.body.username,
        firstName: req.body.firstName,
        email: req.body.email
    };

    User.register(new User(userInfo), req.body.password, (err, user) => {
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
        successRedirect: '/cards',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'Successfully logged in. Welcome!'
    }), (req, res) => {
        // logged in
}); 

// Logout
router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success','You have logged out!')
    res.redirect('/')
});

router.get('/tutorial', (req, res) => {
    res.render('tutorial');
});


module.exports = router;