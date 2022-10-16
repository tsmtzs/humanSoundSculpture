/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'
import { openWebSocketsAndAddListeners } from './common.mjs'

const socket = new WebSocket(PARAMETERS.WEBSOCKETS.URL)

const addStartBtnPointerdownListeners = event => {
  const startBtn = document.querySelector(`#${PARAMETERS.ELEMENT_ID.START_BTN}`)

  startBtn.addEventListener('pointerdown', event => {
    socket.send(JSON.stringify({ type: startBtn.textContent }))
  })
  startBtn.addEventListener('pointerdown', event => {
    startBtn.textContent = startBtn.textContent === 'play' ? 'stop' : 'play'
  })
}

const addShutdownBtnPointerEventListeners = event => {
  const shutdownBtn = document.querySelector(`#${PARAMETERS.ELEMENT_ID.SHUTDOWN_BTN}`)

  let id

  shutdownBtn.addEventListener('pointerdown', event => {
    id = setTimeout(() => {
      socket.send(JSON.stringify({ type: 'shutdown' }))
      shutdownBtn.textContent = 'HSS ended'
    },
    PARAMETERS.SHUTDOWN_WAIT_TIME
    )
  })

  shutdownBtn.addEventListener('pointerup', event => {
    clearTimeout(id)
  })
}

openWebSocketsAndAddListeners(socket)
  .then(addStartBtnPointerdownListeners)
  .then(addShutdownBtnPointerEventListeners)
  .catch(console.error)
