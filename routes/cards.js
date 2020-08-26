const express = require('express'),
      router = express.Router(),
      Card = require('../models/card')

// CREATE AN ARRAY OF ALL TEMPLATE FILES
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const { runInNewContext } = require("vm");
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
    next();
});

// Logged in middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/register');
};


// ALL CARDS
router.get('/', isLoggedIn, (req, res) => {
    Card.find({}, (err, cards) => {
        if(err) {
            // Handle error when image not found
            console.log(err);
        } else {
            res.render('index', {cards: cards});
        }
    });
});


// New card
router.get('/new', isLoggedIn, (req, res) => {
    res.render('create', {templateArr: templateArr});
});

// Create new card
router.post('/', isLoggedIn, (req, res) => {
    const image = req.body.card.image;
    const message = req.body.card.message;
    const user = req.user._id;
    const currentDate = new Date();
    const dateCreated = `${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    // Save the card data to the database
    Card.create(req.body.card, (err, createdCard) => {
        if(err) {
            console.log(err);
            res.redirect('/cards/new');
        } else {
            createdCard.images.push({image});
            createdCard.messages.push({message});
            createdCard.dateCreated = dateCreated;
            createdCard.user = user;
            createdCard.save();
            console.log(createdCard);
            res.redirect(`/cards/${createdCard._id}`);
        }
    });
});

// Show card
// UPDATE TO NOT HAVE EDIT FEATURES
router.get('/:id', isLoggedIn, (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err) {
            // Handle error when image not found
            console.log(err);
        } else {
            res.render('card', {card: foundCard, templateArr: templateArr});
        }
    });
});


// DELETE EDIT ROUTE

// Edit card
router.get('/:id/edit', isLoggedIn, (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err) {
            // Handle error when image not found
            console.log(err);
        } else {
            res.render('card', {card: foundCard, templateArr: templateArr});
        }
    });
});


// Update card
router.put('/:id', isLoggedIn, (req, res) => {
    Card.findOneAndUpdate({_id: req.params.id}, req.body.card, (err, card) =>{
        const image = req.body.card.image;
        const message = req.body.card.message;  
        
        if(err) {
            console.log(err);
        } else {
            
            // initialize arrays
            card.images = [];
            card.messages = [];
            //Push new items to arrays
            card.images.push({image});
            card.messages.push({message});
            card.save();
            res.redirect(`/cards/${card._id}`);
        }
    });
});

// Delete card
router.delete('/:id', isLoggedIn, (req, res) => {
    Card.findByIdAndDelete(req.params.id, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/cards')
        }
    });
});


module.exports = router;