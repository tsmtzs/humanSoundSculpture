/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for functions.mjs
// //////////////////////////////////////////////////
import sinon from 'sinon'

import pkg from 'chai'
const { expect } = pkg

import {
		appErrorListener
} from '../../webserver/functions.mjs'

describe('Tests for listener functions.', function () {
		describe("Function 'appErrorListener'.", function () {
				let err
				let req, res
				let status
				let send

				beforeEach(function () {
						err = {
								stack: 'stack'
						}
						send = sinon.fake()
						status = sinon.fake.returns({
								send: send
						})
						res = {
								status: status
						}

						sinon.spy(console, 'error')

						appErrorListener(err, req, res)
				})

				afterEach(() => {
						sinon.restore()
				})

				it("Should call the 'error' method of 'console' passing the first argument, when called.", function () {
						expect(console.error.calledOnceWith(err.stack)).to.be.true
				})

				it("Should send the message 'status' with argument '500' to the third argument, when called.", function () {
						expect(status.calledOnceWith(500)).to.be.true
				})

				it("Should call the 'send' method of the third argument argument, when called.", function () {
						expect(send.calledOnce).to.be.true
				})
		})
})
