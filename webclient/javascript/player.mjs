/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'
import { openWebSocketsAndAddListeners } from './common.mjs'

const socket = new WebSocket(PARAMETERS.WEBSOCKETS.URL)

openWebSocketsAndAddListeners(socket)
  .catch(console.error)
