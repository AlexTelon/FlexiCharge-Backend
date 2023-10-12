const { describe, expect, it } = require("@jest/globals");
const { beforeEach } = require('node:test');

const mockV = {
  getConnectedUserSockets: jest.fn(),
  addLiveMetricsToken: jest.fn(),
  removeLiveMetricsToken: jest.fn(),
  getLastLiveMetricsTimestamp: jest.fn(),
  updateLastLiveMetricsTimestamp: jest.fn(),
  getCallback: jest.fn(),
  getConnectedChargerSocket: jest.fn(),
  removeCallback: jest.fn(),
  getUserIDWithTransactionID: jest.fn(),
  getTransactionID: jest.fn(),
};

const mockFunc = {
  buildJSONMessage: jest.fn(),
  getGenericError: jest.fn(),
  checkIfValidUniqueID: jest.fn(),
  getCallResultNotImplemeted: jest.fn(),
  sendStatusNotificationResponse: jest.fn(),
  handleDataTransfer: jest.fn(),
  handleStartTransaction: jest.fn(),
  handleStopTransaction: jest.fn(),
  handleMeterValues: jest.fn(),
  getUniqueId: jest.fn(),
  getDataTransferMessage: jest.fn(),
};

const mockDatabaseInterfaceCharger = {
  getCharger: jest.fn(),
  updateChargerStatus: jest.fn(),
};

const mockDatabaseInterfaceChargePoint = {
  getChargePoint: jest.fn(),
};

const mockConfig = {
  //Adjust as needed
  LIVEMETRICS_DB_UPDATE_INTERVAL: 1
};

describe('handleMessage', (chargerMessageHandler, constants) => {

  const c = constants;
  const chargerID = 'charger123';
  const clientSocketMock = {
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should handle a valid CALL message', () => {
    const message = JSON.stringify({ [c.MESSAGE_TYPE_INDEX]: c.CALL, [c.UNIQUE_ID_INDEX]: 'unique123' });

    chargerMessageHandler.callSwitch().mockReturnValue('callSwitchResponse');

    chargerMessageHandler.handleMessage(message, clientSocketMock, chargerID);

    expect(chargerMessageHandler.callSwitch()).toHaveBeenCalledWith('unique123', expect.any(Object), 'charger123');
    expect(clientSocketMock.send).toHaveBeenCalledWith('callSwitchResponse');
  });

  it('Should handle a valid CALL_RESULT message', () => {
    const message = JSON.stringify({ [c.MESSAGE_TYPE_INDEX]: c.CALL_RESULT, [c.UNIQUE_ID_INDEX]: 'unique123' });

    chargerMessageHandler.handleMessage(message, clientSocketMock, chargerID);

    expect(chargerMessageHandler.callSwitch()).not.toHaveBeenCalled();
    expect(chargerMessageHandler.resultCallSwitch()).toHaveBeenCalledWith('unique123', expect.any(Object), 'charger123');
    expect(clientSocketMock.send).not.toHaveBeenCalled();
  });

  it('Should hande a CALL_ERROR message', () => {
    const message = JSON.stringify({ [c.MESSAGE_TYPE_INDEX]: c.CALL_ERROR, [c.UNIQUE_ID_INDEX]: 'unique123' });

    chargerMessageHandler.callSwitch().mockReturnValue('callSwitchResponse');

    chargerMessageHandler.handleMessage(message, clientSocketMock, chargerID);

    expect(chargerMessageHandler.callSwitch()).not.toHaveBeenCalled();
    expect(chargerMessageHandler.errorCallSwitch()).toHaveBeenCalledWith('unique123', expect.any(Object));
    expect(clientSocketMock.send).toHaveBeenCalledWith('callSwitchResponse');
  });
});

