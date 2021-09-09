const express = require("express"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      session = require('express-session'),
      MemoryStore = require('memorystore')(session),
      User = require('./models/user'),
      path = require('path'),
      flash = require('connect-flash'),
      fonts = require('./fonts'),
      dotenv = require('dotenv').config();

// Initialize express
const app = express();

// CONNECT TO MONGODB
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set('useCreateIndex', true);

// require routes
const cardRoutes = require('./routes/cards');
const authRoutes = require('./routes/index');
const googleAuthRoutes = require('./routes/authRoutes/googleAuth');
const localAuthRoutes = require('./routes/authRoutes/localAuth');
      

// Config
app.use(flash());
app.set('view engine', "ejs");
app.use(express.static(path.join(__dirname,"client")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
    res.locals.fonts = fonts;
    next();
});

// Setup passport
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    credentials: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.errorMessage = req.flash('error');
	res.locals.successMessage = req.flash('success');
    res.locals.path = req.path;
    next();
});


// Use routes
app.use('/cards', cardRoutes);
app.use(localAuthRoutes);
app.use(authRoutes);
app.use(googleAuthRoutes);

app.get('*', (req, res) => {
    res.redirect('/');
});


var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server Has Started!");
});