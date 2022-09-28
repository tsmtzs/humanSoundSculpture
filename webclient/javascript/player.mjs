/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'
import { Maybe } from './functors.mjs'
import {
  wsErrorListener,
  wsOpenListener,
  setTapMsg,
  addTapListeners
} from './common.mjs'
// import Sound from './sound.mjs'

// ////////////////////////////////////////////////////////////
// Get the html element with id 'textMsg'.
// This element is used to post messages on the page.
//    * On WebSocket load prints 'wsLoadMsg'
//    * On WebSocket error prints 'wsErrorMsg'
// ////////////////////////////////////////////////////////////
const textMsgElement = document.querySelector(`#${PARAMETERS.ELEMENT_ID.TEXT_MSG}`)

const ip = PARAMETERS.WEBSOCKETS.IP
const port = PARAMETERS.WEBSOCKETS.PORT
const socket = new WebSocket(`wss://${ip}:${port}`)

// // Event Listeners
// const addEventListener = eventType => htmlElement => listener => {
//   htmlElement.addEventListener(eventType, listener)
// }
// // // Listener for 'startButton' and 'shutdownButton' html elements
// // const buttonListener = socket => valueFunc => button => event => {
// //   // Send web server the value of the button.
// //   socket.send(button.value)
// //   // Change the value of the button.
// //   button.value = valueFunc(button.value)
// // }

// // WebSocket message handler.
// const wsMsgHandler = func => {
//   return {
//     '/note': func, // 'func' accepts the arguments freq, amp, dur.
//     // '/action': do something on messages of type 'start', 'stop', 'end', 'shutdown'.
//     // Do nothing for now.
//     '/action': () => {}
//   }
// }
// // WebSockets listener.
// const wsListener = msgHandlerObj => message => {
//   const msg = JSON.parse(message.data)
//   msgHandlerObj[msg.type](...msg.args)

//   // console.log('Websocket message: ', msg.args, msg.type, msg)
// }

// // Sound related functions
// // Play sound on clicking the 'Test' button
// const createTestSynth = soundObj => {
//   // A random frequency for each client.
//   const freq = 400.0 + Math.random() * 600
//   // Max duration of sound.
//   const dur = 20
//   // Check sound in high amplitude. Adjust device volume.
//   const amp = 0.9
//   let synth

//   return () => {
//     if (synth) {
//       synth.stop(0)
//       synth = null
//     } else {
//       synth = soundObj.play(freq, amp, dur)
//       synth.addEventListener('ended', event => { synth = null })
//     }
//   }
// }

// ////////////////////////////////////////////////////////////
const openWebSockets = new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve)
  socket.onerror = reject
})

openWebSockets
  .then(wsOpenListener)
  .then(setTapMsg)
  .then(addTapListeners)
  .catch(wsErrorListener)
