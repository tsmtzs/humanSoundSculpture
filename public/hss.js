// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// ////////////////////////////////////////////////////////////
import { Maybe } from './functors.mjs';
import Sound from './sound.mjs';
import { toggleFullScreen } from './generalFunctions.mjs';

// ////////////////////////////////////////////////////////////
// Functions
// ////////////////////////////////////////////////////////////

// Event Listeners
const addEventListener = eventType => htmlElement => listener =>  {
    htmlElement.addEventListener(eventType, listener);
};
// Listener for 'startButton' and 'shutdownButton' html elements
const buttonListener =  socket => valueFunc => button => event => {
    // Send web server the value of the button.
    socket.send(button.value);
    // Change the value of the button.
    button.value = valueFunc(button.value);
};
// Listener for the h2 element.
const tapListener = element => event => {
    const inputElements = Array.from(document.body.getElementsByTagName('input'));

    // Show all input buttons.
    inputElements.forEach(elem => elem.type = 'button');

    // Remove h2 element from the node tree.
    document.body.removeChild(element);

    // Set body in full screen.
    toggleFullScreen(document.body);
   };
// WebSocket message handler.
const wsMsgHandler = func => {
    return {
	'/note': func,		// 'func' accepts the arguments freq, amp, dur.
	// '/action': do something on messages of type 'start', 'stop', 'end', 'shutdown'.
	// Do nothing for now.
	'/action': () => {}
    };
};
// WebSockets listener.
const wsListener = msgHandlerObj => message => {
    const msg = JSON.parse(message.data);
    console.log(msg);
    msgHandlerObj[msg.type](...msg.args);

    console.log('Websocket message: ', msg.args, msg.type, msg);
    
};
// WebSocket 'open' event listener.
const wsOpenListener = event => {
    ////////////////////////////////////////////////////////////
    // Start button
    ////////////////////////////////////////////////////////////
    const startBtnMaybe = Maybe.of(document.getElementById('startBtn'));

    // On every 'click' event send a 'start' / 'stop'
    // message to the web server.
    startBtnMaybe.map(addEventListener('click'))
	.ap(startBtnMaybe.map(buttonListener(socket)(x => x === 'play' ? 'stop' : 'play')));

    ////////////////////////////////////////////////////////////
    // Shutdown computer button
    ////////////////////////////////////////////////////////////
    const shutdownBtnMaybe = Maybe.of(document.getElementById('shutdownBtn'));
    
    // When conductor double clicks the button,
    // send a 'shutdown' message to web server.
    shutdownBtnMaybe.map(addEventListener('dblclick'))
	.ap(shutdownBtnMaybe.map(buttonListener(socket)(() => 'goodbye hss!')));

    // ////////////////////////////////////////////////////////////
    // Start AudioContext and play sound.
    // ////////////////////////////////////////////////////////////
    const sound = new Sound();

    // WebSocket message handler.
    const wsMsgHandlerObj = wsMsgHandler(sound.play.bind(sound)); // Grrrr... 'this' is very annoying

    socket.onmessage = wsListener(wsMsgHandlerObj);

    ////////////////////////////////////////////////////////////
    // Test button
    ////////////////////////////////////////////////////////////
    const testButton = document.getElementById('soundCheckBtn');

    addEventListener('click')(testButton)(createTestSynth(sound));
};

// Sound related functions
// Play sound on clicking the 'Test' button
const createTestSynth = soundObj => {
    // A random frequency for each client. 
    const freq = 400.0 + Math.random() * 600;
    // Max duration of sound.
    const dur = 20;
    // Check sound in high amplitude. Adjust device volume.
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
// ////////////////////////////////////////////////////////////
// Get the html element with id 'tapEl'.
// This element is used to enable the AudioContext.
// ////////////////////////////////////////////////////////////
const tapEl = document.getElementById('tapEl');

tapEl.addEventListener('click', tapListener(tapEl), {once: true});

// ////////////////////////////////////////////////////////////
// Websockets
// ////////////////////////////////////////////////////////////
// Initialize WebSockets
// 'hss_ip' and 'node_port' are
// bash environment variables.
// For each session they are set in server.js with a 'sed' command.
// After perfomance, they are unset in bin/setEnvirParNames.sh'
// when the hss-webServer.service stops.
const socket = new WebSocket('wss://HSS_IP:NODE_PORT');

socket.onerror = event => console.log('ERROR in WebSocket', event);

socket.onopen = wsOpenListener;

// Initialize mobileConsole. Post console messages on the web page.
// Usefull for tests. 
// if (mobileConsole) mobileConsole.init();
