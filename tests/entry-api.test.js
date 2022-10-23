const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test-helper')
const app = require('../app')
const api = supertest(app)
const Entry = require('../models/entry')



beforeEach(async () => {
	await Entry.deleteMany({})

	for (let newEntry of helper.initialEntries){
		let entryObject = new Entry(newEntry)
		await entryObject.save()
	}
})

test('entries are returned as json', async () => {
	await api.get('/api')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('number of entries matches entries in array', async () => {
	const response = await api.get('/api')
	expect(response.body).toHaveLength(helper.initialEntries.length)
})

test('the entry matches expected category', async () => {
	const response = await api.get('/api/general')
	const category = response.body.entries.map(entries => entries.category)
	expect(category).toContain('general')
})

test('a valid entry can be created', async () => {
	const newEntry = {
		original: 'Tester',
		corporate: 'Tester',
		category: 'demand'
	}

	await api
		.post('/')
		.send(newEntry)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const entriesAtEnd = await helper.entriesInDb()
	expect(entriesAtEnd).toHaveLength(helper.initialEntries.length + 1)

	const originalText = entriesAtEnd.map(entries => entries.original)
	expect(originalText).toContain('Tester')
})

test('an entry with no text is not added', async () => {
	const newEntry = {
		original: '',
		corporate: '',
		category: 'general'
	}

	await api
		.post('/')
		.send(newEntry)
		.expect(400)

	const response = await api.get('/api')

	expect(response.body).toHaveLength(helper.initialEntries.length)
})

test('an entry can be deleted', async () => {
	const startingEntries = await helper.entriesInDb()
	const entryToDelete = startingEntries[0]

	await api
		.delete(`/api/${entryToDelete.id}`)
		.expect(204)

	const endingEntries = await helper.entriesInDb()
	expect(endingEntries).toHaveLength(helper.initialEntries.length - 1)

	const originalText = endingEntries.map(entries => entries.original)
	expect(originalText).not.toContain(entryToDelete.original)
})

afterAll(() => {
	mongoose.connection.close()
})