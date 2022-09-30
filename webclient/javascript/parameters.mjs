// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// ////////////////////////////////////////////////////////////
const PARAMETERS = {
  WEBSOCKETS: {
    OPEN_MSG: 'Tap on this sentence to enable sound.',
    ERROR_MSG: 'Ooops! An error occured.',
    IP: '192.168.10.5',
    PORT: 3000
  },
  ELEMENT_ID: {
    TEXT_MSG: 'textMsg',
    START_BTN: 'startBtn',
    SHUTDOWN_BTN: 'shutdownBtn',
    SOUNDCHECK_BTN: 'soundCheckBtn'
  },
  TEST_BTN_FREQ: 400 + Math.random() * 600
}

export { PARAMETERS }
