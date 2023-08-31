/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// Utility functions for common.mjs.
// ////////////////////////////////////////////////////////////
const setTextToElement = (string, element) => { element.textContent = string }

const getShowButtons = domTree => {
  const inputElements = Array.from(domTree.querySelectorAll('button'))

  return event => {
    inputElements.forEach(elem => { elem.style.visibility = 'visible' })
  }
}

const getRemoveElementListener = element => event => {
  element.remove()
}

const getWsMsgListener = msgHandlerObj => message => {
  const msg = JSON.parse(message.data)
  msgHandlerObj[msg.type](...msg.data)
  // console.log('Websocket message: ', msgHandlerObj)
}

export {
  setTextToElement,
  getShowButtons,
  getRemoveElementListener,
  getWsMsgListener
}
