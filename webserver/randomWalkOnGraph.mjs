// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// ////////////////////////////////////////////////////////////
import { parentPort } from 'node:worker_threads'
import { setTimeout } from 'node:timers'

const msgListener = port => msg => {
  const msgHandler = {
    play: () => console.log('Worker got msg PLAY'),
    stop: () => console.log('Worker got msg STOP'),
    shutdown: () => {
      console.log('Worker got msg SHUTDOWN')
      port.close()
      process.exit()
    },
  }

  // console.log('Worker', msg.type)
  msgHandler[msg.type]()
}

parentPort.on('message', msgListener(parentPort))

const delta = 5000
let id

const loop = () => {
  parentPort.postMessage({ type: 'msg', data: Math.random() })
  setTimeout(loop, delta)
}

loop()

console.log('Inside WORKER')
