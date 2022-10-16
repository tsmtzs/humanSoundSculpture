// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// This file collects listener functions.
// ////////////////////////////////////////////////////////////
import process from 'process'
import child_process from 'child_process'

// Event listeners.
// error handling - from https://expressjs.com/en/guide/error-handling.html
const appErrorListener = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Oops! Something went wrong.')
}

// OSC messages: SuperCollider => web server
const getOscMsgListener = (msgHandler, webSocketServer) => msg => {
  const msgObj = { type: msg[0] }
  Object.assign(msgObj, { args: msg.slice(1) })
  msgHandler[msgObj.type](JSON.stringify(msgObj), webSocketServer)
  console.log('Recieved SC message:\n', msgObj)
}

const wsErrorListener = error => {
  console.error('Something went wrong in WebSockets\n%d', error.stack)
}

// const getWsMsgListener = (sclang, oscPath, rootDir) => msg => {
//   const data = msg.toString()
//   console.log('Client message: ', data)
//   if (data === 'shutdown') {
//     // On message 'shutdown' execute file 'killHSS.sh
//     // OR USE sh /usr/bin/shutdown now
//     child_process.exec('bin/killHSS.sh', { cwd: rootDir, shell: 'bash' }, (err, stdout, stderr) => {
//       if (err) {
//         throw new Error('Exec error')
//       }

//       console.log('Script killHSS.sh ecexuted')
//     })
//     console.log('PC is shutting down!')
//     process.exit()
//   } else {
//     sclang.send(oscPath, data)
//   }
// }

const getWsMsgListener = (worker, rootDir) => msg => {
  const data = msg.toString()
  console.log('Client message: ', data)
  if (data === 'shutdown') {
    // On message 'shutdown' execute file 'killHSS.sh
    // OR USE sh /usr/bin/shutdown now
    child_process.exec('bin/killHSS.sh', { cwd: rootDir, shell: 'bash' }, (err, stdout, stderr) => {
      if (err) {
        throw new Error('Exec error')
      }

      console.log('Script killHSS.sh ecexuted')
    })
    console.log('PC is shutting down!')
    process.exit()
  } else {
    worker.postMessage(data)
  }
}

const getWsConnectionListener = (errorListener, msgListener) => aWebSocket => {
  aWebSocket.on('message', msgListener)
  aWebSocket.onerror = errorListener
}

const oscMsgHandler = aWebSocketServer => {
  return {
    '/action': data => aWebSocketServer.broadcast(data),
    '/note': data => aWebSocketServer.sendToRandomClient(data)
  }
}

export {
  appErrorListener,
  getOscMsgListener,
  wsErrorListener,
  getWsMsgListener,
  getWsConnectionListener,
  oscMsgHandler
}

