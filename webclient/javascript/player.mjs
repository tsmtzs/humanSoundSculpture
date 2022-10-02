/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'
import {
  wsErrorListener,
  setTapMsg,
  addTapListeners,
  addTestSoundBtnListeners,
  addWsMsgListenerTo
} from './common.mjs'

const ip = PARAMETERS.WEBSOCKETS.IP
const port = PARAMETERS.WEBSOCKETS.PORT
// const socket = new WebSocket(`wss://${ip}:4000`)
const socket = new WebSocket(`wss://${ip}:${port}`)

const openWebSockets = new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve)
  socket.onerror = reject
})

openWebSockets
  .then(setTapMsg)
  .then(addTapListeners)
  .then(addTestSoundBtnListeners)
  .then(addWsMsgListenerTo(socket))
  .catch(wsErrorListener)
  // .catch(console.error)
