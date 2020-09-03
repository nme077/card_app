const express = require("express"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      session = require('express-session'),
      User = require('./models/user'),
      Card = require('./models/card'),
      path = require('path'),
      fs = require('fs'),
      mongodb = require('mongodb');

// Initialize express
const app = express();

// CONNECT TO MONGODB
const uri = "mongodb+srv://nme077:TaATXCxXpciY2Qv@cluster0.vmffh.mongodb.net/card_app?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).catch(error => handleError(error));

// require routes
const cardRoutes = require('./routes/cards');
const authRoutes = require('./routes/index');
      

// Middleware
app.set('view engine', "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// Setup passport
app.use(session({
    secret: 'Def Leppard is the GOAT',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routes
app.get('/', (req, res) => {
    res.render('landing');
});
// Use routes
app.use('/cards', cardRoutes);
app.use(authRoutes);

app.get('*', (req, res) => {
    res.redirect('/');
});


var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server Has Started!");
});