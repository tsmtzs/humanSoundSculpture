/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// This module collects functions for player.mjs and conductor.mjs
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
  msgHandlerObj[msg.type](...msg.args)
  // console.log('Websocket message: ', msg.args, msg.type, msg)
}

export {
  setTextToElement,
  getShowButtons,
  getRemoveElementListener,
  getWsMsgListener
}
