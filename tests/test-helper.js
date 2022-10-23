const Entry = require('../models/entry')

const initialEntries = [
	{
		original: 'This idea will never work.',
		corporate: 'I am happy to explore this option but I do have some hesitations on the viability.',
		category: 'general'
	},
	{
		original: 'That sounds like a You problem.',
		corporate: 'I believe that falls within your scope of responsibilities but I am happy to support where it makes sense.',
		category: 'lazy'
	}
]

const nonExistingId = async () => {
	const entry = new Entry(
		{
			original: 'This will be deleted',
			corporate: 'To be deleted',
			category: 'general'
		})
	await entry.save()
	await entry.remove()

	return entry._id.toString()
}

const entriesInDb = async () => {
	const entries = await Entry.find({})
	return entries.map(entry => entry.toJSON())
}

module.exports = { initialEntries, nonExistingId, entriesInDb }