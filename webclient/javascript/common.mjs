/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// Common objects for player.mjs and conductor.mjs.
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'
import {
  setTextToElement
} from './functions.mjs'

const wsErrorMsg = PARAMETERS.WEBSOCKETS.ERROR_MSG

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

export {
  wsErrorListener
}
