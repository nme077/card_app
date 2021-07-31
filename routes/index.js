const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      middleware = require('../middleware')


router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Landing page
router.get('/', (req, res) => {
    res.render('landing');
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

    User.findOneAndUpdate({_id: req.params.id}, userInfo, (err, user) => {
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
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
    res.locals.backUrl = req.originalUrl;
    res.render('tutorial');
});

router.get('/back', (req, res) => {
    res.redirect('back');
});


module.exports = router;