/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'
import {
  wsErrorListener,
  wsOpenListener,
  setTapMsg,
  addTapListeners,
  addTestSoundBtnListeners,
  addWsMsgListenerTo
} from './common.mjs'

const ip = PARAMETERS.WEBSOCKETS.IP
const port = PARAMETERS.WEBSOCKETS.PORT
// const socket = new WebSocket(`wss://${ip}:4000`)
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
  .then(addWsMsgListenerTo(socket))
  .catch(wsErrorListener)
  // .catch(console.error)
