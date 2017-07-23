// const socket = new WebSocket('ws://localhost:8080');

// socket.onmessage = message => {
//     console.log('Websocket message: ', JSON.parse(message.data).args);
// };

// socket.onerror = error => reject(error);

////////////////////////////////////////////////////////////
// Sound
////////////////////////////////////////////////////////////
const audioCtx = new AudioContext();

// custom periodic waveform
var mag1 = Math.random() * 0.5 + 0.4, phase1 = 0.0, mag2 = Math.random() * 0.5 + 0.4, phase2 = Math.PI * Math.random(), mag3 = Math.random() * 0.5 + 0.4, phase3 = Math.PI * Math.random();
var real = new Float32Array([0, mag1 * Math.cos(phase1), mag2 * Math.cos(phase2), mag3 * Math.cos(phase3)]);
var imag = new Float32Array([0, mag1 * Math.sin(phase1), mag2 * Math.sin(phase2), mag3 * Math.sin(phase3)]);
var wave = audioCtx.createPeriodicWave(real, imag);

const  synth = ( (context, wave, shaperType = 'sawtooth') => {
    return function(freq, amp, dur) {
	const shapingFunction = context.createOscillator();
	const inputFunction = context.createOscillator();
	const gain = context.createGain();
	const indexFunction = context.createGain();

	// console.log('Inside synth ', freq, amp, dur);
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
    };
})(audioCtx, wave);


function asrEnvelope(attack = 0.5, sustain = 0.0, release = 0.5, startValue = 0.0, endValue = 1,  gainNode, context) {
    // console.log('Inside asrEnvelope', context);
    const now = context.currentTime;

    gainNode.gain.cancelScheduledValues(0);
    gainNode.gain.setValueAtTime(startValue, now);
    gainNode.gain.linearRampToValueAtTime(endValue, now + attack);
    gainNode.gain.linearRampToValueAtTime(startValue, now + attack + sustain + release);
};

////////////////////////////////////////////////////////////
// Button
////////////////////////////////////////////////////////////

const button = document.querySelector('input');

console.log('Button: ', button);

if (button) {
    button.addEventListener('click', event => {
	console.log('Inside click callback');
	if (button.value === 'Start') {
	    button.value = 'Stop';
	} else {
	    button.value = 'Start';
	};
    });
};
////////////////////////////////////////////////////////////
// Websockets
////////////////////////////////////////////////////////////

const wsMsgHandler = {
    '/note': synth,
    '/start':  () => {}, 
    '/end': () => {}
};

const websocketPromise = new Promise( (resolve, reject) => {
    const socket = new WebSocket('ws://localhost:8080');

    // console.log('Inside websocketpromise');
    socket.onmessage = message => {
	const msg = JSON.parse(message.data);
	console.log('Websocket message: ', msg.args, msg.type, msg);

	wsMsgHandler[msg.type](...msg.args, audioCtx);
    };
    socket.onopen = () => resolve(socket);
    socket.onerror = () => reject(socket);
});

// websocketPromise.then( socket => {
//     console.log('After websocketPromise');
//     return  new Promise( resolve => {
// 	console.log('\tAfter websocketPromise. on message');
// 	socket.onmessage = message => resolve(message);
//     });
// })
websocketPromise.then( socket => {
    console.log('*** Sending websocket msg');
    setInterval( () => socket.send('Hallo from client'), 4000);
}).catch( console.log.bind(console) );
