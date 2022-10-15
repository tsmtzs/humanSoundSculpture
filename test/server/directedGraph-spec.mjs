/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for directedGraph.mjs
// //////////////////////////////////////////////////
import { DirectedGraph } from '../../webserver/directedGraph.mjs'

import pkg from 'chai'
const { expect } = pkg

describe('Tests for the class DirectedGraph', function () {
  describe('Constructor function.', function () {
    it('Should throw an error when the argument is not a positive Integer.', function () {
      expect(() => { return new DirectedGraph() }).to.throw()
      expect(() => { return new DirectedGraph(0) }).to.throw()

      let argument

      argument = -1 * Math.random()
      expect(() => { return new DirectedGraph(argument) }).to.throw()

      argument = 2.321
      expect(() => { return new DirectedGraph(argument) }).to.throw()

      argument = 5.0
      expect(() => { return new DirectedGraph(argument) }).to.not.throw()

      argument = 5
      expect(() => { return new DirectedGraph(argument) }).to.not.throw()
    })

    it('Should create an instance with size equal to 0.', function () {
      const graph = new DirectedGraph(10)
      expect(graph.size).to.equal(0)
    })

    it('Should create an instance with order equal to the number passed as argument.', function () {
      const order = 10
      const graph = new DirectedGraph(order)
      expect(graph.order).to.equal(order)
    })
  })

  describe("Method 'addEdge'.", function () {
    let order
    let graph
    let startVertex
    let endVertex

    beforeEach(function () {
      order = 10
      graph = new DirectedGraph(order)
      startVertex = 2
      endVertex = 7
    })

    it('Should throw an error when called with less than two arguments.', function () {
      expect(() => { graph.addEdge() }).to.throw(/two arguments/)
      expect(() => { graph.addEdge(2) }).to.throw(/two arguments/)
      expect(() => { graph.addEdge(1, 2) }).to.not.throw()
      expect(() => { graph.addEdge(0, 0) }).to.not.throw(/two arguments/)
    })

    it('Should throw an error when at least one of the arguments is not a valid vertex.', function () {
      expect(() => { graph.addEdge(-1, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.addEdge(0.4, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.addEdge(12, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.addEdge(1, -2) }).to.throw(/valid vertex/)
      expect(() => { graph.addEdge(1, 1.2) }).to.throw(/valid vertex/)
      expect(() => { graph.addEdge(1, 11) }).to.throw(/valid vertex/)
      expect(() => { graph.addEdge(1, 2) }).to.not.throw()
      expect(() => { graph.addEdge(1.0, 2) }).to.not.throw()
    })

    it('Should add the second argument to the Array of adjacent vertices of the first argument.', function () {
      const noOfOccurences = graph.adj(startVertex).filter(elem => elem === endVertex).length
      graph.addEdge(startVertex, endVertex)
      expect(graph.adj(startVertex).filter(elem => elem === endVertex).length).to.equal(noOfOccurences + 1)
    })

    it('Should increase by 1 the #edges private property', function () {
      const prevSize = graph.size
      graph.addEdge(startVertex, endVertex)
      expect(graph.size - 1).to.equal(prevSize)
    })
  })

  describe("Method 'removeEdge'.", function () {
    let order
    let graph
    let startVertex
    let endVertex

    beforeEach(function () {
      order = 10
      graph = new DirectedGraph(order)
      startVertex = 2
      endVertex = 7
    })

    it('Should throw an error when called with less than two arguments.', function () {
      expect(() => { graph.removeEdge() }).to.throw(/two arguments/)
      expect(() => { graph.removeEdge(2) }).to.throw(/two arguments/)
      expect(() => { graph.removeEdge(1, 2) }).to.not.throw()
      expect(() => { graph.removeEdge(0, 0) }).to.not.throw()
    })

    it('Should throw an error when at least one of the arguments is not a valid vertex.', function () {
      expect(() => { graph.removeEdge(-1, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.removeEdge(0.4, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.removeEdge(12, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.removeEdge(1, -2) }).to.throw(/valid vertex/)
      expect(() => { graph.removeEdge(1, 1.2) }).to.throw(/valid vertex/)
      expect(() => { graph.removeEdge(1, 11) }).to.throw(/valid vertex/)
      expect(() => { graph.removeEdge(1, 2) }).to.not.throw()
      expect(() => { graph.removeEdge(1.0, 2) }).to.not.throw()
    })

    it('Should not change the adjacency list if the graph has not an edge defined by the given arguments.', function () {
      const adj = Array.from(graph.adj(startVertex))
      graph.removeEdge(startVertex, endVertex)
      expect(graph.adj(startVertex)).to.deep.equal(adj)

      graph.addEdge(startVertex, endVertex)
      expect(graph.adj(startVertex)).to.not.equal(adj)
    })

    it('Should descrease the value of the #edges property by 1.', function () {
      graph.addEdge(startVertex, endVertex)
      let edges = graph.adj(startVertex).length
      graph.removeEdge(startVertex, endVertex)
      expect(graph.size + 1).to.equal(edges)

      graph.addEdge(startVertex, endVertex)
      graph.addEdge(startVertex, endVertex)
      graph.addEdge(startVertex, endVertex)
      edges = graph.adj(startVertex).length
      graph.removeEdge(startVertex, endVertex)
      expect(graph.size + 1).to.equal(edges)
    })
  })

  describe("Method 'hasEdge'.", function () {
    let order
    let graph
    let startVertex
    let endVertex

    beforeEach(function () {
      order = 10
      graph = new DirectedGraph(order)
      startVertex = 2
      endVertex = 7
    })

    it('Should throw an error when called with less than two arguments', function () {
      expect(() => { graph.hasEdge() }).to.throw()
      expect(() => { graph.hasEdge(2) }).to.throw()
      expect(() => { graph.hasEdge(5, 2) }).to.not.throw()
    })

    it('Should throw an error when at least one of the arguments is not a valid vertex.', function () {
      expect(() => { graph.hasEdge(-1, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.hasEdge(0.4, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.hasEdge(12, 2) }).to.throw(/valid vertex/)
      expect(() => { graph.hasEdge(1, -2) }).to.throw(/valid vertex/)
      expect(() => { graph.hasEdge(1, 1.2) }).to.throw(/valid vertex/)
      expect(() => { graph.hasEdge(1, 11) }).to.throw(/valid vertex/)
      expect(() => { graph.hasEdge(1, 2) }).to.not.throw()
      expect(() => { graph.hasEdge(1.0, 2) }).to.not.throw()
    })

    it('Should return true when the edge that is defined by the argument vertices occurs in the graph, and false otherwise', function () {
      expect(graph.hasEdge(startVertex, endVertex)).to.be.false
      graph.addEdge(startVertex, endVertex)
      expect(graph.hasEdge(startVertex, endVertex)).to.be.true
    })
  })

  describe("Method 'adj'.", function () {
    let order
    let graph
    let startVertex
    let endVertex

    beforeEach(function () {
      order = 10
      graph = new DirectedGraph(order)
      startVertex = 2
      endVertex = 7
    })

    it('Should throw when the argument is not a valid vertex.', function () {
      expect(() => graph.adj()).to.throw()
      expect(() => graph.adj(-2)).to.throw()
      expect(() => graph.adj(1.2)).to.throw()
      expect(() => graph.adj(order + 2)).to.throw()
      expect(() => graph.adj(order - 1)).to.not.throw()
    })

    it('Should return an Array instance', function () {
      expect(graph.adj(startVertex) instanceof Array).to.be.true
    })

    it('Should return an empty Array, if there are not edges that start at the argument vertex.', function () {
      expect(graph.adj(startVertex)).to.be.empty

      graph.addEdge(endVertex, startVertex)
      expect(graph.adj(startVertex)).to.be.empty
    })

    it('The returned Array should contain multiple times a vertex that is the end of a parallel edge.', function () {
      expect(graph.adj(startVertex).filter(elem => elem === endVertex).length).to.equal(0)

      graph.addEdge(startVertex, endVertex)
      expect(graph.adj(startVertex).filter(elem => elem === endVertex).length).to.equal(1)

      graph.addEdge(startVertex, endVertex)
      expect(graph.adj(startVertex).filter(elem => elem === endVertex).length).to.equal(2)

      // self loops
      expect(graph.adj(startVertex).filter(elem => elem === startVertex).length).to.equal(0)

      graph.addEdge(startVertex, startVertex)
      expect(graph.adj(startVertex).filter(elem => elem === startVertex).length).to.equal(1)

      graph.addEdge(startVertex, startVertex)
      expect(graph.adj(startVertex).filter(elem => elem === startVertex).length).to.equal(2)
    })
  })

  describe.skip("Tests for method 'randomWalk'.", function () {
    let order
    let graph

    beforeEach(function () {
      order = 10
      graph = new DirectedGraph(order)
      const adjacencyList = [
  	[1],
  	[1, 3],
  	[0, 4],
  	[2, 4, 4],
  	[]
      ]

      adjacencyList.forEach((nextVertices, i) => {
  	nextVertices.forEach(nextVertex => {
  	  graph.addEdge(i, nextVertex)
  	})
      })
    })
  })
})
