require('express-async-errors')
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const mongoose = require('mongoose')

const browserRoutes = require('./routes/browser-routes')
const apiRoutes = require('./routes/api-routes')

const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

// ========================
// Server
// ========================
mongoose.connect(config.connectionString)
	.then(() => {
		logger.info('Connected to Corporate Speech database')
	})
	.catch(err => {
		logger.error(err)
	})

// ========================
// Middlewares
// ========================
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride(function (req,res){
	if (req.body && typeof req.body === 'object' && '_method' in req.body){
		let method = req.body._method
		delete req.body._method
		return method
	}
}))
app.use(express.json())
app.use(express.static('public'))
app.use(middleware.requestLogger)
/* app.use(middleware.gracefulExit) */

// ========================
// Routes
// ========================

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*', )
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
	next()
})

app.use('/api', apiRoutes)
app.use('/', browserRoutes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', middleware.gracefulExit).on('SIGTERM', middleware.gracefulExit)

module.exports = app