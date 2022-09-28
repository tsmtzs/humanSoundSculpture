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
  getShowButtons
} from './functions.mjs'

const wsErrorMsg = PARAMETERS.WEBSOCKETS.ERROR_MSG
const wsOpenMsg = PARAMETERS.WEBSOCKETS.OPEN_MSG

// ////////////////////////////////////////////////////////////
// Get the html element with id 'textMsg'.
// This element is used to post messages on the page.
//    * On WebSocket load prints 'wsLoadMsg'
//    * On WebSocket error prints 'wsErrorMsg'
// ////////////////////////////////////////////////////////////
const textMsgElement = document.querySelector(`#${PARAMETERS.ELEMENT_ID.TEXT_MSG}`)

const wsErrorListener = event => {
  setTextToElement(wsErrorMsg, textMsgElement)
  // console.log('ERROR in WebSocket', event)
}

const setTapMsg = event => {

  setTextToElement(wsOpenMsg, textMsgElement)
}

const removeTextMsg = getRemoveElementListener(textMsgElement)
const showButtons = getShowButtons(document.body)
const addTapListeners = event => {
  textMsgElement.addEventListener('pointerdown', removeTextMsg)
  textMsgElement.addEventListener('pointerdown', showButtons)
}

const wsOpenListener = event => {
  console.log('Inside wsOpenListener')

  // // //////////////////////////////////////////////////////////
  // // Start button
  // // //////////////////////////////////////////////////////////
  // const startBtnMaybe = Maybe.of(document.getElementById(PARAMETERS.ELEMENT_ID.START_BTN))

  // // On every 'click' event send a 'start' / 'stop'
  // // message to the web server.
  // startBtnMaybe.map(addEventListener('click'))
  //   .ap(startBtnMaybe.map(buttonListener(socket)(x => x === 'play' ? 'stop' : 'play')))

  // // //////////////////////////////////////////////////////////
  // // Shutdown computer button
  // // //////////////////////////////////////////////////////////
  // const shutdownBtnMaybe = Maybe.of(document.getElementById(PARAMETERS.ELEMENT_ID.SHUTDOWN_BTN))

  // // When conductor double clicks the button,
  // // send a 'shutdown' message to web server.
  // shutdownBtnMaybe.map(addEventListener('dblclick'))
  //   .ap(shutdownBtnMaybe.map(buttonListener(socket)(() => 'hss ended')))

  // // ////////////////////////////////////////////////////////////
  // // Start AudioContext and play sound.
  // // ////////////////////////////////////////////////////////////
  // const sound = new Sound()

  // // WebSocket message handler.
  // const wsMsgHandlerObj = wsMsgHandler(sound.play.bind(sound)) // Grrrr... 'this' is very annoying

  // socket.onmessage = wsListener(wsMsgHandlerObj)

  // // //////////////////////////////////////////////////////////
  // // Test button
  // // //////////////////////////////////////////////////////////
  // const testButton = document.getElementById(PARAMETERS.ELEMENT_ID.SOUNDCHECK_BTN)

  // addEventListener('click')(testButton)(createTestSynth(sound))
}

export {
  wsErrorListener,
  setTapMsg,
  addTapListeners,
  wsOpenListener
}
