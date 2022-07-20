// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// This file is responsible for the web server of the piece.
// Can be started with the systemd service
// hss-web-server.service
// Run
// journalctl -u hss-web-server -f
// in a terminal to see log messages.
// ////////////////////////////////////////////////////////////
import fs from 'fs'
import path from 'path'
import process from 'process'
import parseArgs from 'minimist'
import express from 'express'
import https from 'https'
import exec from 'child_process'
import { Server, Client } from 'node-osc'
import { HSS_WSS } from './hss_wss.mjs'

import {
		appErrorListener,
		oscMsgListener,
		wsErrorListener,
		wsMsgListener,
		wsConnectionListener,
		oscMessageHandler
} from './functions.mjs'

const argv = parseArgs(process.argv.slice(2))

const app = express()
const rootDir = argv['root-dir'] ?? process.cwd()
const credentials = {
  key: fs.readFileSync(path.join(rootDir, 'certs/hss-key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join(rootDir, 'certs/hss-crt.pem'), 'utf8')
}
// The IP of the server
const ip = argv['ip'] ?? '192.168.1.8'

console.log(argv, rootDir, ip)
// ////////////////////////////////////////////////////////////
// Create the server.
const webServerPort = argv['port'] ?? 3000
const server = https.createServer(credentials, app)
// ////////////////////////////////////////////////////////////
// OSC communication with SuperCollider
const oscServer = new Server(57121, '0.0.0.0')
const sclang = new Client(ip, 57120)
const oscPath = '/action'
// ////////////////////////////////////////////////////////////
// WebSockets
const wss = new HSS_WSS({ server: server })

app.use(express.static(path.join(rootDir, 'public')))
// ////////////////////////////////////////////////////////////
// Respond to incoming HTTP messages.
// ////////////////////////////////////////////////////////////
// Send to performers the basic web page of the piece.
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'public/views/index.html'))
})

// Send the 'conductor' web page.
app.get('/conductor', (req, res) => {
  res.sendFile(path.join(rootDir, 'public/views/conductor.html'))
})

// Send the 'player' web page.
app.get('/player', (req, res) => {
  res.sendFile(path.join(rootDir, 'public/views/player.html'))
})

// Send the 'description' web page.
app.get('/description', (req, res) => {
  res.sendFile(path.join(rootDir, 'public/views/description.html'))
})

app.use(appErrorListener)

// OSC messages: SC => web clients
oscServer.on('message', oscMsgListener(oscMessageHandler(wss)))

// websockets: web server => web clients
wss.on('connection', wsConnectionListener(wsErrorListener, wsMsgListener(sclang, oscPath)))

// ////////////////////////////////////////////////////////////
// Create the SSL/TSL server.
// ////////////////////////////////////////////////////////////
server.listen({ port: webServerPort, host: ip }, () => console.log('Server listening on port: ', webServerPort))
