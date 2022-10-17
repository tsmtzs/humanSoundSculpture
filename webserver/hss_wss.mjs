// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
// ////////////////////////////////////////////////////////////
import { WebSocketServer, WebSocket } from 'ws'

class HSS_WSS extends WebSocketServer {
  constructor (object) {
    super(Object.assign(object, { clientTracking: true }))
  }

  // Broadcast message to all clients.
  broadcast (data) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(data)
    })
  }

  // Send data (a note) to a random client.
  sendToRandomClient (data) {
    const validClients = Array.from(this.clients)
	  .filter(client => client.readyState === WebSocket.OPEN)
    const size = validClients.length

    const client = validClients[Math.floor(Math.random() * size)]

    if (client) {
      client.send(data)
    }
  }
}

export { HSS_WSS }
