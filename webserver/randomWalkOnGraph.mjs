// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// ////////////////////////////////////////////////////////////
import { parentPort } from 'node:worker_threads'
import { setTimeout } from 'node:timers'
import { DirectedGraph } from './directedGraph.mjs'

// freqs[0] -> C, freqs[1] -> C#, etc.
const freqs = [
  [523.2511306012, 1046.5022612024, 2093.0045224048],
  [554.36526195374, 1108.7305239075, 2217.461047815],
  [587.32953583482, 1174.6590716696, 2349.3181433393],
  [622.25396744416, 1244.5079348883, 2489.0158697766],
  [659.25511382574, 1318.5102276515, 2637.020455303],
  [698.45646286601, 1396.912925732, 2793.825851464],
  [739.98884542327, 1479.9776908465, 2959.9553816931],
  [783.9908719635, 1567.981743927, 3135.963487854],
  [830.60939515989, 1661.2187903198, 3322.4375806396],
  [880, 1760, 3520],
  [932.32752303618, 1864.6550460724, 3729.3100921447],
  [987.76660251225, 1975.5332050245, 3951.066410049]
]
const amps = [0.35, 0.45, 0.35, 0.5, 0.35, 0.75, 0.35, 1, 0.35, 0.75, 0.35, 0.5]
const durs = [1, 0.5, 1, 2 / 3, 1, 0.75, 1, 5 / 6, 1, 0.75, 1, 2 / 3]

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
const startVertice = 1
const walk = graph.randomWalk(startVertice, Infinity)

adjacencyList.forEach((endVertices, startVertex) => {
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
    }
  }

  // console.log('Worker', msg.type)
  msgHandler[msg.type]()
}

parentPort.on('message', msgListener(parentPort))

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function randomTransition () {
  for (const vertex of walk) {
    if (vertex === -1) return

    const dur = durs[vertex]

    if (vertex !== 0) {
      const freq = freqs[vertex - 1][Math.floor(Math.random() * 3)]
      const amp = amps[vertex - 1]

      parentPort.postMessage({ type: 'note', data: [freq, amp, dur] })
    }

    const delta = dur * (0.75 + Math.random())
    await wait(delta * 1000)
  }
}

randomTransition()

console.log('Inside WORKER')
