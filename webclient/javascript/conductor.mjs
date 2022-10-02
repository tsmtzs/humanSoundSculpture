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

const addStartBtnPointerDownListeners = event => {
  const startBtn = document.querySelector(`#${PARAMETERS.ELEMENT_ID.START_BTN}`)

  startBtn.addEventListener('pointerdown', event => {
    socket.send(startBtn.value)
  })
  startBtn.addEventListener('pointerdown', event => {
    startBtn.value = startBtn.value === 'play' ? 'stop' : 'play'
  })
}

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
  .then(addStartBtnPointerDownListeners)
  // .catch(wsErrorListener)
  .catch(console.error)
