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

