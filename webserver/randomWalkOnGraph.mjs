// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// ////////////////////////////////////////////////////////////
import { parentPort } from 'node:worker_threads'
import { setTimeout } from 'node:timers'
import { DirectedGraph } from './directedGraph.mjs'

// 0 -> rest, 1 -> C, 2 -> C# etc.
const notes = [0, 11, 10, 1, 12, 4, 5, 2, 3, 7, 6, 9, 8]
const amps = [0.35, 0.45, 0.35, 0.5, 0.35, 0.75, 0.35, 1, 0.35, 0.75, 0.35, 0.5, 0.35]
const durs = [1, 0.5, 1, 2 / 3, 1, 0.75, 1, 5 / 6, 1, 0.75, 1, 2 / 3, 1]

let ampMultiplier = 1.0
let durMultiplier = 21
let deltaMultiplier = Math.random()

// The adjacency list defines a Paley graph of order 13.
const adjacencyList = [
  [1, 3, 4, 9, 10, 12],
  [0, 2, 4, 5, 10, 11],
  [1, 3, 5, 6, 11, 12],
  [0, 2, 4, 6, 7, 12],
  [0, 1, 3, 5, 7, 8],
  [1, 2, 4, 6, 8, 9],
  [2, 3, 5, 7, 9, 10],
  [3, 4, 6, 8, 10, 11],
  [4, 5, 7, 9, 11, 12],
  [0, 5, 6, 8, 10, 12],
  [0, 1, 6, 7, 9, 11],
  [1, 2, 7, 8, 10, 12],
  [0, 2, 3, 8, 9, 11]
]
const graph = new DirectedGraph(adjacencyList.length)

adjacencyList.forEach((endVertices, startVertex)  => {
  endVertices.forEach(vertex => {
    graph.addEdge(startVertex, vertex)
  })
})

console.log('Graph', graph.order, graph.size, graph.adj(0))

const msgListener = port => msg => {
  const msgHandler = {
    play: () => console.log('Worker got msg PLAY'),
    stop: () => console.log('Worker got msg STOP'),
    shutdown: () => {
      console.log('Worker got msg SHUTDOWN')
      port.close()
      process.exit()
    },
  }

  // console.log('Worker', msg.type)
  msgHandler[msg.type]()
}

parentPort.on('message', msgListener(parentPort))

const delta = 5000
let id

const loop = () => {
  parentPort.postMessage({ type: 'msg', data: Math.random() })
  setTimeout(loop, delta)
}

loop()

console.log('Inside WORKER')
