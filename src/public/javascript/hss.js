/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// Web client javascript for the pages 'Player' and 'Conductor'.
// ////////////////////////////////////////////////////////////
import { Maybe } from './functors.mjs'
import Sound from './sound.mjs'

// ////////////////////////////////////////////////////////////
// Constants
// ////////////////////////////////////////////////////////////
const wsOpenMsg = 'Tap on this sentence to enable sound.'
const wsErrorMsg = 'Not connected to server.'

// ////////////////////////////////////////////////////////////
// Get the html element with id 'textMsg'.
// This element is used to post messages on the page.
//    * On WebSocket load prints 'wsLoadMsg'
//    * On WebSocket error prints 'wsErrorMsg'
// ////////////////////////////////////////////////////////////
const textMsgMaybe = Maybe.of(document.getElementById('textMsg'))

// ////////////////////////////////////////////////////////////
// Websockets
// ////////////////////////////////////////////////////////////
// Initialize WebSockets
// 'HSS_IP' and 'HSS_HTTP_PORT' are
// global variables.
const socket = new WebSocket('wss://$HSS_IP:$HSS_HTTP_PORT')

// ////////////////////////////////////////////////////////////
// Functions
// ////////////////////////////////////////////////////////////
// Set text to a DOM element
const setText = text => function (elem) { elem.textContent = text }
// Event Listeners
const addEventListener = eventType => htmlElement => listener => {
  htmlElement.addEventListener(eventType, listener)
}
// Listener for 'startButton' and 'shutdownButton' html elements
const buttonListener = socket => valueFunc => button => event => {
  // Send web server the value of the button.
  socket.send(button.value)
  // Change the value of the button.
  button.value = valueFunc(button.value)
}
// Listener for the <p> element with ID 'textMsg'.
const tapListener = element => event => {
  const inputElements = Array.from(document.body.getElementsByTagName('input'))

  // Show all input buttons.
  inputElements.forEach(elem => { elem.type = 'button' })

  // Remove h2 element from the node tree.
  document.body.removeChild(element)
}
// WebSocket message handler.
const wsMsgHandler = func => {
  return {
    '/note': func, // 'func' accepts the arguments freq, amp, dur.
    // '/action': do something on messages of type 'start', 'stop', 'end', 'shutdown'.
    // Do nothing for now.
    '/action': () => {}
  }
}
// WebSockets listener.
const wsListener = msgHandlerObj => message => {
  const msg = JSON.parse(message.data)
  msgHandlerObj[msg.type](...msg.args)

  // console.log('Websocket message: ', msg.args, msg.type, msg)
}
// WebSocket 'error' event listener.
const wsErrorListener = event => {
  // Set text to 'wsErrorMsg'
  textMsgMaybe.map(setText(wsErrorMsg))
  console.log('ERROR in WebSocket', event)
}
// WebSocket 'open' event listener.
const wsOpenListener = event => {
  // //////////////////////////////////////////////////////////
  // 'textMsg' element
  // //////////////////////////////////////////////////////////
  // Set text to 'wsOpenMsg'
  textMsgMaybe.map(setText(wsOpenMsg))
  // Attach the 'tapListener' function to the 'click' event.
  textMsgMaybe.map(addEventListener('click'))
    .ap(textMsgMaybe.map(tapListener))

  // //////////////////////////////////////////////////////////
  // Start button
  // //////////////////////////////////////////////////////////
  const startBtnMaybe = Maybe.of(document.getElementById('startBtn'))

  // On every 'click' event send a 'start' / 'stop'
  // message to the web server.
  startBtnMaybe.map(addEventListener('click'))
    .ap(startBtnMaybe.map(buttonListener(socket)(x => x === 'play' ? 'stop' : 'play')))

  // //////////////////////////////////////////////////////////
  // Shutdown computer button
  // //////////////////////////////////////////////////////////
  const shutdownBtnMaybe = Maybe.of(document.getElementById('shutdownBtn'))

  // When conductor double clicks the button,
  // send a 'shutdown' message to web server.
  shutdownBtnMaybe.map(addEventListener('dblclick'))
    .ap(shutdownBtnMaybe.map(buttonListener(socket)(() => 'hss ended')))

  // ////////////////////////////////////////////////////////////
  // Start AudioContext and play sound.
  // ////////////////////////////////////////////////////////////
  const sound = new Sound()

  // WebSocket message handler.
  const wsMsgHandlerObj = wsMsgHandler(sound.play.bind(sound)) // Grrrr... 'this' is very annoying

  socket.onmessage = wsListener(wsMsgHandlerObj)

  // //////////////////////////////////////////////////////////
  // Test button
  // //////////////////////////////////////////////////////////
  const testButton = document.getElementById('soundCheckBtn')

  addEventListener('click')(testButton)(createTestSynth(sound))
}

// Sound related functions
// Play sound on clicking the 'Test' button
const createTestSynth = soundObj => {
  // A random frequency for each client.
  const freq = 400.0 + Math.random() * 600
  // Max duration of sound.
  const dur = 20
  // Check sound in high amplitude. Adjust device volume.
  const amp = 0.9
  let synth

  return () => {
    if (synth) {
      synth.stop(0)
      synth = null
    } else {
      synth = soundObj.play(freq, amp, dur)
      synth.addEventListener('ended', event => { synth = null })
    }
  }
}

// ////////////////////////////////////////////////////////////
// Set WebSocket listeners
socket.onerror = wsErrorListener

socket.onopen = wsOpenListener
