const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

beforeEach(async () => {
	await Entry.deleteMany({})

	for (let newEntry of initialEntries){
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
	expect(response.body).toHaveLength(initialEntries.length)
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

	const response = await api.get('/api')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const originalText = response.body.map(entries => entries.original)

	expect(response.body).toHaveLength(initialEntries.length + 1)
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

	expect(response.body).toHaveLength(initialEntries.length)
})

afterAll(() => {
	mongoose.connection.close()
})