/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
import {
  WaveShaper
} from '../../webclient/javascript/sound.mjs'

import sinon from 'sinon'

import pkg from 'chai'
const { expect } = pkg

describe('Tests for sound.mjs.', function () {
  beforeEach(function () {
    global.window = {}
  })
  
  describe("Class 'WaveShaper'.", function () {
    let waveshaper
    let freq, amp, dur

    afterEach(function () {
      sinon.restore()
    })

    it("Constructor should set the properties 'freq', 'amp', and 'dur'.", function () {
      waveshaper = new WaveShaper()

      expect(waveshaper.freq).to.be.a('number')
      expect(waveshaper.dur).to.be.a('number')
      expect(waveshaper.amp).to.be.a('number')

      freq = 100
      dur = 2
      amp = 0.5
      waveshaper = new WaveShaper({ freq, dur, amp })
      expect(waveshaper.freq).to.equal(freq)
      expect(waveshaper.dur).to.equal(dur)
      expect(waveshaper.amp).to.equal(amp)
    })

    it("Contructor should set the property 'wave', if passed with the argument object.", function () {
      waveshaper = new WaveShaper()
      expect(waveshaper.wave).to.be.undefined

      const wave = [1,2]
      waveshaper = new WaveShaper({ wave })
      expect(waveshaper.wave).to.equal(wave)
    })

    it("Static method 'of' should call the constructor passing the 'anObject' argument.", function () {
      waveshaper = WaveShaper.of()
      expect(waveshaper instanceof WaveShaper).to.be.true

      const object = { freq: 100 }
      waveshaper = WaveShaper.of(object)
      expect(waveshaper.freq).to.equal(object.freq)
    })
  })
})
