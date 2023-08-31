// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// This object handles the succession of the notes.
// ////////////////////////////////////////////////////////////
class NoteWalk {
  freqs
  amps
  durs
  ampMultiplier
  durMultiplier
  delta
  startVertex
  steps
  #isNotPlaying = true
  #graph
  #port

  constructor ({ freqs, amps, durs, ampMultiplier, durMultiplier, delta, port, graph, startVertex, steps } = {}) {
    if (port === undefined || graph === undefined) {
      throw new Error("You must pass a MessagePort with the key 'port', and a DirectedGraph with the key 'graph'.")
    }

    this.freqs = freqs ?? [400]
    this.amps = amps ?? [0.2]
    this.durs = durs ?? [1.0]
    this.ampMultiplier = ampMultiplier ?? 1.0
    this.durMultiplier = durMultiplier ?? 1.0
    this.delta = delta ?? (() => 1.0)

    this.#graph = graph
    this.#port = port

    this.startVertex = startVertex ?? 1
    this.steps = steps ?? Infinity
  }

  play (startVertex = 1, steps = Infinity) {
    if (this.#isNotPlaying) {
      const start = startVertex ?? this.startVertex
      const length = steps ?? this.steps
      const walk = this.#graph.randomWalk(start, length)

      this.#isNotPlaying = false
      this.#startRandomWalk(walk)
    }
  }

  async #startRandomWalk (walk) {
    for (const vertex of walk) {
      if (this.#isNotPlaying || vertex === -1) return

      const dur = this.durs[vertex] * this.durMultiplier

      if (vertex !== 12) {
        const octaves = this.freqs[vertex]
        const freq = octaves[Math.floor(Math.random() * octaves.length)]
        const amp = this.amps[vertex] * this.ampMultiplier

        this.#port.postMessage({ type: 'note', data: [freq, amp, dur] })
      }

      await this.#wait(this.delta(dur) * 1000)
    }
  }

  #wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  stop () {
    this.#isNotPlaying = true
  }
}

export { NoteWalk }
