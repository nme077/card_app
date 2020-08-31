const passport = require('passport');
const user = require('../models/user');

const express = require('express'),
      router = express.Router(),
      Card = require('../models/card'),
      User = require('../models/user');

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
            return res.send(err);
        }
        passport.authenticate('local')(req, res, () => {
            console.log('user created!')
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
        failureRedirect: '/login'
    }), (req, res) => {
        // logged in
}); 

// Logout
router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});


module.exports = router;