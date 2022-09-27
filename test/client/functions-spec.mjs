/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for the module functions.mjs.
// //////////////////////////////////////////////////
import {
  setTextToElement
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
})
