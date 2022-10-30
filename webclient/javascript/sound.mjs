/* eslint-env browser */
// ////////////////////////////////////////////////////////////
//  Human Sound Sculpture
//
// Sound related classes.
// ////////////////////////////////////////////////////////////
class WaveShaper {
  #context
  #wave
  #isPlaying = false
  #shapingFunction
  #inputFunction
  #gain
  #index

  static of (anObject) {
    return new WaveShaper(anObject)
  }

  static getDefaultWave (context) {
    const mag1 = Math.random() * 0.5 + 0.4
    const phase1 = 0.0
    const mag2 = Math.random() * 0.5 + 0.4
    const phase2 = Math.PI * Math.random()
    const mag3 = Math.random() * 0.5 + 0.4
    const phase3 = Math.PI * Math.random()
    const real = new Float32Array([0, mag1 * Math.cos(phase1), mag2 * Math.cos(phase2), mag3 * Math.cos(phase3)])
    const imag = new Float32Array([0, mag1 * Math.sin(phase1), mag2 * Math.sin(phase2), mag3 * Math.sin(phase3)])
    return context.createPeriodicWave(real, imag)
  }

  constructor ({ freq = 440, amp = 0.1, dur = 1, wave, context } = {}) {
    this.freq = freq
    this.dur = dur
    this.amp = amp
    this.#wave = wave
    this.#context = context
  }

  get wave () {
    return this.#wave
  }

  set wave (wave) {
    this.#wave = wave
  }

  get context () {
    return this.#context
  }

  set context (aWebAudioContext) {
    this.#context = aWebAudioContext
  }

  play ({ freq, amp, dur, wave, time = 0 } = {}) {
    if (!this.#isPlaying) {
      this.#shapingFunction = this.#context.createOscillator()
      this.#inputFunction = this.#context.createOscillator()
      this.#gain = this.#context.createGain()
      this.#index = this.#context.createGain()

      this.#shapingFunction.type = 'sawtooth'
      this.#shapingFunction.frequency.value = 0.0

      this.#inputFunction.frequency.value = freq ?? this.freq
      this.#inputFunction.setPeriodicWave(wave ?? this.#wave)

      this.#inputFunction.connect(this.#index)
      this.#index.connect(this.#shapingFunction.frequency)
      this.#shapingFunction.connect(this.#gain)
      this.#gain.connect(this.#context.destination)

      const now = this.#context.currentTime
      const start = now + time
      const duration = dur ?? this.dur
      const end = start + duration

      this.#inputFunction.start(start)
      this.#shapingFunction.start(start)
      this.#inputFunction.stop(end)
      this.#shapingFunction.stop(end)

      const amplitude = amp ?? this.amp
      this.#env({ attack: 0.25 * duration, sustain: 0.5 * duration, release: 0.25 * duration, startValue: 0.0, endValue: amplitude, time: start, anAudioParam: this.#gain.gain })

      this.#env({ attack: 0.5 * duration, sustain: 0.0, release: 0.5 * duration, startValue: 50.0, endValue: Math.random() * 800 + 700, time: start, anAudioParam: this.#index.gain })

      this.#disconnectAtTime(end)
      this.#toggleIsPlaying()
    }
  }

  // An ASR envelope.
  #env ({ attack = 0.5, sustain = 0.0, release = 1.0, startValue = 0.0, endValue = 1, time = 0.0, anAudioParam } = {}) {
    const attackTime = time + attack
    const sustainTime = attackTime + sustain
    const releaseTime = sustainTime + release

    anAudioParam.cancelScheduledValues(time)
    anAudioParam.setValueAtTime(startValue, time)
    anAudioParam.linearRampToValueAtTime(endValue, attackTime)
    anAudioParam.setValueAtTime(endValue, sustainTime)
    anAudioParam.linearRampToValueAtTime(startValue, releaseTime)
  }

  #disconnectAtTime (time = 0.0) {
    setTimeout(() => {
      this.#inputFunction.disconnect()
      this.#shapingFunction.disconnect()
      this.#gain.disconnect()
      this.#index.disconnect()
    },
    time * 1000
    )
  }

  #toggleIsPlaying () {
    this.#isPlaying = !this.#isPlaying
  }

  start ({ freq, amp, wave, time = 0, fadeTime = 1 } = {}) {
    if (!this.#isPlaying) {
      this.#shapingFunction = this.#context.createOscillator()
      this.#inputFunction = this.#context.createOscillator()
      this.#gain = this.#context.createGain()
      this.#index = this.#context.createGain()

      this.#shapingFunction.type = 'sawtooth'
      this.#shapingFunction.frequency.value = 0.0

      this.#inputFunction.frequency.value = freq ?? this.freq
      this.#inputFunction.setPeriodicWave(wave ?? this.#wave)

      this.#inputFunction.connect(this.#index)
      this.#index.connect(this.#shapingFunction.frequency)
      this.#shapingFunction.connect(this.#gain)
      this.#gain.connect(this.#context.destination)

      const now = this.#context.currentTime
      const start = now + time

      this.#inputFunction.start(start)
      this.#shapingFunction.start(start)

      const amplitude = amp ?? this.amp

      this.#fade({ fadeTime, startValue: 0.0, endValue: amplitude, time: start, anAudioParam: this.#gain.gain })

      this.#fade({ fadeTime, startValue: 50.0, endValue: Math.random() * 800 + 700, time: start, anAudioParam: this.#index.gain })

      this.#toggleIsPlaying()
    }
  }

  #fade ({ fadeTime = 1.0, startValue = 1.0, endValue = 1e-6, time = 0.0, anAudioParam } = {}) {
    const fade = time + fadeTime

    anAudioParam.cancelScheduledValues(time)
    anAudioParam.setValueAtTime(Math.max(startValue, 1e-6), time)
    anAudioParam.exponentialRampToValueAtTime(Math.max(endValue, 1e-6), fade)
  }

  stop ({ fadeTime = 1.0, time = 0.0 } = {}) {
    if (this.#isPlaying) {
      const now = this.#context.currentTime
      const start = now + time
      const end = start + fadeTime

      const currentAmp = this.#gain.gain.value
      this.#fade({ fadeTime, startValue: currentAmp, endValue: 1e-6, time: start, anAudioParam: this.#gain.gain })

      const currentIndex = this.#index.gain.value
      this.#fade({ fadeTime, startValue: currentIndex, endValue: 1e-6, time: start, anAudioParam: this.#index.gain })

      this.#inputFunction.stop(end)
      this.#shapingFunction.stop(end)

      this.#disconnectAtTime(end)

      this.#toggleIsPlaying()
    }
  }
}

export { WaveShaper }
