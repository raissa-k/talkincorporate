const express = require('express')
const { check } = require('express-validator')

const apiControllers = require('../controllers/api-controllers')
const apiRouter = express.Router()

apiRouter.get('/', apiControllers.getEntriesApi)
apiRouter.get('/random', apiControllers.getRandomApi)
apiRouter.get('/search/:query', apiControllers.searchApi)
apiRouter.get('/:category', apiControllers.getCategoryApi)

apiRouter.patch('/:id', [
	check('original').notEmpty(),
	check('corporate').isLength({ min:5 }),
	check('category').isIn(['general', 'lazy', 'boundary', 'demand', 'interview'])
], apiControllers.editEntryApi)


module.exports = apiRouter