// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
const PARAMETERS = {
  WEBSOCKETS: {
    OPEN_MSG: 'Tap on this sentence to enable sound.',
    ERROR_MSG: 'Ooops! An error occured in ',
    IP: '192.168.10.6',
    PORT: 3000,
    get URL () {
      return `wss://${this.IP}:${this.PORT}`
    }
  },
  ELEMENT_ID: {
    TEXT_MSG: 'textMsg',
    START_BTN: 'startBtn',
    SHUTDOWN_BTN: 'shutdownBtn',
    SOUNDCHECK_BTN: 'soundCheckBtn'
  },
  TEST_BTN_FREQ: 400 + Math.random() * 600,
  SHUTDOWN_WAIT_TIME: 2 * 1000 // ms
}

export { PARAMETERS }
