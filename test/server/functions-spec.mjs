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
		appErrorListener,
		getOscMsgListener
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

		describe("Function 'getOscMsgListener'.", function () {
				let listener
				let msgHandler
				let webSocketServer
				let msg

				before(function () {
						msg = ['test', 1, 2, 3]
						webSocketServer = { }
				})

				beforeEach(function () {
						msgHandler = {
								test: sinon.fake()
						}
						sinon.spy(Object, 'assign')

						listener = getOscMsgListener(msgHandler, webSocketServer)
				})

				afterEach(() => {
						sinon.restore()
				})

				it('Should return a function instance when called.', function () {
						expect(listener instanceof Function).to.be.true
				})

				it("The returned function, when called, should call the 'assign' method of 'Object', passing an object with property 'type' as first argument, and an object with property 'args' as second argument.", function () {
						listener(msg)

						expect(Object.assign.calledOnce).to.be.true

						const args = Object.assign.args[0]
						expect(args[0].type).to.equal(msg[0])
						expect(args[1].args instanceof Array).to.be.true
				})

				it("The returned function, when called, should call a method of the first argument of 'getOscListener'.", function () {
						listener(msg)

						expect(msgHandler['test'].calledOnce).to.be.true
						expect(typeof msgHandler['test'].firstArg).to.equal('string')
						expect(msgHandler['test'].lastArg).to.equal(webSocketServer)
				})
		})
})