describe('testMeterValues', (chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = 'charger123';
  const userID = 'user123';

  beforeEach(() => {
    mockV.getUserIDWithTransactionID.mockReset();
    mockV.getConnectedChargerSocket.mockReset();
    mockFunc.buildJSONMessage.mockReset();
  });

  it('Should publish meter values and send a call result', () => {
    const request = [null, 'unique123', null, {
      transactionId: 'transaction123',
    }];

    mockV.getUserIDWithTransactionID.mockReturnValue(userID);
    const socket = { send: jest.fn() };
    mockV.getConnectedChargerSocket.mockReturnValue(socket);
    mockFunc.buildJSONMessage.mockReturnValue('mockedResponse');

    chargerMessageHandler.handleMeterValues(chargerID, request);

    expect(mockV.getUserIDWithTransactionID).toHaveBeenCalledWith('transaction123');
    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(mockFunc.buildJSONMessage).toHaveBeenCalledWith([c.CALL_RESULT, 'unique123', c.METER_VALUES]);
    expect(broker.publishToLiveMetrics).toHaveBeenCalledWith(userID, request, expect.any(Function));
    expect(broker.send).toHaveBeenCalledWith('mockedResponse');
  });

  it('Should send a call error when userID is not found', () => {
    const request = [null, 'unique123', null, {
      transactionId: 'transaction123',
    }];

    mockV.getUserIDWithTransactionID.mockReturnValue(null);
    const socket = { send: jest.fn() };
    mockV.getConnectedChargerSocket.mockReturn(socket);
    mockFunc.buildJSONMessage.mockReturn('mockedResponse');

    chargerMessageHandler.handleMeterValues(chargerID, request);

    expect(mockV.getUserIDWithTransactionID).toHaveBeenCalledWith('transaction123');
    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(mockFunc.buildJSONMessage).toHaveBeenCalledWith([c.CALL_ERROR, 'unique123', c.METER_VALUES, { error: 'userID not OK' }]);
    expect(socket.send).toHaveBeenCalledWith('mockedResponse');
  });
});



describe('handleStopTransaction', (databaseInterfaceCharger, chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = "charger123";
  const uniqueID = "unique123";
  const request = {
    payload: {
      timestamp: 1234567890,
      meterStop: 100,
    },
  };
  const callbackMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should handle stop transaction and update charger status', () => {
    const socketMock = {
      send: jest.fn(),
    };

    mockV.getCallback.mockReturnValue(callbackMock);
    mockV.getConnectedChargerSocket.mockReturnValue(socketMock);
    databaseInterfaceCharger.updateChargerStatus.mockImplementation((_, __, callback) => {
      callback([], { status: c.AVAILABLE });
    });
    mockFunc.buildJSONMessage.mockReturnValue('mockedMessage');

    chargerMessageHandler.handleStopTransaction(chargerID, uniqueID, request);

    expect(mockV.getCallback).toHaveBeenCalledWith(chargerID);
    expect(mockV.removeCallback).toHaveBeenCalledWith(chargerID);
    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(databaseInterfaceCharger.updateChargerStatus).toHaveBeenCalledWith(
      chargerID,
      c.AVAILABLE,
      expect.any(Function),
    );
    expect(mockFunc.buildJSONMessage).toHaveBeenCalledWith(
      c.CALL_RESULT,
      uniqueID,
      c.STOP_TRANSACTION,
      { idTagInfo: 1 },
    );
    expect(socketMock.send).toHaveBeenCalledWith('mockedMessage');
    expect(callbackMock).toHaveBeenCalledWith(null, {
      status: c.ACCEPTED,
      timestamp: request.payload.timestamp,
      meterStop: request.payload.meterStop,
    });
  });

  it('Should handle error when updating charger status', () => {
    const socketMock = {
      send: jest.fn(),
    };

    mockV.getCallback.mockReturnValue(callbackMock);
    mockV.getConnectedChargerSocket.mockReturnValue(socketMock);
    databaseInterfaceCharger.updateChargerStatus.mockImplementation((_, __, callback) => {
      callback(['Error updating charger status'], null);
    });
    mockFunc.getGenericError.mockReturnValue('mockedError');

    chargerMessageHandler.handleStopTransaction(chargerID, uniqueID, request);

    expect(mockFunc.getGenericError).toHaveBeenCalledWith(uniqueID, 'Error updating charger status');
    expect(socketMock.send).toHaveBeenCalledWith('mockedError');
    expect(callbackMock).toHaveBeenCalledWith(c.INTERNAL_ERROR, null);
  });

  it('Should handle no callback or invalid chargerID', () => {
    mockV.getCallback.mockReturnValue(null);
    mockV.getConnectedChargerSocket.mockReturnValue(socketMock);
    mockFunc.getGenericError.mockReturnValue('mockedError');

    chargerMessageHandler.handleStopTransaction(chargerID, uniqueID, request);

    expect(mockFunc.getGenericError).toHaveBeenCalledWith(uniqueID, c.NO_ACTIVE_TRANSACTION);
    expect(socketMock().send).toHaveBeenCalledWith('mockedError');
  });

  it('Should handle no connected socket', () => {
    mockV.getCallback.mockReturnValue(callbackMock);
    mockV.getConnectedChargerSocket.mockReturnValue(null);
    mockFunc.getGenericError.mockReturnValue('mockedError');

    chargerMessageHandler.handleStopTransaction(chargerID, uniqueID, request);

    expect(mockFunc.getGenericError).toHaveBeenCalledWith(uniqueID, c.NO_ACTIVE_TRANSACTION);
    expect(callbackMock).not.toHaveBeenCalled();
  });
});

