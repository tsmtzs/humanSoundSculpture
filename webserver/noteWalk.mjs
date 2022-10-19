// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// This object handles the succession of the notes of the piece.
// ////////////////////////////////////////////////////////////
class NoteWalk {
  freqs
  amps
  durs
  ampMultiplier
  durMultiplier
  delta
  #isNotPlaying = true
  #graph
  #port

  constructor ({freqs, amps, durs, ampMultiplier, durMultiplier, delta, port, graph } = {}) {
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
  }

  play (startVertex = 1, steps = Infinity) {
    if (this.#isNotPlaying) {
      const walk = this.#graph.randomWalk(startVertex, steps)

      this.#isNotPlaying = false
      this.#startRandomWalk(walk)
    }
  }

  async #startRandomWalk (walk) {
    for (const vertex of walk) {
      if (this.#isNotPlaying || vertex === -1) return

      const dur = this.durs[vertex - 1] * this.durMultiplier

      if (vertex !== 0) {
	const freq = this.freqs[vertex - 1][Math.floor(Math.random() * 3)]
	const amp = this.amps[vertex - 1] * this.ampMultiplier

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
