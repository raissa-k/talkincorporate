const Entry = require('../models/entry')
const {validationResult} = require('express-validator')

const getEntriesApi = async (req, res, next) => {
    let entries;
    try {
        entries = await Entry.find({}).select('-_id')
    } catch (error) {
        return next(error)
    }
    res.json({entries})
}

const getRandomApi = async (req, res, next) => {
    let entries;
    try {
        entries = await Entry.aggregate().sample(1).project('-_id')
        } catch (error) {
            return next(error)
        }
    res.json({entries})
}

const getCategoryApi = async (req, res, next) => {
    const category = req.params.category.toLowerCase()
    let entries;
    try {
        entries = await Entry.find({ category: category}).select('-_id')
    } catch (error) {
        return next(error)
    }
    if (entries.length) {
        res.json({entries})
    } else {
        res.json({entries: {warning: 'Nothing found in this search'}})
    }
}

const searchApi = async (req, res, next) => {
    const query = req.params.query.toLowerCase()
    let entries;
    try {
        entries = await Entry.aggregate().search({
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
        ).project('-_id')
    } catch (error) {
        return next(error)
    }
    if (entries.length) {
        res.json({entries})
    } else {
        res.json({entries: {warning: 'Nothing found in this search'}})
    }
}

const editEntryApi = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log(errors)
        return next(new Error('Invalid input.'))
    }

    const editedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        upsert: false
    } )
    try{
        res.status(200).json({
            status : 'Success',
            data : {
              editedEntry
            }
          })
    }catch(err){
        console.log(err)
    }
    }

exports.getEntries = getEntriesApi
exports.getRandomApi = getRandomApi
exports.getCategoryApi = getCategoryApi
exports.searchApi = searchApi
exports.editEntryApi = editEntryApi