const passport = require('passport');
const user = require('../models/user');

const express = require('express'),
      router = express.Router(),
      Card = require('../models/card'),
      User = require('../models/user'),
      templateData = require('../templateData'),
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

// Show user account edit page
router.get('/user/:id/edit', middleware.isLoggedIn, (req, res) => {
    res.render('useraccount');
});

// Update user account
router.put('/user/:id', middleware.isLoggedIn, (req, res) => {
    const userInfo = {
        firstName: req.body.firstName,
        email: req.body.email
    };

    console.log(userInfo.firstName)

    User.findOneAndUpdate({_id: req.params.id}, userInfo, (err, user) => {
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            console.log(user)
            req.flash('success', 'User information updated');
            res.redirect('back');
        }
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success','You have logged out!')
    res.redirect('/')
});

router.get('/tutorial', (req, res) => {
    res.render('tutorial', {templateData});
});


module.exports = router;