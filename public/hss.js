// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// ////////////////////////////////////////////////////////////
import { Maybe } from './functors.mjs';

// tap combinator
const tap = func => a => (func(a), a);

const addEventListener = eventType => htmlElement => listener =>  {
    htmlElement.addEventListener(eventType, listener);
};
const startButtonListener =  socket => startButton => event => {
    // Send web server the value of the button.
    socket.send(startButton.value);
    // Change the value of the button.
    startButton.value = startButton.value === 'play' ? 'stop' : 'play';
};

// ////////////////////////////////////////////////////////////
// Websockets
// ////////////////////////////////////////////////////////////
// Initialize WebSockets
// 'HSS_IP' and 'WEBSOCKET_PORT' are
// bash environment variables.
// For each session they are set in server.js with a 'sed' command.
// After perfomance, they are unset in bin/setEnvirParNames.sh'
// from the hss-webServer@.service.
const socket = new WebSocket('ws://HSS_IP:WEBSOCKET_PORT');

// ////////////////////////////////////////////////////////////
// Sound
// ////////////////////////////////////////////////////////////
const audioCtx = new AudioContext();

// custom periodic waveform
const mag1 = Math.random() * 0.5 + 0.4, phase1 = 0.0, mag2 = Math.random() * 0.5 + 0.4, phase2 = Math.PI * Math.random(), mag3 = Math.random() * 0.5 + 0.4, phase3 = Math.PI * Math.random();
const real = new Float32Array([0, mag1 * Math.cos(phase1), mag2 * Math.cos(phase2), mag3 * Math.cos(phase3)]);
const imag = new Float32Array([0, mag1 * Math.sin(phase1), mag2 * Math.sin(phase2), mag3 * Math.sin(phase3)]);
const wave = audioCtx.createPeriodicWave(real, imag);

const  synth = ( (context, wave, shaperType = 'sawtooth') => {
    return function(freq, amp, dur) {
	const shapingFunction = context.createOscillator();
	const inputFunction = context.createOscillator();
	const gain = context.createGain();
	const indexFunction = context.createGain();

	shapingFunction.type = shaperType;

	// amp envelope
	asrEnvelope(0.25 * dur, 0.5 * dur, 0.25 * dur, 0.0, amp, gain, context);
	inputFunction.frequency.value = freq;

	// apply triangular shape to index function
	asrEnvelope(0.5 * dur, 0.0,  0.5 * dur, 50, Math.random() * 800 + 700, indexFunction, context);
	inputFunction.connect(indexFunction);

	indexFunction.connect(shapingFunction.frequency);

	inputFunction.setPeriodicWave(wave);
	shapingFunction.frequency.value = 0;

	shapingFunction.connect(gain);
	gain.connect(context.destination);

	inputFunction.start(0);
	shapingFunction.start(0);
	shapingFunction.stop(context.currentTime + dur);
	inputFunction.stop(context.currentTime + dur);

	return shapingFunction;
    };
})(audioCtx, wave);


function asrEnvelope(attack = 0.5, sustain = 0.0, release = 0.5, startValue = 0.0, endValue = 1,  gainNode, context) {
    // console.log('Inside asrEnvelope', context);
    const now = context.currentTime;

    gainNode.gain.cancelScheduledValues(0);
    gainNode.gain.setValueAtTime(startValue, now);
    gainNode.gain.linearRampToValueAtTime(endValue, now + attack);
    gainNode.gain.setValueAtTime(endValue, now + attack + sustain);
    gainNode.gain.linearRampToValueAtTime(startValue, now + attack + sustain + release);
};

socket.addEventListener('open', event => {

////////////////////////////////////////////////////////////
// Test button
////////////////////////////////////////////////////////////
// const testButton = document.getElementById('soundCheckBtn');
// // Random test frequency for each player.
// const testSynthFreq = 400.0 + Math.random()*600;
// let testSynth, testSynthMaxDur = 20, testSynthAmp = 0.9;

// testButton.addEventListener('click', event => {
//     if (testSynth) {
// 	testSynth.stop(0);
// 	testSynth = null;
//     } else {
// 	testSynth = synth(testSynthFreq, testSynthAmp, testSynthMaxDur);
// 	testSynth.addEventListener('ended', event => testSynth = null);
//     }
// });

////////////////////////////////////////////////////////////
// Start button
////////////////////////////////////////////////////////////
const startBtnMaybe = Maybe.of(document.getElementById('startBtn'));

    // On every 'click' event send a 'start' / 'stop'
    // message to the web server.
    startBtnMaybe.map(addEventListener('click'))
    .ap(startBtnMaybe.map(startButtonListener(socket)));

////////////////////////////////////////////////////////////
// Close computer button
////////////////////////////////////////////////////////////
// const shutdownBtn = document.getElementById('shutdownBtn');

// // add 'dblclick' event listener if client loaded 'conductor.html'
// if (shutdownBtn) {
//     shutdownBtn.addEventListener('dblclick', event => {
// 	// console.log('Inside dblclick callback');

// 	socket.send(shutdownBtn.value);
	
// 	shutdownBtn.value = 'goodbye HSS';
//     });
// };


// WebSocket message handler.
const wsMsgHandlerObj = {
    '/note': synth,
    // '/action': do something on messages of type 'start', 'stop', 'end', 'shutdown'.
    // Do nothing for now.
    '/action': () => {}
};

// console.log('Inside websocketpromise');
socket.onmessage = message => {
    const msg = JSON.parse(message.data);
    console.log(msg);
    wsMsgHandlerObj[msg.type](...msg.args);

    console.log('Websocket message: ', msg.args, msg.type, msg);
    
};

socket.onopen = () => console.log('WebSocket open');
socket.onerror = () => console.log('ERROR in WebSocket');

// Initialize mobileConsole for posting console messages in the web page.
// if (mobileConsole) mobileConsole.init();
});
