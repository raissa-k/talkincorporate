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
	let entries = Entry.find({ category: category })
	if (entries.length) {
		res.render('index.ejs', { entries })
	} else {
		res.render('index.ejs', { entries: { warning: 'Nothing found in this search' } })
	}
}

const searchEntries = async (req, res, next) => {
	const query = req.params.query.toLowerCase()
	let entries = Entry.aggregate().search({
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
	}
	)
	if (entries.length) {
		res.render('index.ejs', { entries })
	} else {
		res.render('index.ejs', { entries: { warning: 'Nothing found in this search' } })
	}
}

const createEntry = async (req, res, next) => {
	const body = req.body
	const entry = new Entry({
		original: body.original,
		corporate: body.corporate,
		category: body.category
	})

	await entry.save()
	res.status(201).redirect('/crud')
}

const editEntry = async (req, res, next) => {
	let queryId = req.body.patchid

	let entry = {
		original: req.body.original,
		corporate: req.body.corporate,
		category: req.body.category
	}

	const entryToUpdate = await Entry.findById(queryId)

	if (entryToUpdate){
		Entry.findByIdAndUpdate(queryId, entry, { new: true, upsert: false, runValidators: true, context: 'query' })
			.then(result => {
				logger.info('Entry successfully edited.')
				return res.status(200).redirect('/crud')
			}).catch(error => {
				if (error.name === 'ValidationError') {
					let errors = {}

					Object.keys(error.errors).forEach((key) => {
						errors[key] = error.errors[key].message
					})
					logger.error(errors)
					return res.status(400).render('crud.ejs', { entries: { warning: JSON.stringify(errors, null, 2) } })
				}
				return res.status(500).render('crud.ejs', { entries: { warning: 'Something went wrong' } })
			})
	}else {
		return res.status(404).render('crud.ejs', { entries: { warning: 'Could not find ID' } })
	}
}

const deleteEntry = async (req, res, next) => {
	let queryId = req.body.deleteid

	const entryToDelete = await Entry.findById(queryId)

	if (entryToDelete){
		await Entry.findByIdAndRemove(queryId)
		res.status(204).redirect('/')
		logger.info('Entry successfully removed.')
	} else {
		return res.status(404).render('crud.ejs', { entries: { warning: 'Could not find ID' } })
	}
}

exports.getEntries = getEntries
exports.getDocPage = getDocPage
exports.getEditPage = getEditPage
exports.getCategory = getCategory
exports.searchEntries = searchEntries
exports.createEntry = createEntry
exports.editEntry = editEntry
exports.deleteEntry = deleteEntry