describe('startTransaction', (databaseInterfaceCharger, chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = 'charger123';
  const uniqueID = 'unique123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should handle a valid start transaction request', () => {
    const request = [null, uniqueID, null, {
      timestamp: 1234567890,
      meterStart: 100,
    }];
    const callback = jest.fn();

    mockV.getCallback.mockReturnValue(callback);
    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });
    databaseInterfaceCharger.updateChargerStatus.mockImplementation((_, __, callback) => {
      callback([], { status: c.CHARGING });
    });
    mockV.getTransactionID.mockReturnValue('tansaction123');
    mockFunc.buildJSONMessage.mockReturnValue('mockedResponse');

    chargerMessageHandler.handleStartTransaction(chargerID, uniqueID, request);

    expect(mockV.getCallback).toHaveBeenCalledWith(chargerID);
    expect(mockV.removeCallback).toHaveBeenCalledWith(chargerID);
    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);

    expect(callback).toHaveBeenCalledWith(null, { status: c.ACCEPTED, timestamp: 1234567890, meterStart: 100 });

    expect(databaseInterfaceCharger.updateChargerStatus).toHaveBeenCalledWith(chargerID, c.CHARGING, expect.any(Function));

    expect(mockFunc.buildJSONMessage).toHaveBeenCalledWith([c.CALL_RESULT, uniqueID, c.START_TRANSACTION, { idTagInfo: 1, transactionId: 'transaction123' }]);
  });

  it('Should handle an error when updating charger status', () => {
    const request = [null, uniqueID, null, {
      timestamp: 1234567890,
      meterStart: 100,
    }]
    const callback = jest.fn();

    mockV.getCallback.mockReturnValue(callback);
    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });
    databaseInterfaceCharger.updateChargerStatus.mockImplementation((_, __, callback) => {
      callback(['error123'], null);
    });
    mockFunc.getGenericError.mockReturnValue('mockedErrorResponse');

    chargerMessageHandler.handleStartTransaction(chargerID, uniqueID, request);

    expect(mockV.getCallback).toHaveBeenCalledWith(chargerID);
    expect(mockV.removeCallback).toHaveBeenCalledWith(chargerID);
    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);

    expect(callback).toHaveBeenCalledWith(c.INTERNAL_ERROR, null);

    expect(databaseInterfaceCharger.updateChargerStatus).toHaveBeenCalledWith(chargerID, c.CHARGING, expect.any(Function));

    expect(mockFunc.getGenericError).toHaveBeenCalledWith(uniqueID, 'error123');

    expect(mockV.getConnectedChargerSocket().send).toHaveBeenCalledWith('mockedErrorResponse');
  });

  it('Should handle a missing callback or socket', () => {
    const request = [null, uniqueID, null, {
      timestamp: 1234567890,
      meterStart: 100,
    }];

    mockV.getCallback.mockReturnValue(null);
    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });
    mockFunc.getGenericError.mockReturnValue('mockedErrorResponse');

    chargerMessageHandler.handleStartTransaction(chargerID, uniqueID, request);

    expect(mockV.getCallback).toHaveBeenCalledWith(chargerID);
    expect(mockV.removeCallback).not.toHaveBeenCalled();
    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);

    expect(mockFunc.getGenericError).toHaveBeenCalledWith(uniqueID, c.NO_ACTIVE_TRANSACTION);

    expect(mockV.getConnectedChargerSocket().send).toHaveBeenCalledWith('mockedErrorResponse');
  });
});

