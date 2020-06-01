// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// ////////////////////////////////////////////////////////////
import { Maybe } from './functors.mjs';
import Sound from './sound.mjs';

// tap combinator
// const tap = func => a => (func(a), a);

const addEventListener = eventType => htmlElement => listener =>  {
    htmlElement.addEventListener(eventType, listener);
};
// Listener for 'startButton' html element
const startButtonListener =  socket => startButton => event => {
    // Send web server the value of the button.
    socket.send(startButton.value);
    // Change the value of the button.
    startButton.value = startButton.value === 'play' ? 'stop' : 'play';
};
// Listener for 'startButton' html element
const shutdownBtnListener = socket => shutdownButton => event => {
    // Send to web server the value of the button.
    socket.send(shutdownBtn.value);
    // Change the value of the button.
    shutdownBtn.value = 'goodbye HSS';
};
// Play sound on clicking the 'Test' button
const createTestSynth = soundObj => {
    // A random frequency for each client. 
    const freq = 400.0 + Math.random() * 600;
    // Max duration of sound.
    const dur = 20;
    // Check sound in hight volume. Adjust device volume.
    const amp = 0.9;
    let synth;
    
    return () => {
	if (synth) {
    	    synth.stop(0);
    	    synth = null;
	} else {
    	    synth = soundObj.play(freq, amp, dur);
    	    synth.addEventListener('ended', event => synth = null);
	}	
    };
};
// WebSockets listener
const wsListener = msgHandlerObj => message => {
    const msg = JSON.parse(message.data);
    console.log(msg);
    msgHandlerObj[msg.type](...msg.args);

    console.log('Websocket message: ', msg.args, msg.type, msg);
    
};

// ////////////////////////////////////////////////////////////
// Websockets
// ////////////////////////////////////////////////////////////
// Initialize WebSockets
// 'hss_ip' and 'websocket_port' are
// bash environment variables.
// For each session they are set in server.js with a 'sed' command.
// After perfomance, they are unset in bin/setEnvirParNames.sh'
// when the hss-webServer.service stops.
const socket = new WebSocket('ws://192.168.10.2:8080');

socket.onmessage = wsListener(wsMsgHandlerObj);

socket.onopen = () => console.log('WebSocket open');
socket.onerror = event => console.log('ERROR in WebSocket', event);

socket.addEventListener('open', event => {
    ////////////////////////////////////////////////////////////
    // Start button
    ////////////////////////////////////////////////////////////
    const startBtnMaybe = Maybe.of(document.getElementById('startBtn'));

    // On every 'click' event send a 'start' / 'stop'
    // message to the web server.
    startBtnMaybe.map(addEventListener('click'))
	.ap(startBtnMaybe.map(startButtonListener(socket)));

    ////////////////////////////////////////////////////////////
    // Shutdown computer button
    ////////////////////////////////////////////////////////////
    const shutdownBtnMaybe = Maybe.of(document.getElementById('shutdownBtn'));
    
    // When conductor double clicks the button,
    // send a 'shutdown' message to web server.
    shutdownBtnMaybe.map(addEventListener('dblclick'))
	.ap(shutdownBtnMaybe.map(shutdownBtnListener(socket)));

    // ////////////////////////////////////////////////////////////
    // Start AudioContext and play sound.
    // ////////////////////////////////////////////////////////////
    const sound = new Sound();

    // WebSocket message handler.
    const wsMsgHandlerObj = {
	'/note': sound.play.bind(sound), // Grrrr... 'this' is very annoying
	// '/action': do something on messages of type 'start', 'stop', 'end', 'shutdown'.
	// Do nothing for now.
	'/action': () => {}
    };

    ////////////////////////////////////////////////////////////
    // Test button
    ////////////////////////////////////////////////////////////
    const testButton = document.getElementById('soundCheckBtn');

    testButton.addEventListener('click', createTestSynth(sound));
});

// Initialize mobileConsole for posting console messages in the web page.
// if (mobileConsole) mobileConsole.init();
