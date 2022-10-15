// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// A DirectedGraph data structure based on
// https://algs4.cs.princeton.edu/42digraph/
// ////////////////////////////////////////////////////////////
class DirectedGraph {
  #adjacencyList
  #vertices
  #edges = 0

  constructor (graphOrder) {
    if (this.#isNotAPositiveInteger(graphOrder)) {
      throw new Error(`Argument ${graphOrder} is not a positive Integer.`)
    }

    this.#vertices = graphOrder
    this.#adjacencyList = [...Array(graphOrder).keys()].map(() => [])
  }

  #isNotAPositiveInteger (aNumber) {
    return aNumber === undefined || aNumber <= 0 || (aNumber - Math.floor(aNumber) > 0)
  }

  // Accepts parallel edges and self loops.
  addEdge (startVertex, endVertex) {
    this.#throwWhenArgumentsInvalid(startVertex, endVertex)

    this.#adjacencyList[startVertex].push(endVertex)
    this.#addToEdgeNo(1)
  }

  #throwWhenArgumentsInvalid(arg1, arg2) {
    if (this.#argumentsUndefined(arg1, arg2)) {
      throw new Error('This method accepts two arguments.')
    }

    if (this.#isNotAValidVertex(arg1, arg2)) {
      throw new Error(`At least one of the arguments ${arg1}, ${arg2}  is not a valid vertex for this graph.`)
    }
  }

  #argumentsUndefined(...args) {
    return args.some(arg => arg === undefined)
  }

  #isNotAValidVertex (...args) {
    return args.some(arg => this.#isNotNoNegativeInteger(arg) || (arg >= this.#vertices))
  }

  #isNotNoNegativeInteger(aNumber) {
    return aNumber === undefined || aNumber < 0 || (aNumber - Math.floor(aNumber) > 0)
  }

  #addToEdgeNo (anInteger) {
    this.#edges = this.#edges + anInteger
  }

  removeEdge (startVertex, endVertex) {
    if (this.hasEdge(startVertex, endVertex)) {
      const index = this.adj(startVertex).indexOf(endVertex)
      this.#adjacencyList[startVertex] = this.adj(startVertex).filter((elem, i) => index !== i)
      this.#addToEdgeNo(-1)
    }
  }

  adj (vertex) {
    if (this.#isNotAValidVertex(vertex)) {
      throw new Error(`Vertex ${vertex} is not a valid vertex.`)
    }
    return this.#adjacencyList[vertex]
  }

  // Number of edges.
  get size () {
    return this.#edges
  }

  // Number of vertices.
  get order () {
    return this.#vertices
  }

  hasEdge (startVertex, endVertex) {
    this.#throwWhenArgumentsInvalid(startVertex, endVertex)
    return this.adj(startVertex).includes(endVertex)
  }

  *randomWalk (startVertex = 0, steps = 10) {
    let currentStep = 0
    let currentVertex = startVertex

    while (currentStep++ < steps) {
      const nextVertices = this.adj(currentVertex)

      if (nextVertices.length === 0) { return -1 }

      currentVertex = nextVertices[Math.floor(Math.random() * nextVertices.length)]
      yield currentVertex
    }
  }
}

export { DirectedGraph }
