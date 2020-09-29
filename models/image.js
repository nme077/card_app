const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    user: {
        id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}, 
		username: String
    },
    filename: String
});

module.exports = mongoose.model('Image', imageSchema);