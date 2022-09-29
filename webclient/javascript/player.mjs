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
  addTapListeners,
  addTestSoundBtnListeners
} from './common.mjs'

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
// ////////////////////////////////////////////////////////////
const openWebSockets = new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve)
  socket.onerror = reject
})

openWebSockets
  .then(wsOpenListener)
  .then(setTapMsg)
  .then(addTapListeners)
  .then(addTestSoundBtnListeners)
// .catch(wsErrorListener)
  .catch(console.error)
