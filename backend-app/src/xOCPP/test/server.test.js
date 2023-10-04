const WebSocket = require('ws')
const serverModule = require('./server_ocpp')

const config = require('../config')

const { describe, expect, test } = require("@jest/globals");
const { afterEach, beforeEach } = require('node:test');

jest.mock('ws');
const mockWebSocketServer = new WebSocket.Server();
const userClientHandler = {
  handleClient: jest.fn(),
};
const chargerClientHandler = {
  handleClient: jest.fn(),
};

//Mock the request object for testing
const mockRequest = {
  url: '/user/abc123-123-123',
};


module.exports = function ({ ocpp }) {
  exports.startServerTest = function () {
    describe("Start Server", () => {
      beforeEach(() => {
        WebSocket.Server.mockImplementation(() => mockWebSocketServer);
        jest.clearAllMocks();
      });

      afterEach(() => {
        WebSocket.Server.mockReset();
      });

      it('Should handle User Connection', () => {
        ocpp.startServer();

        const mockWebSocket = new WebSocket('ws://example.com', {headers: {}, req:  mockRequest});

        mockWebSocketServer.emit('connection', mockWebSocket, mockRequest);

        expect(userClientHandler.handleClient).toHaveBeenCalledWith(mockWebSocket, 'abc123-123-123');
      });

      it('Should handle Charger Connection', () => {
        ocpp.startServer();

        const mockWebSocket = new WebSocket('ws://example.com', {headers: {}, req: '/charger/chargerSerial'});

        mockWebSocketServer.emit('connection', mockWebSocket, mockRequest);

        expect(chargerClientHandler.handleClient).toHaveBeenCalledWith(mockWebSocket, 'chargerSerial');
      });
    });
  }
  return exports
}