describe('handleDataTransfer', (chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = 'charger123';
  const uniqueID = 'unique123';

  beforeEach(() => {
    mockFunc.buildJSONMessage.mockReset();
  });

  it('Should handle CHARGE_LEVEL_UPDATE', () => {
    const request = [null, null, null, {
      messageId: c.CHARGE_LEVEL_UPDATE,
      data: '{"key":"value"}',
    }];

    chargerMessageHandler.handleDataTransfer(chargerID, uniqueID, request);

    expect(chargerMessageHandler.buildJSONMessage).not.toHaveBeenCalled();
    expect(chargerMessageHandler.updateChargerLevel).toHaveBeenCalledWith(chargerID, uniqueID, expect.any(Object));
  });

  it('Should handle unknown messageID', () => {
    const request = [null, null, null, {
      messageId: 'UNKNOWN_MESSAGE_ID',
      data: '{}',
    }];

    mockFunc.buildJSONMessage.mockReturnValue('mockedResponse');

    const result = handleDataTransfer(chargerID, uniqueID, request);

    expect(mockFunc.buildJSONMessage).toHaveBeenCalledWith([c.CALL_RESULT, uniqueID, c.DATA_TRANSFER, { status: c.UNKOWN_MESSAGE_ID, data: '' }]);
    expect(result).toBe('mockedResponse');
  });
});

describe('updateChargerLevel', (databaseInterfaceTransactions, chargerMessageHandler, databaseInterfaceCharger, constants) => {
  const c = constants;
  const chargerID = 'charger123';
  const uniqueID = 'unique123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should update charger level in DB and send success response', () => {
    const data = {
      transactionId: 'transaction123',
      latestMeterValue: 200,
      CurrentChargePercentage: 50,
    };

    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });
    databaseInterfaceTransactions.updateTransactionChargingStatus.mockImplementation((_, __, callback) => {
      callback([], null);
    });
    mockFunc.buildJSONMessage.mockReturnValue('mockedResponse');

    chargerMessageHandler.updateChargerLevel(chargerID, uniqueID, data);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);

    expect(databaseInterfaceCharger.updateTransactionChargingStatus).toHaveBeenCalledWith(
      data.transactionId,
      data.latestMeterValue,
      data.CurrentChargePercentage,
      expect.any(Function),
    );

    expect(mockFunc.buildJSONMessage).toHaveBeenCalledWith([c.CALL_RESULT, uniqueID, c.DATA_TRANSFER, { status: c.ACCEPTED, data: '' }]);
  });

  it('Should handle an error when updating charger level in DB', () => {
    const data = {
      transactionId: 'transaction123',
      latestMeterValue: 200,
      CurrentChargePercentage: 50,
    };

    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });
    databaseInterfaceTransactions.updateTransactionChargingStatus.mockImplementation((_, __, callback) => {
      callback(['error123'], null);
    });
    mockFunc.getGenericError.mockReturnValue('mockedErrorResponse');

    chargerMessageHandler.updateChargerLevel(chargerID, uniqueID, data);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);

    expect(databaseInterfaceTransactions.updateTransactionChargingStatus).toHaveBeenCalledWith(
      data.transactionId,
      data.latestMeterValue,
      data.CurrentChargePercentage,
      expect.any(Function),
    );

    expect(mockFunc.getGenericError).toHaveBeenCalledWith(uniqueID, 'error123');

    expect(mockV.getConnectedChargerSocket().send).toHaveBeenCalledWith('mockedErrorResponse');
  });

  it('Should handle a missing socket', () => {
    const data = {
      transactionId: 'transaction123',
      latestMeterValue: 200,
      CurrentChargePercentage: 50,
    };

    mockV.getConnectedChargerSocket.mockReturnValue(null);
    mockFunc.getGenericError.mockReturnValue('mockedErrorResponse');

    chargerMessageHandler.updateChargerLevel(chargerID, uniqueID, data);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(mockFunc.getGenericError).toHaveBeenCalledWith(uniqueID, 'updateChargerLevel -> No socket connected to this chargerID');
  });
});

