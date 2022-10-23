const Entry = require('../models/entry')
const logger = require('../utils/logger')

const getEntries = async (req, res, next) => {
	let entries = await Entry.find({ _id: { $ne: '62e9ed742b2f4a7a0866205a' } })
	res.render('index.ejs', { entries })
}

const getDocPage = (req, res, next) => {
	res.render('doc.ejs')
}

const getEditPage = (req, res, next) => {
	let warning
	res.render('crud.ejs', { entries: { warning } })
}

const getCategory = async (req, res, next) => {
	const category = req.params.category.toLowerCase()
	let entries = await Entry.find({ category: category })
	res.render('index.ejs', { entries })
}

const searchEntries = async (req, res, next) => {
	const query = req.params.query.toLowerCase()
	let entries = await Entry.aggregate().search({
		'index': 'corporate-entries',
		'text': {
			'query': query,
			'path': {
				'wildcard': '*'
			},
			'fuzzy':{
				'maxEdits': 2,
				'prefixLength': 3
			}
		}
	})
	res.render('index.ejs', { entries })
}

const createEntry = async (req, res, next) => {
	const body = req.body
	const entry = new Entry({
		original: body.original,
		corporate: body.corporate,
		category: body.category
	})

	await entry.save()
	res.status(201).json('Entry created').redirect('/crud')
}

const editEntry = async (req, res, next) => {
	let queryId = req.body.patchid

	let entry = {
		original: req.body.original,
		corporate: req.body.corporate,
		category: req.body.category
	}
	const entryToUpdate = await Entry.findById(queryId)
	if (!entryToUpdate){
		return res.status(404).render('crud.ejs', {
			entries: {
				warning: 'Could not find any entry with this ID'
			}
		})
	}
	await Entry.findByIdAndUpdate(queryId, entry, {
		new: true,
		upsert: false,
		runValidators: true,
		context: 'query'
	})
	logger.info('Entry successfully edited.')
	return res.status(200).redirect('/crud')
}


const deleteEntry = async (req, res, next) => {
	let queryId = req.body.deleteid

	const entryToDelete = await Entry.findById(queryId)
	if (!entryToDelete){
		return res.status(404).render('crud.ejs', {
			entries: {
				warning: 'Could not find any entry with this ID'
			}
		})
	}
	await Entry.findByIdAndRemove(queryId)
	res.status(204).redirect('/')
	logger.info('Entry successfully removed.')
}

module.exports = {
	getEntries,
	getDocPage,
	getEditPage,
	getCategory,
	searchEntries,
	createEntry,
	editEntry,
	deleteEntry
}