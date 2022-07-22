const express = require('express')
const { check } = require('express-validator')

const browserControllers = require('../controllers/browser-controllers')
const browserRouter = express.Router()

browserRouter.get('/', browserControllers.getEntries)
browserRouter.get('/crud', browserControllers.getEditPage)
browserRouter.get('/doc', browserControllers.getDocPage)
browserRouter.get('/search/:query', browserControllers.searchEntries)
browserRouter.get('/:category', browserControllers.getCategory)

browserRouter.post('/', [
	check('original').notEmpty(),
	check('corporate').isLength({ min:5 })
], browserControllers.createEntry)

browserRouter.patch('/', [
	check('original').notEmpty(),
	check('corporate').isLength({ min:5 }),
	check('category').isIn(['general', 'lazy', 'boundary', 'demand', 'interview'])
], browserControllers.editEntry)

browserRouter.delete('/', browserControllers.deleteEntry)

module.exports = browserRouter