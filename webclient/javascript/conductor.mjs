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

const addStartBtnPointerdownListeners = event => {
  const startBtn = document.querySelector(`#${PARAMETERS.ELEMENT_ID.START_BTN}`)

  startBtn.addEventListener('pointerdown', event => {
    socket.send(startBtn.value)
  })
  startBtn.addEventListener('pointerdown', event => {
    startBtn.value = startBtn.value === 'play' ? 'stop' : 'play'
  })
}

const addShutdownBtnPointerEventListeners = event => {
  const shutdownBtn = document.querySelector(`#${PARAMETERS.ELEMENT_ID.SHUTDOWN_BTN}`)

  let id

  shutdownBtn.addEventListener('pointerdown', event => {
    console.log('Shutdown pressed')

    id = setTimeout(() => {
      console.log('More than 2s')
      socket.send(shutdownBtn.value)
      shutdownBtn.value = 'HSS ended'
    },
		    PARAMETERS.SHUTDOWN_WAIT_TIME
		   )
  })

  shutdownBtn.addEventListener('pointerup', event => {
    console.log('Shutdown released', id)
    clearTimeout(id)
  })
}

const openWebSockets = new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve)
  socket.onerror = reject
})

openWebSockets
  .then(setTapMsg)
  .then(addTapListeners)
  .then(addTestSoundBtnListeners)
  .then(addWsMsgListenerTo(socket))
  .then(addStartBtnPointerdownListeners)
  .then(addShutdownBtnPointerEventListeners)
  // .catch(wsErrorListener)
  .catch(console.error)
