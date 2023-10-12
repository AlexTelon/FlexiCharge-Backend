
const { describe, expect, test } = require("@jest/globals");
const exp = require("constants");
const { afterEach, beforeEach } = require('node:test');

const mockDatabaseInterfaceCharger = {
  getChargerBySerialNumber: jest.fn(),
};

const mockChargerMessageHandler = {
  handleMessage: jest.fn(),
};

const mockConstants = {
  get: jest.fn(() => ({})),
};

const mockV = {
  getLengthConnectedChargerSockets: jest.fn(),
  getLengthChargerSerials: jest.fn(),
  getLengthChargerIDs: jest.fn(),
  isInChargerSerials: jest.fn(),
  getChargerID: jest.fn(),
  removeConnectedChargerSockets: jest.fn(),
  removeChargerSerials: jest.fn(),
  removeChargerIDs: jest.fn(),
  addConnectedChargerSockets: jest.fn(),
  addChargerSerials: jest.fn(),
  addChargerIDs: jest.fn(),
};

const mockFunc = {
  buildJSONMessage: jest.fn(),
  getGenericError: jest.fn(),
  getUniqueId: jest.fn(),
};

module.exports = function ({}) {
  describe("Handle Client", () => {
    let mockClientSocket;
    const chargerSerial = 'chargerSerial';

    beforeEach(() => {
      mockClientSocket = {
        on: jest.fn(),
        send: jest.fn(),
        terminate: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it('Should handle a valid client connection with an existing charger', () => {

      //Mock database response
      mockDatabaseInterfaceCharger.getChargerBySerialNumber.mockImplementation((serial, callback) => {
        callback([], { chargerID: 'chargerID'});
      });

      chargerHandlerModule({
        databaseInterfaceCharger: mockDatabaseInterfaceCharger,
        chargerMessageHandler: mockChargerMessageHandler,
        v: mockV,
        constants: mockConstants,
        func: mockFunc,
      }).handleClient(mockClientSocket, chargerSerial);

      //Simulate a message event
      mockClientSocket.on.mock.calls[0][1]('someMessage');

      //Simulate a close event
      mockClientSocket.on.mock.calls[1][1]();

      expect(mockChargerMessageHandler.handleMessage).toHaveBeenCalledWith('someMessage', mockClientSocket, 'chargerID');
      expect(mockV.addConnectedChargerSockets).toHaveBeenCalledWith('chargerID', mockClientSocket);
      expect(mockV.addChargerSerials).toHaveBeenCalledWith(chargerSerial);
      expect(mockV.addChargerIDs).toHaveBeenCalledWith(chargerSerial, 'chargerID');
      expect(mockV.removeConnectedChargerSockets).toHaveBeenCalledWith('chargerID');
      expect(mockV.removeChargerSerials).toHaveBeenCalledWith(chargerSerial);
      expect(mockV.removeChargerIDs).toHaveBeenCalledWith(chargerSerial);
      expect(mockClientSocket.send).toHaveBeenCalledTimes(1);
      expect(mockClientSocket.terminate).toHaveBeenCalledTimes(1);
    });

    it('Should handle a client connection with non-existing charger', () => {

      //Mock database response
      mockDatabaseInterfaceCharger.getChargerBySerialNumber.mockImplementation((serial, callback) => {
        callback(['error'], []);
      });

      chargerHandlerModule({
        databaseInterfaceCharger: mockDatabaseInterfaceCharger,
        chargerMessageHandler: mockChargerMessageHandler,
        v: mockV,
        constants: mockConstants,
        func: mockFunc,
      }).handleClient(mockClientSocket, chargerSerial);

      //Simulate message event
      mockClientSocket.on.mock.calls[0][1]('someMessage');

      //Simulate close event
      mockClientSocket.on.mock.calls[1][1]();

      expect(mockClientSocket.send).toHaveBeenCalledTimes(1);
      expect(mockClientSocket.terminate).toHaveBeenCalledTimes(1);
    });
  });
};