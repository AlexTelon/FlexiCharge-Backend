const WebSocket = require('ws')

const { describe, expect, test } = require("@jest/globals");
const { afterEach, beforeEach } = require('node:test');
const exp = require('constants');

jest.mock('pubsub-js');

const mockConstants = {
  get: jest.fn(() => ({})),
}

const mockV = {
  getConnectedUserSockets: jest.fn(),
  addLiveMetricsToken: jest.fn(),
  removeLiveMetricsToken: jest.fn(),
  getLastLiveMetricsTimestamp: jest.fn(),
  updateLastLiveMetricsTimestamp: jest.fn(),
};

const mockFunc = {
  buldJSONMessage: jest.fn(),
};

const mockDatabaseInterfaceTransactions ={
  updateTransactionChargingStatus: jest.fn(),
};

const mockConfig = {
  //Adjust as needed
  LIVEMETRICS_DB_UPDATE_INTERVAL: 1
};

module.exports = function ({ chargerMessageHandler }) {
  exports.messageHandlerTests = function() {
    describe('Message Handler', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('Should subsribe to live metrics', () => {
        const userID = 'someUserID';
        const callback = jest.fn();

        const mockToken = 'mockToken';
        PubSub.subscribe.mockReturnValue(mockToken);

        chargerMessageHandler.subscribeToLiveMetrics(userID, callback);

        expect(PubSub.subscribe).toHaveBeenCalledWith('LIVEMETRICS_TOPIC_PREFIX${userID}', expect.any(Function));
        expect(mockV.addLiveMetricsToken).toHaveBeenCalledWith(userID, mockToken);
        expect(callback).toHaveBeenCalledWith([]);
      });

      it('Should update live metrics', () => {
        const userID = 'someUserID';
        const metricsMessage = [/* SAMLE MESSAGE */];
        const callback = jest.fn();

        const mockTopic = 'LIVEMETRICS_TOPIC_PREFIX${userID}';

        //No Subscribers
        PubSub.publish.mockReturnValue(false);

        chargerMessageHandler.publishToLiveMetrics(userID, metricsMessage, callback);

        expect(PubSub.publish).toHaveBeenCalledWith(mockTopic, metricsMessage);
        //ADD TESTS FOR DB TIMESTAMP AND UPDATE 
        expect(callback).toHaveBeenCalled();
      });

      it('Should unsubscribe from live metrics', () => {
        const userID = 'someUserID';

        chargerMessageHandler.unsubscribeToLiveMetrics(userID);

        expect(PubSub.unsubscribe).toHaveBeenCalledWith(userID);
        expect(mockV.removeLiveMetricsToken).toHaveBeenCalledWith(userID);
      });
    });
  };
  return exports
}