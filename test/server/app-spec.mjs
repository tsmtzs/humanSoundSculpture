/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for app.mjs
// //////////////////////////////////////////////////
import chai from 'chai'
import chaiHttp from 'chai-http'

import { app } from '../../webserver/app.mjs'

chai.use(chaiHttp)

const { expect } = chai

describe('Tests for the Express app', function () {
	it.skip("GET request to '/' should respond with  status number 200.", function (done) {
		chai.request(app)
			.get('/')
			.then(function (error, response) {
				expect(response).to.have.status(200)
				expect(response).should.to.be.html
				done()
			})
			.catch(error => console.error(error.stack))
	})

	it.skip("GET request to '/conductor' should respond with  status number 200.", function (done) {
		chai.request(app)
			.get('/conductor')
			.then(function (error, response) {
				expect(response).to.have.status(200)
				expect(response).should.to.be.html
				done()
			})
			.catch(error => console.error(error.stack))
	})

	it.skip("GET request to '/player' should respond with  status number 200.", function (done) {
		chai.request(app)
			.get('/player')
			.then(function (error, response) {
				expect(response).to.have.status(200)
				expect(response).should.to.be.html
				done()
			})
			.catch(error => console.error(error.stack))
	})

	it.skip("GET request to '/description' should respond with  status number 200.", function (done) {
		chai.request(app)
			.get('/description')
			.then(function (error, response) {
				expect(response).to.have.status(200)
				expect(response).should.to.be.html
				done()
			})
			.catch(error => console.error(error.stack))
	})
})
