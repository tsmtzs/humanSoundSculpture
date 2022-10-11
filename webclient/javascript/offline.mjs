/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
import { PARAMETERS } from './parameters.mjs'

const textMsgElement = document.querySelector(`#${PARAMETERS.ELEMENT_ID.TEXT_MSG}`)

window.addEventListener('online', () => {
  textMsgElement.textContent = PARAMETERS.RECONNECT.MSG

  setTimeout(() => {
    window.location = '/'
  },
	     PARAMETERS.RECONNECT.DUR
	    )
})
