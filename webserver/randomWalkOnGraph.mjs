// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// ////////////////////////////////////////////////////////////
import { parentPort } from 'node:worker_threads'
import { setTimeout } from 'node:timers'

parentPort.on('message', msg => {
  console.log(`Worker got msg: \n\t${msg.type}`)
})

const delta = 5000
let id

const loop = () => {
  parentPort.postMessage({ type: 'msg', data: Math.random() })
  setTimeout(loop, delta)
}

loop()

console.log('Inside WORKER')
