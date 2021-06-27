// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// This node.js module defines the object HSS_WSS.
// HSS_WSS requires the package 'ws'.
// It is an extension of 'ws''s WebSocket.Server object.
// Defines additional functionality specific to the piece.
// ////////////////////////////////////////////////////////////
const WebSocket = require('ws')

class HSS_WSS extends WebSocket.Server {
  constructor (par) {
    super(par)
    // Last client that played a note.
    this.lastClient = null
  }

  // Broadcast message to all clients.
  broadcast (data) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(data)
    })
  }

  // Send data (a note) to a random client.
  sendToRandomClient (data) {
    let clients = Array.from(this.clients)
    console.log(`There are ${clients.length} clients online.`)

    // Select all clients that are different from lastClient
    clients = clients.length < 2 ? clients : clients.filter(elem => elem !== this.lastClient)

    const size = clients.length
    const client = clients[Math.floor(Math.random() * size)]

    if (client && client.readyState === WebSocket.OPEN) {
      console.log('\tA note send to a random client.')
      client.send(data)
      this.lastClient = client
    }
  }
}

exports.HSS_WSS = HSS_WSS
