/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// Common objects for player.mjs and conductor.mjs.
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'
import {
  setTextToElement,
  getRemoveElementListener,
  getShowButtons,
  getWsMsgListener
} from './functions.mjs'
import { WaveShaper } from './sound.mjs'

const wsErrorMsg = PARAMETERS.WEBSOCKETS.ERROR_MSG
const wsOpenMsg = PARAMETERS.WEBSOCKETS.OPEN_MSG

const audioContext = new AudioContext()
const shaperFunction = WaveShaper.getDefaultWave(audioContext)
const textMsgElement = document.querySelector(`#${PARAMETERS.ELEMENT_ID.TEXT_MSG}`)
const soundTestButton = document.getElementById(PARAMETERS.ELEMENT_ID.SOUNDCHECK_BTN)

const wsErrorListener = event => {
  setTextToElement(wsErrorMsg + event.target.constructor.name, textMsgElement)
  // console.log('ERROR in WebSocket', event.target.constructor.name)
}

const setTapMsg = event => {
  setTextToElement(wsOpenMsg, textMsgElement)
}

const removeTextMsg = getRemoveElementListener(textMsgElement)
const showButtons = getShowButtons(document.body)
const initWebAudio = event => { audioContext.resume() }
const addTapListeners = event => {
  textMsgElement.addEventListener('pointerdown', removeTextMsg)
  textMsgElement.addEventListener('pointerdown', showButtons)
  textMsgElement.addEventListener('pointerdown', initWebAudio)
}

const addTestSoundBtnListeners = event => {
  const synth = WaveShaper.of({
    freq: PARAMETERS.TEST_BTN_FREQ, amp: 0.9, wave: shaperFunction, context: audioContext
  })

  soundTestButton.addEventListener('pointerdown', event => {
    synth.start()
  })
  soundTestButton.addEventListener('pointerup', event => {
    synth.stop()
  })
}

const wsMsgHandler = {
  '/note': (freq, amp, dur) => {
    WaveShaper.of({ freq, amp, dur, wave: shaperFunction, context: audioContext })
      .play()
  },
  // '/action': do something on messages of type 'start', 'stop', 'end', 'shutdown'.
  // Do nothing for now.
  '/action': () => {}
}

const addWsMsgListenerTo = aWebSocket => {
  const listener = getWsMsgListener(wsMsgHandler)
  return event => {
    aWebSocket.addEventListener('message', listener)
  }
}

const openWebSocketsAndAddListeners = (aWebSocket) => {
  const openWebSockets = new Promise((resolve, reject) => {
    aWebSocket.addEventListener('open', resolve)
    aWebSocket.onerror = reject
  })

  return openWebSockets
    .then(setTapMsg)
    .then(addTapListeners)
    .then(addTestSoundBtnListeners)
    .then(addWsMsgListenerTo(aWebSocket))
    .catch(wsErrorListener)
}

export { openWebSocketsAndAddListeners }
