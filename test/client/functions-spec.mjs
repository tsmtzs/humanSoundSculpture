/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for the module functions.mjs.
// //////////////////////////////////////////////////
import {
  setTextToElement,
  getShowButtons,
  getRemoveElementListener,
  getWsMsgListener
} from '../../webclient/javascript/functions.mjs'

import sinon from 'sinon'

import pkg from 'chai'
const { expect } = pkg

describe('Tests for functions.mjs', function () {
  describe("Function 'setTextToElement'.", function () {
    it("Should set the 'textContent' property of the second argument, to the string given as first argument.", function () {
      const element = { }
      const text = 'test'
      setTextToElement(text, element)
      expect(element.textContent).to.equal(text)
    })
  })

  describe("Function 'getShowButtons'.", function () {
    let domTree
    let listener
    let elements

    beforeEach(function () {
      const getElement = () => { return { style: {} } }
      elements = [getElement(), getElement()]
      domTree = {
	querySelectorAll: sinon.fake.returns(elements)
      }
      listener = getShowButtons(domTree)
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a Function instance.', function () {
      expect(listener instanceof Function).to.be.true
    })

    it("Should send the message 'querySelectorAll' on the given argument, passing 'button'.", function () {
      expect(domTree.querySelectorAll.calledOnce).to.be.true
      expect(domTree.querySelectorAll.firstArg).to.equal('button')
    })

    it("The returned function, when called, should set the property 'style.visibility' to 'visble' on each element of the 'querySelector' call.", function () {
      listener()
      expect(elements.every(elem => elem.style.visibility === 'visible')).to.be.true
    })
  })

  describe("Function 'getRemoveElementListener'.", function () {
    let element
    let domTree
    let listener

    beforeEach(function () {
      element = { remove: sinon.fake() }
      listener = getRemoveElementListener(element)
    })

    afterEach(function () {
      sinon.restore()
    })

    it("Should return a Function instance.", function () {
      expect(listener instanceof Function).to.be.true
    })

    it("The returned event listener, when called should send the message 'remove' to function's argument.", function () {
      listener()
      expect(element.remove.calledOnce).to.be.true
    })
  })

  describe("Function 'getWsMsgListener'.", function () {
    let listener
    let msgHandler

    beforeEach(function () {
      msgHandler = {
	test: sinon.fake()
      }
      listener = getWsMsgListener(msgHandler)
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a Function instance.', function () {
      expect(listener instanceof Function).to.be.true
    })

    it("The returned function should throw an error when called with argument 'message' which has a 'data' property which is not a valid JSON.", function () {
      let msg = {
      }
      expect(() => { listener(msg) }).to.throw()

      msg = {
	data: '} 9 {'
      }
      expect(() => { listener(msg) }).to.throw()
    })

    it("The returned function when called with the 'message' argument, should call a property of the argument 'msgHandler' of 'getWsMsgListener'.", function () {
      const arg1 = 1
      const arg2 = 2
      const msg = JSON.stringify({
	type: 'test',
	data: [arg1, arg2]
      })
      listener(msg)
      expect(msgHandler['test'].calledOnce).to.be.true
      expect(msgHandler['test'].firstArg).to.equal(arg1)
      expect(msgHandler['test'].lastArg).to.equal(arg2)
    })
  })
})
