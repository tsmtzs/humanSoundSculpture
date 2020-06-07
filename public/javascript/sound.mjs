// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// This module defines a Sound object.
// ////////////////////////////////////////////////////////////
export default class Sound {
    constructor() {
	// Create an instance of AudioContext;
	this.context = new AudioContext();
	// Define parameters for the sound.
	this.mag1 = Math.random() * 0.5 + 0.4;
	this.phase1 = 0.0;
	this.mag2 = Math.random() * 0.5 + 0.4;
	this.phase2 = Math.PI * Math.random();
	this.mag3 = Math.random() * 0.5 + 0.4;
	this.phase3 = Math.PI * Math.random();;
	this.real = new Float32Array([0, this.mag1 * Math.cos(this.phase1), this.mag2 * Math.cos(this.phase2), this.mag3 * Math.cos(this.phase3)]);
	this.imag = new Float32Array([0, this.mag1 * Math.sin(this.phase1), this.mag2 * Math.sin(this.phase2), this.mag3 * Math.sin(this.phase3)]);
	this.wave = this.context.createPeriodicWave(this.real, this.imag);
    }

    // A wave shaping synth.
    play(freq, amp, dur) {
	const shapingFunction = this.context.createOscillator();
	const inputFunction = this.context.createOscillator();
	const gain = this.context.createGain();
	const indexFunction = this.context.createGain();

	shapingFunction.type = 'sawtooth';

	// amp envelope
	this.asrEnv(0.25 * dur, 0.5 * dur, 0.25 * dur, 0.0, amp, gain);
	inputFunction.frequency.value = freq;

	// apply triangular shape to index function
	this.asrEnv(0.5 * dur, 0.0,  0.5 * dur, 50, Math.random() * 800 + 700, indexFunction);
	inputFunction.connect(indexFunction);

	indexFunction.connect(shapingFunction.frequency);

	inputFunction.setPeriodicWave(this.wave);
	shapingFunction.frequency.value = 0;

	shapingFunction.connect(gain);
	gain.connect(this.context.destination);

	inputFunction.start(0);
	shapingFunction.start(0);
	shapingFunction.stop(this.context.currentTime + dur);
	inputFunction.stop(this.context.currentTime + dur);

	return shapingFunction;
    }

    // An asr envelope.
    // Better if defined in a separate 'Envelope' object.
    // But...
    asrEnv(attack = 0.5, sustain = 0.0, release = 0.5, startValue = 0.0, endValue = 1,  gainNode) {
	const now = this.context.currentTime;

	gainNode.gain.cancelScheduledValues(0);
	gainNode.gain.setValueAtTime(startValue, now);
	gainNode.gain.linearRampToValueAtTime(endValue, now + attack);
	gainNode.gain.setValueAtTime(endValue, now + attack + sustain);
	gainNode.gain.linearRampToValueAtTime(startValue, now + attack + sustain + release);
    }
}
