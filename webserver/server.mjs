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
import { Worker } from 'worker_threads'
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
const PARAMETERS = JSON.parse(fs.readFileSync(path.join(rootDir, 'webserver/parameters.json'), 'utf8'))

const ip = argv['ip'] ?? PARAMETERS.IP ?? 'localhost'
const webServerPort = argv['port'] ?? PARAMETERS.WEB_SERVER_PORT ?? 8080
const workerURL = new URL('./randomWalkOnGraph.mjs', import.meta.url)

const server = https.createServer(credentials, app)
const oscServer = new Server(PARAMETERS.OSC_SERVER.PORT ?? 57121, PARAMETERS.OSC_SERVER.IP ?? '0.0.0.0')
const sclang = new Client(ip, PARAMETERS.OSC_CLIENT.PORT ?? 57120)
const oscPath = PARAMETERS.OSC_CLIENT.PATH ?? '/action'

const wss = new HSS_WSS({ server: server })
const oscListener = getOscMsgListener(oscMsgHandler(wss), wss)
oscServer.on('message', oscListener)

server.listen({ port: webServerPort, host: ip }, () => { console.log('Server listening on port: ', webServerPort) })

const worker = new Worker(workerURL)

worker.on('message', msg => { console.log('Received msg from worker', msg) })
worker.on('error', console.error)
worker.on('exit', code => {
  if (code !== 0) {
    throw new Error(`Worker stopped with exit code ${code}.`)
  }
})

const wsListener = getWsMsgListener(worker, rootDir)
const wsConnectionListener = getWsConnectionListener(wsErrorListener, wsListener)
wss.on('connection', wsConnectionListener)

process.setUncaughtExceptionCaptureCallback(err => { console.error(err.stack) })
process.on('unhandledRejection', (reason, promise) => { console.log(reason, promise) })
