// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// Express app.
// ////////////////////////////////////////////////////////////
import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import { appErrorListener } from './functions.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '../')
const app = express()

app.use(express.static(path.join(rootDir, 'webclient')))

app.get('/', (req, res) => {
	res.sendFile(path.join(rootDir, 'webclient/views/index.html'))
})

app.get('/conductor', (req, res) => {
	res.sendFile(path.join(rootDir, 'webclient/views/conductor.html'))
})

app.get('/player', (req, res) => {
	res.sendFile(path.join(rootDir, 'webclient/views/player.html'))
})

app.get('/description', (req, res) => {
	res.sendFile(path.join(rootDir, 'webclient/views/description.html'))
})

app.use(appErrorListener)

export { app }
