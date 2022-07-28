/* eslint-env browser */
// ////////////////////////////////////////////////////////////
//  Human Sound Sculpture
//
// Sound related classes.
// ////////////////////////////////////////////////////////////
// Sound initializes the Web Audio API.
// Acts as container for all sound objects of the piece.
class Sounds {
  #objectPool = new Map()
  #types = new Map()
  #context

  constructor (aWebAudioContext) {
    this.context = aWebAudioContext
  }

  set context (aWebAudioContext) {
    if (this.#isNotAudioContext(aWebAudioContext)) {
      throw new Error('The given argument is not an AudioContext')
    }

    this.#context = aWebAudioContext
    this.#setContextToObjects(this.#context)
  }

  #isNotAudioContext (aWebAudioContext) {
    return aWebAudioContext === undefined ? false : !(aWebAudioContext instanceof window.AudioContext)
  }

  #setContextToObjects (context) {
    this.#objectPool.forEach(object => {
      object.context = context
    })
  }

  get context () {
    return this.#context
  }

  get destination () {
    return this.#context ? this.#context.destination : undefined
  }

  init () {
    if (this.#context === undefined) {
      throw new Error("Method 'init' should not called when property 'context' is undefined.")
    }

    this.#context.resume()
  }


  getType (type) {
    return this.#types.get(type)
  }

  setType (type, synth) {
    this.#types.set(type, synth)
  }

  // Get all synth types from the 'types' Map.
  get allTypes () {
    return Array.from(this.#types.keys())
  }

  create ({ type, name, params = {} } = {}) {
    if (this.#typeIsNotValid(type)) {
      throw new Error("The key 'type' should refer to a key of the 'types' property.")
    }

    const Synth = this.#types.get(type)
    const object = new Synth(Object.assign(params, { context: this.context }))
    this.#objectPool.set(name, object)
  }

  #typeIsNotValid (type) {
    return type === undefined || !this.#types.has(type)
  }

  get (name) {
    return this.#objectPool.get(name)
  }

  get objectNames () {
    return Array.from(this.#objectPool.keys())
  }

  delete (name, params = {}) {
    if (!this.#objectPool.has(name)) {
      throw new Error(`${name} is not a valid name.`)
    }
    this.get(name).stop?.(params)
    this.#objectPool.delete(name)
  }

  // Delete.allStates sound objects from objectPool
  deleteAll (params = {}) {
    this.#objectPool.forEach(object => { object.stop?.(params) })
    this.#objectPool.clear()
  }

  stop (name, params = {}) {
    this.perform(name, 'stop', params)
  }

  stopAll (params = {}) {
    this.performAll('stop', params)
  }

  disconnect (name, params = {}) {
    this.perform(name, 'disconnect', params)
  }

  disconnectAll () {
    this.performAll('disconnect', params)
  }

  start (name, params = {}) {
    this.perform(name, 'start', params)
  }

  play (name, params = {}) {
    this.perform(name, 'play', params)
  }

  perform (name, selector, params = {}) {
    this.get(name)[selector]?.(params)
  }

  performAll (selector, params = {}) {
    this.#objectPool.forEach(object => { object[selector]?.(params) })
  }
}

class WaveShape {
  // static #context

  // static set context () { }
  // static hasContext () { }

  // constructor () { }

  // play () { }

  // env () { }

  // stop () { }

  // disconnect () { }
}

export {
  Sounds,
  WaveShape
}

// export default class Sound {
//   constructor () {
//     // Create an instance of AudioContext
//     this.context = new AudioContext()
//     // Define parameters for the sound.
//     this.mag1 = Math.random() * 0.5 + 0.4
//     this.phase1 = 0.0
//     this.mag2 = Math.random() * 0.5 + 0.4
//     this.phase2 = Math.PI * Math.random()
//     this.mag3 = Math.random() * 0.5 + 0.4
//     this.phase3 = Math.PI * Math.random()
//     this.real = new Float32Array([0, this.mag1 * Math.cos(this.phase1), this.mag2 * Math.cos(this.phase2), this.mag3 * Math.cos(this.phase3)])
//     this.imag = new Float32Array([0, this.mag1 * Math.sin(this.phase1), this.mag2 * Math.sin(this.phase2), this.mag3 * Math.sin(this.phase3)])
//     this.wave = this.context.createPeriodicWave(this.real, this.imag)
//   }

//   // A wave shaping synth.
//   play (freq, amp, dur) {
//     const shapingFunction = this.context.createOscillator()
//     const inputFunction = this.context.createOscillator()
//     const gain = this.context.createGain()
//     const indexFunction = this.context.createGain()

//     shapingFunction.type = 'sawtooth'

//     // amp envelope
//     this.asrEnv(0.25 * dur, 0.5 * dur, 0.25 * dur, 0.0, amp, gain)
//     inputFunction.frequency.value = freq

//     // apply triangular shape to index function
//     this.asrEnv(0.5 * dur, 0.0, 0.5 * dur, 50, Math.random() * 800 + 700, indexFunction)
//     inputFunction.connect(indexFunction)

//     indexFunction.connect(shapingFunction.frequency)

//     inputFunction.setPeriodicWave(this.wave)
//     shapingFunction.frequency.value = 0

//     shapingFunction.connect(gain)
//     gain.connect(this.context.destination)

//     inputFunction.start(0)
//     shapingFunction.start(0)
//     shapingFunction.stop(this.context.currentTime + dur)
//     inputFunction.stop(this.context.currentTime + dur)

//     return shapingFunction
//   }

//   // An asr envelope.
//   // Better if defined in a separate 'Envelope' object.
//   // But...
//   asrEnv (attack = 0.5, sustain = 0.0, release = 0.5, startValue = 0.0, endValue = 1, gainNode) {
//     const now = this.context.currentTime

//     gainNode.gain.cancelScheduledValues(0)
//     gainNode.gain.setValueAtTime(startValue, now)
//     gainNode.gain.linearRampToValueAtTime(endValue, now + attack)
//     gainNode.gain.setValueAtTime(endValue, now + attack + sustain)
//     gainNode.gain.linearRampToValueAtTime(startValue, now + attack + sustain + release)
//   }
// }
