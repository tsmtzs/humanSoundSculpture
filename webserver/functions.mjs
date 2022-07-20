// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// This file collects listener functions.
// ////////////////////////////////////////////////////////////

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

// WebSocket error listener.
const wsErrorListener = error => {
		console.error('Something went wrong in WebSockets\n%d', error.stack)
}

// WebSocket message listener.
const wsMsgListener = (sclang, oscPath) => msg => {
  const data = msg.toString()
  console.log('Client message: ', data)
  if (data === 'shutdown') {
    // On message 'shutdown' execute file 'killHSS.sh
    // OR USE sh /usr/bin/shutdown now
    exec('bin/killHSS.sh', { cwd: rootDir, shell: 'bash' }, (err, stdout, stderr) => {
      if (err) {
        throw new Error('Exec error')
      }

      console.log('Script killHSS.sh ecexuted')
    })
    console.log('PC is shutting down!')
    process.exit()
  } else {
    sclang.send(oscPath, data)
  }
}

// WebSocket listener on 'connection' event.
const wsConnectionListener = (errorListener, msgListener) => ws => {
  ws.on('message', msgListener)
  // catch ws errors
  ws.onerror = errorListener
}

// ////////////////////////////////////////////////////////////
// Function 'oscMessageHandler' returns an object.
// This is used to send data to clients
// for each receiving OSC message.
// ////////////////////////////////////////////////////////////
const oscMessageHandler = wss => {
  return {
    '/action': data => wss.broadcast(data),
    '/note': data => wss.sendToRandomClient(data)
  }
}

export {
		appErrorListener,
		getOscMsgListener,
		wsErrorListener,
		wsMsgListener,
		wsConnectionListener,
		oscMessageHandler
}
