const mongoose = require('mongoose')

const ClassSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, `Please, What's the name of your class`]
	},
	motto: {
		type: String
	},
	subjects: [String]
})

module.exports = mongoose.model('Class', ClassSchema)

// PORT = 3000

// GOOGLE_CLIENT_ID = 982690351452-9imebu2nuvgu0rmsvq8c65as4nagrjok.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET = P9xc9QP6PCQBCI2myRgzY2Tk

// MONGO_URI = mongodb+srv://Abdulbaasit:abdulbaasit@al-qalam-academy.hhsqo.mongodb.net/alqalam-academy?retryWrites=true&w=majority