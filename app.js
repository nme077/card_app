const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.set('view engine', "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost/card_app', {useNewUrlParser: true, useUnifiedTopology: true});






app.listen(3000, function() {
    console.log("app started")
})