/* eslint-env browser */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// This module collects functions for player.mjs and conductor.mjs
// ////////////////////////////////////////////////////////////
const setTextToElement = (string, element) => { element.textContent = string }

const getShowButtons = domTree => {
  const inputElements = Array.from(domTree.querySelectorAll('input'))

  return event => {
    inputElements.forEach(elem => { elem.type = 'button' })
  }
}

const getRemoveElementListener = element => event => {
  element.remove()
}

export {
  setTextToElement,
  getShowButtons,
  getRemoveElementListener
}
