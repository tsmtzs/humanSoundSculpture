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
import https from 'https'
import { Server, Client } from 'node-osc'
import { HSS_WSS } from './hss_wss.mjs'
import { app } from './app.mjs'
import {
		getOscMsgListener,
		wsErrorListener,
		getWsMsgListener,
		getWsConnectionListener,
		oscMsgHandler
} from './functions.mjs'

const argv = parseArgs(process.argv.slice(2))
const rootDir = argv['root-dir'] ?? process.cwd()
const credentials = {
  key: fs.readFileSync(path.join(rootDir, 'certs/hss-key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join(rootDir, 'certs/hss-crt.pem'), 'utf8')
}
const ip = argv['ip'] ?? '192.168.1.8'
const webServerPort = argv['port'] ?? 3000

const server = https.createServer(credentials, app)
const oscServer = new Server(57121, '0.0.0.0')
const sclang = new Client(ip, 57120)
const oscPath = '/action'

const wss = new HSS_WSS({ server: server })
const oscListener = getOscMsgListener(oscMsgHandler(wss), wss)
oscServer.on('message', oscListener)

const wsListener = getWsMsgListener(sclang, oscPath, rootDir)
const wsConnectionListener = getWsConnectionListener(wsErrorListener, wsListener)
wss.on('connection', wsConnectionListener)

server.listen({ port: webServerPort, host: ip }, () => { console.log('Server listening on port: ', webServerPort) })

process.setUncaughtExceptionCaptureCallback(err => { console.error(err.stack) })
process.on('unhandledRejection', (reason, promise) => { console.log(reason, promise) })
