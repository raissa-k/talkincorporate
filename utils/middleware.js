const logger = require('./logger')
const mongoose = require('mongoose')

const requestLogger = (req, res, next) => {
	logger.info('Method:', req.method)
	logger.info('Path:  ', req.path)
	logger.info('Body:  ', req.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

const gracefulExit = () => {
	mongoose.connection.close(() => {
		logger.info('Mongoose default connection with DB Corporate Speech is disconnected through app termination')
		process.exit(0)
	})
}

module.exports = { requestLogger, unknownEndpoint, errorHandler, gracefulExit }