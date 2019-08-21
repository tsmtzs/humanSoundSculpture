window.onload = () => {
    ////////////////////////////////////////////////////////////
    // Sound
    ////////////////////////////////////////////////////////////
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
	gainNode.gain.setValueAtTime(endValue, now + attack + sustain);
	gainNode.gain.linearRampToValueAtTime(startValue, now + attack + sustain + release);
    };

    ////////////////////////////////////////////////////////////
    // Button
    ////////////////////////////////////////////////////////////

    const button = document.querySelector('input');

    ////////////////////////////////////////////////////////////
    // Websockets
    ////////////////////////////////////////////////////////////

    const wsMsgHandler = ( (aButton) => {
	return {
	    '/note': synth,
	    '/action':  (action) => { if (aButton) aButton.value = {play: 'stop', stop: 'play'}[action]; }
	}
    })(button);

    const websocketPromise = new Promise( (resolve, reject) => {
	// const socket = new WebSocket('ws://localhost:8080');
	const socket = new WebSocket('ws://192.168.10.2:8080');

	// console.log('Inside websocketpromise');
	socket.onmessage = message => {
	    const msg = JSON.parse(message.data);
	    console.log('Websocket message: ', msg.args, msg.type, msg);

	    wsMsgHandler[msg.type](...msg.args);
	};
	socket.onopen = () => resolve(socket);
	socket.onerror = () => reject(socket);
    });

    websocketPromise.then( socket => {
	console.log('*** Sending websocket msg');

	if (button) {
	    button.addEventListener('click', event => {
		// console.log('Inside click callback');

		socket.send(button.value);
		
		if (button.value === 'play') {
		    button.value = 'stop';
		} else {
		    button.value = 'play';
		};

	    });
	};
    }).catch( console.log.bind(console) );
};
