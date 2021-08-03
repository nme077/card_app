const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    user: {
        id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}, 
		username: String
    },
    template_choice: String,
    name: String,
    dateCreated: String,
    bottomFrontBackgroundColor: String,
    textColor: String,
    images: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            image: String
        }
    ],
    messages: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            message: String
        }
    ],
    font: String
});

module.exports = mongoose.model('Card', cardSchema);