const express = require('express'),
      router = express.Router(),
      Card = require('../models/card'),
      templateData = require('../templateData'),
      path = require('path'),
      fs = require('fs'),
      { runInNewContext } = require("vm"),
      middleware = require('../middleware');

// CREATE AN ARRAY OF ALL TEMPLATE FILES
//joining path of directory 
const directoryPath = path.join(__dirname, '../views/card_templates');
//passing directoryPath and callback function
let templateArr = [];
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        file = file.replace(/.ejs/, '');
        templateArr.push(file);
    });
});

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
    res.render('create', {templateArr: templateArr});
});

// Create new card
router.post('/', middleware.isLoggedIn, (req, res) => {
    const image = req.body.card.image;
    const message = req.body.card.message;
    const user = {
		id: req.user._id,
		username: req.user.username
	};
    const currentDate = new Date();
    const dateCreated = `${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
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
                res.render('card', {card: foundCard, templateArr: templateArr});
            } else {
                req.flash('error', 'You do not have permission to edit this card')
                res.redirect('back');
            }
        }
    });
});


// Update card
router.put('/:id', middleware.isLoggedIn, (req, res) => {
    Card.findOneAndUpdate({_id: req.params.id}, req.body.card, (err, card) =>{
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            if(card.user.id.equals(req.user._id)) {
                const imageInputs = req.body.card.image;
                const messages = req.body.card.message;  

                // initialize arrays
                card.images = [];
                card.messages = [];
                // Handle image array
                if(typeof imageInputs == 'string') {
                    card.images.push({'image': imageInputs});
                } else {
                    Object.values(imageInputs).forEach(image => {
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

                card.save();
                req.flash('success', 'Changes successfully saved');
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


module.exports = router;