const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      Image = require('../models/image'),
      Card = require('../models/card'),
      middleware = require('../middleware'),
      cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


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

// Delete entire account
router.delete('/user/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, userToDelete) => {
        if(err) {
            req.flash('error', 'Error deleting your account, try again.');
            return res.redirect('back');
        }
        // Delete all of the user's cards
        Card.deleteMany({user: {id: req.user._id}}, (err) => {
            if(err) {
                console.log(err)
                req.flash('error', 'Error deleting your cards, try again.');
                return res.redirect('back');
            } else {
                // Delete all photos
                Image.find({user: {id: req.user._id}}, (err, userImages) => {
                    if(err) {
                        console.log(err)
                        req.flash('error', 'Error deleting your photos from the server, try again.');
                        return res.redirect('back');
                    } else {
                        userImages.forEach(photo => {
                            // Delete from server
                            cloudinary.uploader.destroy(photo.file_id, (err, result) => {
                                if(err) {
                                    console.log(err)
                                    req.flash('error', 'Error deleting your photo from the server, try again.');
                                    return res.redirect('back');
                                }
                            });
                        });
                        // Delete references to photos in db
                        Image.deleteMany({user: {id: req.user._id}}, (err) => {
                            if(err) {
                                console.log(err)
                                req.flash('error', 'Error deleting your photos, try again.');
                                return res.redirect('back');
                            } else {
                                User.deleteOne({_id: userToDelete._id}, (err, userDeleted) => {
                                    if(err) {
                                        console.log(err)
                                        req.flash('error', 'Error deleting your account, try again.');
                                        return res.redirect('back');
                                    } else {
                                        req.logout();
                                        req.flash('success', 'User account deleted.')
                                        res.redirect('/login');
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    // Delete user account
})

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