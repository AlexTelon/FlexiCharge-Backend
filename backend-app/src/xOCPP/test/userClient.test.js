
const { describe, expect, it } = require("@jest/globals");
const { afterEach, beforeEach } = require('node:test');

jest.mock('ws');

const mockV = {
  addUserIDWithTransactionID: jest.fn(),
  removeUserID: jest.fn(),
  getLengthConnectedUserSockets: jest.fn(),
  getUserIDsLength: jest.fn(),
  getLiveMetrictsTokensLength: jest.fn(),
  lengthLastLiveMetrictsTimestamps: jest.fn(),
};

module.exports = function ({}) {
  describe('User Client', () => {
    let mockWebSocket;

    beforeEach(() => {
      mockWebSocket = new WebSocket('ws://localhost:1337/user/someUserId');
      WebSocket.mockImplementation(() => mockWebSocket);
      jest.clearAllMocks();
    });

    afterEach(() => {
      WebSocket.mockReset();
    });

    it('Should connect as a user socket', (done) => {
      userClient.connectAsUserSocket((ws) => {
        expect(mockV.addUserIDWithTransactionID).toHaveBeenCalledWith('someUserId', expect.any(String));

        //Simulate received message
        const testData = { someData: 'someValue'};
        const testJsonData = JSON.stringify(testData);
        mockWebSocket.emit('message', testJsonData);

        //Message handling assertions here
        //
        //********************************

        done();
      });

      //Simulate WebSocket open event
      mockWebSocket.emit('open);')
    });
  });
};