describe('sendBootNotificationRepsonse', (chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = 'charger123';
  const uniqueID = 'unique123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should send a boot notification response when socket is available', () => {
    const status = c.ACCEPTED;

    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });
    mockFunc.buildJSONMessage.mockReturnValue('mockedResponse');

    chargerMessageHandler.testSendBootNotificationResponse(chargerID, uniqueID, status);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(mockFunc.buildJSONMessage).toHaveBeenCalledWith([
      c.CALL_RESULT,
      uniqueID,
      c.BOOT_NOTIFICATION,
      {
        status: status,
        currentTime: expect.any(Number),
        interval: c.HEART_BEAT_INTERVAL,
      },
    ]);
    expect(mockV.getConnectedChargerSocket().send).toHaveBeenCalledWith('mockedResponse');
  });

  it('Should handle a missing socket', () => {
    const status = c.ACCEPTED;

    mockV.getConnectedChargerSocket.mockReturnValue(null);

    chargerMessageHandler.testSendBootNotificationResponse(chargerID, uniqueID, status);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(console.log).toHaveBeenCalledWith('sendBootNotificationResponse -> No socket connected to this chargerID');
  });
});

describe('sendBootData', (chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = 'charger123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should send boot data when charging price is available', () => {
    const chargingPrice = 10;

    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });
    mockFunc.getUniqueId.mockReturnValue('unique123');
    mockFunc.getDataTransferMessage.mockReturnValue('mockedDataTransferMessage');

    chargerMessageHandler.testSendBootData(chargerID);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(mockFunc.getUniqueId).toHaveBeenCalledWith(chargerID, c.DATA_TRANSFER);
    expect(mockFunc.getDataTransferMessage).toHaveBeenCalledWith('unique123', {
      vendorId: 'com.flexicharge',
      messageId: 'BootData',
      data: JSON.stringify({
        chargerId: chargerID,
        chargingPrice: chargingPrice
      }),
    },
      true);
    expect(mockV.getConnectedChargerSocket().send).toHaveBeenCalledWith('mockedDataTransferMessage');
  });

  it('Should handle an error when getting chargin price', () => {
    const error = 'Charging price error';

    mockV.getConnectedChargerSocket.mockReturnValue({ send: jest.fn() });

    chargerMessageHandler.testSendBootData(chargerID);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(console.log).toHaveBeenCalledWith('Could not get chargePrice. Error: ' + error);
    expect(mockFunc.getGenericError).toHaveBeenCalledWith(c.INTERNAL_ERROR, error);
    expect(mockV.getConnectedChargerSocket().send).toHaveBeenCalledWith(mockFun.getGenericError());
  });

  it('Should handle a missing socket', () => {
    const chargingPrice = 10;

    mockV.getConnectedChargerSocket.mockReturnValue(null);

    chargerMessageHandler.sendBootData(chargerID);

    expect(mockV.getConnectedChargerSocket).toHaveBeenCalledWith(chargerID);
    expect(console.log).toHaveBeenCalledWith('sendBootData -> No socket connected to this chargerID');
  });
});

