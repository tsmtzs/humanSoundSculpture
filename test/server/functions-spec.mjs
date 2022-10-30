/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for functions.mjs
// //////////////////////////////////////////////////
import process from 'process'

import sinon from 'sinon'

import pkg from 'chai'
const { expect } = pkg

import child_process from 'node:child_process'

import {
  appErrorListener,
  getWorkerMsgListener,
  getWsMsgListener,
  getWsConnectionListener
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

  describe("Function 'getWorkerMsgListener'.", function () {
    let listener
    let webSocketServer
    let msg

    before(function () {
      msg = { type: 'action', data: [1, 2, 3] }
    })

    beforeEach(function () {
      webSocketServer = {
	broadcast: sinon.fake(),
	sendToRandomClient: sinon.fake()
      }
      listener = getWorkerMsgListener(webSocketServer)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Should return a function instance when called.', function () {
      expect(listener instanceof Function).to.be.true
    })

    it("The returned function, when called passing an object with 'type: action', should call the method 'broadcast' of the first argument of 'getOscListener'.", function () {
      listener(msg)

      expect(webSocketServer['broadcast'].calledOnce).to.be.true
      expect(webSocketServer['broadcast'].firstArg).to.equal(JSON.stringify(msg))
    })

    it("The returned function, when called passing an object with 'type: note', should call the method 'sendToRandomClient' of the first argument of 'getOscListener'.", function () {
      msg.type = 'note'
      listener(msg)

      expect(webSocketServer['sendToRandomClient'].calledOnce).to.be.true
      expect(webSocketServer['sendToRandomClient'].firstArg).to.equal(JSON.stringify(msg))
    })
  })

  describe("Function 'getWsConnectionListener'.", function () {
    let listener
    let errorListener
    let msgListener
    let webSocket

    before(function () {
      errorListener = () => { }
      msgListener = () => { }
    })

    beforeEach(function () {
      webSocket = { on: sinon.fake() }
      listener = getWsConnectionListener(errorListener, msgListener)
    })

    afterEach(() => {
      sinon.restore()
      webSocket.error = undefined
    })

    it("Should return a Function instance when called.", function () {
      expect(listener instanceof Function).to.be.true
    })

    it("The rturned function, when called, should call the 'on' method of its argument.", function () {
      listener(webSocket)
      expect(webSocket.on.calledOnceWith('message', msgListener)).to.be.true
    })

    it("The returned function, when called, should set the 'onerror' property of its argument.", function () {
      listener(webSocket)
      expect(webSocket.onerror).to.equal(errorListener)
    })
  })
})
