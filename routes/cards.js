const { default: Axios } = require('axios');

const express = require('express'),
      router = express.Router(),
      Card = require('../models/card'),
      Image = require('../models/image'),
      User = require('../models/user'),
      templateData = require('../templateData'),
      path = require('path'),
      fs = require('fs'),
      { runInNewContext } = require("vm"),
      middleware = require('../middleware'),
      multer = require('multer'),
      cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.templateData = templateData;
    next();
});

// ALL CARDS
router.get('/', middleware.isLoggedIn, (req, res) => {
    Card.find({}, (err, cards) => {
        // Show only cards created by the current user
        const userCards = cards.filter(card => card.user.id.equals(req.user._id));

        // Update number of cards a user has
        let numOfCards = userCards.length;
        User.findByIdAndUpdate(req.user._id, {numOfCards}, (err, user) => {
            if(err) {
                req.flash('error', 'Error, please try again');
                res.redirect('back');
            }
        });

        if(err) {
            req.flash('Something went wrong!')
            res.redirect('back');
        } else {
            res.render('index', {cards: userCards});
        }
    });
});


// New card
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('create');
});

// New card for guest
router.get('/guest/new', (req, res) => {
    // Render card edit page w/name of card and template
    res.render('create');
});

// Create route for guest
router.post('/guest', (req, res) => {
    const template = req.body.card.template_choice;
    res.redirect(`/cards/guest/edit/${template}`);
});

// Show edit card page for guest
router.get('/guest/edit/:template', (req, res) => {
    const template = req.params.template;
    // show edit
    res.render('card', {template, card: ''});
});

// Create new card
router.post('/', middleware.isLoggedIn, (req, res) => {
    const image = req.body.card.image;
    const message = req.body.card.message;
    const user = {
		id: req.user._id
    };
    const currentDate = new Date();
    const dateCreated = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    // Save the card data to the database
    Card.create(req.body.card, (err, createdCard) => {
        if(err) {
            req.flash('error', 'Something went wrong!');
            res.redirect('back');
        } else {
            createdCard.images.push({image});
            createdCard.messages.push({message});
            createdCard.dateCreated = dateCreated;
            createdCard.user = user;
            createdCard.save();
            req.flash('success', 'New card created!');
            res.redirect(`/cards/${createdCard._id}/edit`);
        }
    });
});

// Show edit card page
router.get('/:id/edit',middleware.isLoggedIn, (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err || !foundCard) {
            // Handle error when image not found
            req.flash('error', 'Card not found');
            res.redirect('/cards');
        } else {
            if(foundCard.user.id.equals(req.user._id)) {
                Image.find({}, (err, foundImages) => {
                    if(err) {
                        req.flash('error', 'Error loading photos')
                    } else {
                        const userImages = foundImages.filter(image => image.user.id.equals(req.user._id));

                        let numOfPhotos = userImages.length;
                        User.findByIdAndUpdate(req.user._id, {numOfPhotos}, (err, user) => {
                            if(err) {
                                req.flash('error', 'Error, please try again');
                                res.redirect('back');
                            }
                        });
                        res.render('card', {card: foundCard, files: userImages, numOfPhotos});
                    }
                });
                
            } else {
                req.flash('error', 'You do not have permission to edit this card')
                res.redirect('back');
            }
        }
    });
});

function updateCard(req, card) {
    const images = JSON.stringify(String(req.body.card.image)).replace(/"/g,'').split(',');
    const messages = req.body.card.message;

    // initialize arrays
    card.images = [];
    card.messages = [];
    // Handle image array
    if(typeof images == 'string') {
        card.images.push({'image': images});
    } else {
        Object.values(images).forEach(image => {
            card.images.push({'image': image});
        });
    };
    // Handle message array
    if(typeof messages == 'string') {
        card.messages.push({'message': messages});
    } else {
        Object.values(messages).forEach(message => {
            card.messages.push({'message': message});
        });
    };
    // Card font
    card.font = req.body.card.font;

    card.save();
}


// Update card
router.put('/:id', middleware.isLoggedIn, (req, res) => {
    Card.findOneAndUpdate({_id: req.params.id}, req.body.card, (err, card) =>{
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            if(card.user.id.equals(req.user._id)) {
                updateCard(req, card);

                req.flash('success', 'Card saved!');
                res.redirect(`/cards/${card._id}/edit`);
            } else {
                res.redirect('back');
            }
        }
    });
});

// Delete card
router.delete('/:id', middleware.isLoggedIn, (req, res) => {
    Card.findByIdAndDelete(req.params.id, (err ,cardToDelete) => {
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('/cards');
        } else {
            if(cardToDelete.user.id.equals(req.user._id)) {
                req.flash('success', 'Card deleted!');
                res.redirect('/cards');
            }
        }
    });
});


//////////////////////
// Image upload routes
//////////////////////


// Set up multer

// Multer file limits
const limits = {
    fileSize: 10240 * 10240, // 10 MB (max file size)
    };

// Set up multer
const upload = multer({ 
    limits: limits,
    storage: multer.diskStorage({})
});


// Upload image
router.post('/image/upload', middleware.isLoggedIn, upload.single("imageUpload"), middleware.allowedFileType, function (req, res) {
    // 1. Upload the file
    cloudinary.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            if(err.message.includes('File size too large')) {
                req.flash('error', 'File too large, must be less than 10MB.')
                return res.redirect('back');
            }
            req.flash('error', 'Something went wrong, try again.')
            return res.redirect('back');
        }
        const fileToSave = {
            href: result.secure_url,
            file_id: result.public_id,
            user: {
                id: req.user._id
            }
        }
        // 2. Create the file info in the db
    
        Image.create(fileToSave, (err, uploadedImage) => {
            if(err) {
                req.flash('error', 'Something went wrong');
                res.redirect('back');
            } else {
                req.flash('success', 'Image uploaded');
                res.redirect('back');
            }
        })
    })

});

router.delete('/image/:id/:file_id', middleware.isLoggedIn, function (req, res) {
    // delete reference to image from db
    // delete image from uploads
    Image.findByIdAndDelete(req.params.id, (err, imageToDelete) => {
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            if(imageToDelete.user.id.equals(req.user._id)) {
                // Delete from server
                cloudinary.uploader.destroy(req.params.file_id, function(err, result) { });
                req.flash('success', 'Photo deleted!');
                res.redirect('back');
            } else {
                req.flash('error', 'You are not permitted to delete this photo');
                res.redirect('back');
            }
        }
    });
});


module.exports = router;