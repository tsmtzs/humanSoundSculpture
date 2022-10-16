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

import child_process from 'child_process'

import {
  appErrorListener,
  getOscMsgListener,
  getWsMsgListener,
  getWsConnectionListener,
  oscMsgHandler
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

  describe("Function 'getWsMsgListener'.", function () {
    let listener
    let worker
    let rootDir
    let execStub
    let exitStub

    before(function () {
      rootDir = 'test'
    })

    beforeEach(function () {
      execStub = sinon.stub(child_process, 'exec')
      exitStub = sinon.stub(process, 'exit')
      worker = {
	postMessage: sinon.fake()
      }
      listener = getWsMsgListener(worker, rootDir)
    })

    afterEach(() => {
      sinon.restore()
      execStub.reset()
      exitStub.reset()
    })

    it("Should return a function.", function () {
      expect(listener instanceof Function).to.be.true
    })

    it("The returned function when called should call the 'postMessage' method of the first argument of 'getWorkerMsgListener'.", function () {
      const msg = { type: 'other' }
      listener(JSON.stringify(msg))

      expect(worker.postMessage.calledOnceWith(msg)).to.be.true
    })

    it("The returned function, if called with argument 'shutdown' should call the 'exec' method of 'child_process'.", function () {
      listener(JSON.stringify({ type: 'shutdown' }))

      expect(execStub.calledOnce).to.be.true

      const args = execStub.args[0]
      expect(args[0]).to.equal('bin/killHSS.sh')
      expect(args[1].cwd).to.equal(rootDir)

      const errorCallback = args[2]
      expect(() => { errorCallback(1) }).to.throw()
    })

    it("The returned function, if called with argument 'shutdown' should send the message 'exit' to 'process'.", function () {
      listener(JSON.stringify({ type: 'shutdown' }))

      expect(exitStub.calledOnce).to.be.true
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

  describe("Function 'oscMsgHandler'.", function () {
    let handler
    let webSocketServer

    beforeEach(function () {
      webSocketServer = {
	broadcast: sinon.fake(),
	sendToRandomClient: sinon.fake()
      }
      handler = oscMsgHandler(webSocketServer)
    })

    afterEach(function () {
      sinon.restore()
    })

    it("When called should return an object with keys '/action' and '/note'.", function () {
      expect(handler['/action']).to.not.be.undefined
      expect(handler['/note']).to.not.be.undefined
    })

    it("When the message '/action' is send to the returned object, the method 'broadcast' of function's argument should be called.", function () {
      const data = 'msg'
      handler['/action'](data)
      expect(webSocketServer.broadcast.calledOnceWith(data)).to.be.true
    })

    it("When the message '/note' is send to the returned object, the method 'sendToRandomClient' of function's argument should be called.", function () {
      const data = 'msg'
      handler['/note'](data)
      expect(webSocketServer.sendToRandomClient.calledOnceWith(data)).to.be.true
    })
  })
})
