const mongoose = require('mongoose')

const Schema = mongoose.Schema

const entrySchema = new Schema({
	original: {
		type: String,
		required: true,
		minlength: [6, 'Must be at least 6, got {VALUE}']
	},
	corporate: {
		type: String,
		required: true,
		minlength: [6, 'Must be at least 6, got {VALUE}']
	},
	category: {
		type: String,
		required: true,
		enum: {
			values: ['general', 'boundary', 'lazy', 'demand', 'interview'],
			message: '{VALUE} is not supported'
		}
	},
})

entrySchema.set('toJSON', {
	transform: (document, returned, options) => {
		returned.id = returned._id
		delete returned._id
		delete returned.__v
	}
})

module.exports = mongoose.model('Entry', entrySchema)