describe('getChargingPrice', (chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = 'charger123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should get a charging price', () => {
    const charger = { chargePointID: 'chargePoint123' };
    const chargePoint = { price: 10 };

    mockDatabaseInterfaceCharger.getCharger.mockImplementation((id, callback) => {
      callback(null, charger);
    });
    mockDatabaseInterfaceChargePoint.getChargePoint.mockImplementation((id, callback) => {
      callback(null, chargePoint);
    });

    return new Promise((resolve, reject) => {
      chargerMessageHandler.getChargingPrice(chargerID, (error, price) => {
        expect(error).toBeNull();
        expect(price).toBe(chargePoint.price);

        resolve();
      });
    });
  });

  it('Should handle error when getting charger', () => {
    const error = 'Charger error';

    mockDatabaseInterfaceCharger.getCharger.mockImplementation((id, callback) => {
      callback(error, null);
    });

    return new Promise((resolve, reject) => {
      chargerMessageHandler.getChargingPrice(chargerID, (returnedError, price) => {
        expect(returnedError).toBe(error);
        expect(price).toBeNull();

        resolve();
      });
    });
  });

  it('Should handle invalid chargerID', () => {
    const charger = null;

    mockDatabaseInterfaceCharger.getCharger.mockImplementation((id, callback) => {
      callback(null, charger);
    });

    return new Promise((resolve, reject) => {
      chargerMessageHandler.getChargingPrice(chargerID, (error, price) => {
        expect(error).toBe(c.INVALID_ID);
        expect(price).toBeNull();

        resolve();
      });
    });
  });

  it('Should handle error when getting charge point', () => {
    const charger = { chargePoint: 'chargePoint123' };
    const error = 'Charge point error';

    mockDatabaseInterfaceCharger.getCharger.mockImplementation((id, callback) => {
      callback(null, charger);
    });

    mockDatabaseInterfaceChargePoint.getChargePoint.mockImplementation((id, callback) => {
      callback(error, null);
    });

    return new Promise((resolve, reject) => {
      chargerMessageHandler.getChargingPrice(chargerID, (returnedError, price) => {
        expect(returnedError).toBe(error);
        expect(price).toBeNull();

        resolve();
      });
    });
  });

  it('Should handle invalid charge point', () => {
    const charger = { chargePointID: 'chargePoint123' };
    const chargePoint = null;

    mockDatabaseInterfaceCharger.getCharger.mockImplementation((id, callback) => {
      callback(null, charger);
    });

    mockDatabaseInterfaceChargePoint.getChargePoint.mockImplementation((id, callback) => {
      callback(null, chargePoint);
    });

    return new Promise((resolve, reject) => {
      chargerMessageHandler.getChargingPrice(chargerID, (error, price) => {
        expect(error).toBe(c.INVALID_CHARGE_POINT);
        expect(price).toBeNull();

        resolve();
      });
    });
  });
});

describe('sendStatusNotificationResponse', (chargerMessageHandler, constants) => {
  const c = constants;
  const chargerID = 'charger123';
  const uniqueID = 'unique123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should send status notification response', () => {
    const request = {
      [c.PAYLOAD_INDEX]: {
        errorCode: c.NO_ERROR,
        status: 'charging',
      },
    };

    mockDatabaseInterfaceCharger.updateChargerStatus.mockImplementation((id, status, callback) => {
      callback(null, { status });
    });

    mockV.getConnectedChargerSocket.mockReturnValue({
      send: jest.fn(),
    });

    chargerMessageHandler.sendStatusNotificationResponse(chargerID, uniqueID, request);

    expect(mockDatabaseInterfaceCharger.updateChargerStatus).toHaveBeenCalledWith(
      chargerID,
      request[c.PAYLOAD_INDEX].status,
      expect.any(Function),
    );

    const socket = mockV.getConnectedChargerSocket(chargerID);
    expect(socket.send).toHaveBeenCalledWith(
      expect.objectContaining({
        [c.MESSAGE_TYPE_INDEX]: c.CALL_RESULT,
        [c.UNIQUE_ID_INDEX]: uniqueID,
        [c.ACTION_INDEX]: c.STATUS_NOTIFICATION,
      }),
    );
  });

  it('Should handle error when updating charger status', () => {
    const request = {
      [c.PAYLOAD_INDEX]: {
        errorCode: c.NO_ERROR,
        status: 'charging',
      },
    };

    const error = 'Charger status update error';

    mockDatabaseInterfaceCharger.updateChargerStatus.mockImplementation((id, status, callback) => {
      callback(error, null);
    });
    mockV.getConnectedChargerSocket.mockReturnValue({
      send: jest.fn(),
    });

    chargerMessageHandler.sendStatusNotificationResponse(chargerID, uniqueID, request);

    expect(console.log).toHaveBeenCalledWith(
      "\nCharger " + chargerID + " has sent the following error code: " + c.NO_ERROR
    );

    const socket = mockV.getConnectedChargerSocket(chargerId);
    expect(socket.send).toHaveBeenCalledWith(
      expect.objectContaining({
        [c.MESSAGE_TYPE_INDEX]: c.CALL_ERROR,
        [c.UNIQUE_ID_INDEX]: uniqueID,
        [c.ACTION_INDEX]: c.STATUS_NOTIFICATION,
      }),
    );
  });
});