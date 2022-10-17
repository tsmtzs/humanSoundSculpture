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

const getWorkerMsgListener = aWebSocketServer => {
  const msgHandler = {
    action: data => aWebSocketServer.broadcast(data),
    note: data => aWebSocketServer.sendToRandomClient(data)
  }

  return msg => {
    msgHandler[msg.type](JSON.stringify(msg))
    console.log('Recieved worker message: ', msg)
  }
}

const wsErrorListener = error => {
  console.error('Something went wrong in WebSockets\n%d', error.stack)
}

const getWsMsgListener = (worker, rootDir) => msg => {
  const data = JSON.parse(msg)
  // console.log('Client message: ', data)
  worker.postMessage(data)

  if (data.type === 'shutdown') {
    // On message 'shutdown' execute file 'killHSS.sh
    // OR USE sh /usr/bin/shutdown now
    child_process.exec('bin/killHSS.sh', { cwd: rootDir, shell: 'bash' }, (err, stdout, stderr) => {
      if (err) {
        throw new Error('Exec error')
      }

      // console.log('Script killHSS.sh ecexuted')
    })
    // console.log('PC is shutting down!')
    process.exit()
  }
}

const getWsConnectionListener = (errorListener, msgListener) => aWebSocket => {
  aWebSocket.on('message', msgListener)
  aWebSocket.onerror = errorListener
}

export {
  appErrorListener,
  getWorkerMsgListener,
  wsErrorListener,
  getWsMsgListener,
  getWsConnectionListener
}
