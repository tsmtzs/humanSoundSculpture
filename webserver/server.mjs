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
import { PARAMETERS } from './parameters.mjs'
import fs from 'fs'
import path from 'path'
import process from 'process'
import parseArgs from 'minimist'
import https from 'https'
import { Worker } from 'worker_threads'
import { HSS_WSS } from './hss_wss.mjs'
import { app } from './app.mjs'
import {
  getWorkerMsgListener,
  wsErrorListener,
  getWsMsgListener,
  getWsConnectionListener
} from './functions.mjs'

const argv = parseArgs(process.argv.slice(2))
const rootDir = argv['root-dir'] ?? process.cwd()
const credentials = {
  key: fs.readFileSync(path.join(rootDir, 'certs/hss-key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join(rootDir, 'certs/hss-crt.pem'), 'utf8')
}

const ip = argv.ip ?? PARAMETERS.IP ?? 'localhost'
const webServerPort = argv.port ?? PARAMETERS.WEB_SERVER_PORT ?? 8080
const workerURL = new URL('./randomWalkOnGraph.mjs', import.meta.url)

const server = https.createServer(credentials, app)
const wss = new HSS_WSS({ server })

server.listen({ port: webServerPort, host: ip }, () => { console.log('Server listening on port: ', webServerPort) })

const worker = new Worker(workerURL)

const workerListener = getWorkerMsgListener(wss)
worker.on('message', workerListener)
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
