/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for HSS_WSS
// //////////////////////////////////////////////////
import { HSS_WSS } from '../../webserver/hss_wss.mjs'
import WebSocket from 'ws'
import http from 'http'

import sinon from 'sinon'

import pkg from 'chai'
const { expect } = pkg

describe('Tests for HSS_WSS.', function () {
	describe("Method 'broadcast'.", function () {
		let server
		let httpServer
		let clientFactory
		let send

		before(function () {
			clientFactory = readyState => {
				return {
					readyState: readyState,
					send: send
				}
			}
		})

		beforeEach(function () {
			httpServer = http.createServer((request, response) => { response.end() })
			server = new HSS_WSS({ server: httpServer })

			send = sinon.fake()
			sinon.spy(server.clients, 'forEach')
		})

		afterEach(() => {
			sinon.restore()
			httpServer.close()
		})

		it("Should send the message 'forEach' to the 'clients' property.", function () {
			server.broadcast()
			expect(server.clients.forEach.calledOnce).to.be.true
			expect(send.notCalled).to.be.true

		})

		it("Should send the message 'send' to each WebSocket client with WebSocket ready state OPEN.", function () {
			server.broadcast()
			expect(server.clients.forEach.calledOnce).to.be.true
			expect(send.notCalled).to.be.true

			server.clients.add(clientFactory(WebSocket.OPEN))
			server.broadcast()
			expect(send.calledOnce).to.be.true

			server.clients.add(clientFactory(WebSocket.CLOSED))
			server.broadcast()
			expect(send.calledTwice).to.be.true
		})

		it("Should pass the given argument to the method 'send', for each WebSocket client with ready state OPEN.", function () {
			const data = { msg: 'hi' }

			server.clients.add(clientFactory(WebSocket.OPEN))
			server.broadcast(data)
			expect(send.calledOnceWithExactly(data)).to.be.true

			server.clients.add(clientFactory(WebSocket.CLOSED))
			server.broadcast(data)
			expect(send.calledTwice).to.be.true
			expect(send.calledWithExactly(data)).to.be.true
		})
	})

	describe("Method 'sendToRandomClient'.", function () {
		let server
		let httpServer
		let clientFactory
		let send

		beforeEach(function () {
			httpServer = http.createServer((request, response) => { response.end() })
			server = new HSS_WSS({ server: httpServer })

			send = sinon.fake()
			clientFactory = readyState => {
				return {
					readyState: readyState,
					send: send
				}
			}
			sinon.spy(server.clients, 'forEach')
		})

		afterEach(() => {
			sinon.restore()
			httpServer.close()
		})

		it("Should send the 'send' message to exactly one WebSocket client with ready state OPEN, passing the given argument.", function () {
			const data = { msg: 'hi' }

			server.sendToRandomClient(data)
			expect(send.notCalled).to.be.true

			server.clients.add(clientFactory(WebSocket.OPEN))
			server.sendToRandomClient(data)
			expect(send.calledOnceWithExactly(data)).to.be.true

			server.clients.add(clientFactory(WebSocket.CLOSED))
			server.sendToRandomClient(data)
			expect(send.calledTwice).to.be.true
			expect(send.calledWithExactly(data)).to.be.true
		})
	})
})
