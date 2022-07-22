const Entry = require('../models/entry')
const { validationResult } = require('express-validator')


const getEntriesApi = async (req, res, next) => {
	let entries = await Entry.aggregate([{ $sample: { size: 15 } }, { $project: { _id: 0, id: '$_id', original: 1, corporate: 1, category: 1 } }])
	if (entries) {
		res.status(200).json(entries)
	} else {
		res.status(404).json({ warning: 'No entries found.' }).end()
	}
}

const getRandomApi = async (req, res, next) => {
	let entries = await Entry.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 0, id: '$_id', original: 1, corporate: 1, category: 1 } }])
	res.status(200).json({ entries })
}

const getCategoryApi = async (req, res, next) => {
	const category = req.params.category.toLowerCase()
	let entries = await Entry.find({ category: category })
	if (entries) {
		res.json({ entries })
	} else {
		res.json({ entries: { warning: 'Nothing found in this search' } })
	}
}

const searchApi = async (req, res, next) => {
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
	}
	).project({ _id: 0, id: '$_id', original: 1, corporate: 1, category: 1 })
	if (entries) {
		res.json({ entries })
	} else {
		res.json({ entries: { warning: 'Nothing found in this search' } })
	}
}

const editEntryApi = async (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()){
		return res.status(400).send(errors)
	}

	const editedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		upsert: false
	} )
	if (editedEntry !== null){
		res.status(200).json({
			status : 'Success',
			data : {
				editedEntry
			}
		})
	}
}

exports.getEntriesApi = getEntriesApi
exports.getRandomApi = getRandomApi
exports.getCategoryApi = getCategoryApi
exports.searchApi = searchApi
exports.editEntryApi = editEntryApi