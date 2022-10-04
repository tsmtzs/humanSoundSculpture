/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for the class Sounds.
// //////////////////////////////////////////////////
import {
  Sounds,
  WaveShaper
} from '../../webclient/javascript/sound.mjs'

import sinon from 'sinon'

import pkg from 'chai'
const { expect } = pkg

describe('Tests for sound.mjs.', function () {
  beforeEach(function () {
    global.window = {}
  })

  describe("Class 'Sound'.", function () {
    let sounds
    let context

    beforeEach(function () {
      context = {
        destination: Symbol('destination'),
        resume: sinon.fake(),
        isContext: Symbol('context'),
        [this.isContext]: true,
        [Symbol.hasInstance] (obj) {
          return 'isContext' in obj
        }
      }
      global.window.AudioContext = context
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Contructor should throw an error when the argument is not an instance of AudioContext or not undefined.', function () {
      expect(() => { new Sounds() }).to.not.throw()

      const object = {}
      expect(() => { new Sounds(object) }).to.throw()
      expect(() => { new Sounds(context) }).to.not.throw()
    })

    it("Constructor should create an instance with property 'context' and value undefined when called with no arguments.", function () {
      sounds = new Sounds()
      expect(sounds.context).to.be.undefined
    })

    it("Constructor should create an instance with property 'context' set equal to the given argument.", function () {
      sounds = new Sounds(context)
      expect(sounds.context).to.equal(context)
    })

    it("Getter 'destination' should return undefined if 'context' is undefined.", function () {
      sounds = new Sounds()
      expect(sounds.destination).to.be.undefined
    })

    it("Getter 'destination' should return 'context.destination' if 'context' is NOT undefined.", function () {
      sounds = new Sounds(context)
      expect(sounds.destination).to.equal(context.destination)
    })

    it("Method 'init' should throw an error if the property 'context' is undefined.", function () {
      sounds = new Sounds()
      expect(() => { sounds.init() }).to.throw()

      sounds = new Sounds(context)
      expect(() => { sounds.init() }).to.not.throw()
    })

    it("Method 'init' should send the 'resume' message to 'context'.", function () {
      sounds = new Sounds(context)
      sounds.init()
      expect(context.resume.calledOnce).to.be.true
    })

    it.skip("Method 'setType' should throw an error when the first or second argument is undefined.", function () {
    })

    it.skip("Method 'setType' should throw an error when the first argument is not a String.", function () {
    })

    it("Method 'setType', when called with first argument 'type' and second argument 'synth', should set the key 'type' of property 'types' to value 'synth'.", function () {
      sounds = new Sounds(context)
      const synth = { }
      const type = 'type'
      sounds.setType(type, synth)
      expect(sounds.getType(type)).to.equal(synth)
    })

    it.skip("Method 'create' should throw an error if the given 'type' is not a key of the 'types' property.", function () {
      sounds = new Sounds(context)
      sounds.create({ type: 'Test' })
    })

    it("Method 'allTypes' should return an Array with the keys of the 'types' property.", function () {
      sounds = new Sounds(context)
      expect(sounds.allTypes.length).to.equal(0)

      const synth = { }
      const type = 'type'
      sounds.setType(type, synth)
      expect(sounds.allTypes.length).to.equal(1)
      expect(sounds.allTypes[0]).to.equal(type)
    })

    it("Method 'create' should throw when the 'type' key of the argument is undefined.", function () {
      sounds = new Sounds(context)
      expect(() => { sounds.create() }).to.throw()
    })

    it("Method 'create' should throw when the 'type' key of the argument is not a key of the 'types' property.", function () {
      sounds = new Sounds(context)
      const type = 'type'
      expect(() => { sounds.create({ type }) }).to.throw()

      sounds.setType(type, function () { })
      expect(() => { sounds.create({ type }) }).to.not.throw()
    })

    it("Method 'create' should create a new instance of the constructor that corresponds to the given 'type'.", function () {
      sounds = new Sounds(context)
      const type = 'type'
      const fake = sinon.fake()
      const synth = function () {
        if (new.target) fake()
      }
      sounds.setType(type, synth)

      sounds.create({ type, name: 'test' })
      expect(fake.calledOnce).to.be.true
    })

    it("Method 'create' should add the key 'name' to the property 'objectNames' with value an instance of 'type'.", function () {
      sounds = new Sounds(context)
      const name = 'test'
      const type = 'type'
      const synth = function () { }
      sounds.setType(type, synth)

      sounds.create({ type, name })
      expect(sounds.get(name).constructor).to.equal(synth)
    })

    it("Getter 'objectNames' should return an Array with the keys of 'objectPool'.", function () {
      sounds = new Sounds(context)
      expect(sounds.objectNames.length).to.equal(0)

      const name = 'test'
      const type = 'type'
      const synth = function () { }
      sounds.setType(type, synth)
      sounds.create({ type, name })

      expect(sounds.objectNames.length).to.equal(1)
      expect(sounds.objectNames[0]).to.equal(name)

      sounds.create({ type, name })
      expect(sounds.objectNames.length).to.equal(1)

      sounds.create({ type, name: name + 2 })
      expect(sounds.objectNames.length).to.equal(2)
    })

    it("Method 'delete' should throw an error if the argument 'name' is not a key of 'objectPool' or is undefined.", function () {
      sounds = new Sounds(context)
      const name = 'test'
      expect(() => { sounds.delete(name) }).to.throw()
      expect(() => { sounds.delete() }).to.throw()
    })

    it("Method 'delete', when called with first argument 'name', should delete the key 'name' from 'objectPool'.", function () {
      sounds = new Sounds(context)
      const name = 'test'
      const type = 'type'
      const synth = function () { }
      synth.prototype.stop = () => { }
      sounds.setType(type, synth)
      sounds.create({ type, name })
      sounds.delete(name)

      expect(sounds.get(name)).to.be.undefined
    })

    it("Method 'delete', when called with first argument 'name', should send the message 'stop' to the object at key 'name' of 'objectPool'.", function () {
      sounds = new Sounds(context)
      const name = 'test'
      const type = 'type'
      const synth = function () { }
      sounds.setType(type, synth)

      sounds.create({ type, name })
      expect(() => { sounds.delete(name) }).to.not.throw()

      synth.prototype.stop = sinon.fake()
      const params = { }
      sounds.create({ type, name })
      sounds.delete(name, params)
      expect(synth.prototype.stop.called).to.be.true
    })

    it("Method 'deleteAll' should send the 'stop' message to all values of 'objectPool'.", function () {
      sounds = new Sounds(context)
      const type = 'type'
      const synth = function () { }
      synth.prototype.stop = sinon.fake()
      sounds.setType(type, synth)

      sounds.create({ type, name: 'name1' })
      sounds.create({ type, name: 'name2' })

      const params = { }
      sounds.deleteAll(params)
      expect(synth.prototype.stop.calledWith(params)).to.be.true
      expect(synth.prototype.stop.callCount).to.equal(2)
    })

    it("Method 'deleteAll' should send the clear the map 'objectPool'.", function () {
      sounds = new Sounds(context)
      const type = 'type'
      const synth = function () { }
      synth.prototype.stop = () => { }
      sounds.setType(type, synth)

      sounds.create({ type, name: 'name1' })
      sounds.create({ type, name: 'name2' })

      const params = { }
      sounds.deleteAll(params)
      expect(sounds.objectNames.length).to.equal(0)
    })

    it("Method 'perform' with arguments 'name', 'selector', 'params', should send the message 'selector to key 'name' of 'objectPool' passing 'params'.", function () {
      sounds = new Sounds(context)
      const type = 'type'
      const name = 'name'
      const synth = function () { }
      synth.prototype.selector = sinon.fake()
      sounds.setType(type, synth)
      sounds.create({ type, name })

      const params = { }
      sounds.perform(name, 'selector', params)
      expect(synth.prototype.selector.calledOnceWith(params)).to.be.true

      expect(() => { sounds.perform(name, 'no-selector') }).to.not.throw()
    })
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
