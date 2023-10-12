



const mockFunc = {
  getCallResultNotImplemeted: jest.fn(),
  sendStatusNotificationResponse: jest.fn(),
  handleDataTransfer: jest.fn(),
  handleStartTransaction: jest.fn(),
  handleStopTransaction: jest.fn(),
  handleMeterValues: jest.fn(),
  checkIfValidUniqueID: jest.fn(),
  getGenericError: jest.fn(),
};




    describe('callSwitch', (chargerMessageHandler, constants) => {
      const c = constants.get()
      const uniqueID = 'unique123';
      const chargerID = 'charger123';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('Should handle a valid BOOT_NOTIFICATION action', () => {
        const request = { [c.ACTION_INDEX]: c.BOOT_NOTIFICATION };
        chargerMessageHandler.sendBootNotification.mockReturnValue('bootResponse');
        chargerMessageHandler.sendBootData.mockReturnValue('bootDataResponse');

        const result = chargerMessageHandler.callSwitch(uniqueID, request, chargerID);

        expect(chargerMessageHandler.sendBootNotification()).toHaveBeenCalledWith(chargerID, uniqueID, c.ACCEPTED);
        expect(chargerMessageHandler.sendBootData()).toHaveBeenCalledWith(chargerID);
        expect(result).toBe('bootResponse');
      });

      it('Should handle an invalid action', () => {

        const request = { [c.ACTION_INDEX]: 'INVALID_ACTION' };
        mockFunc.getCallResultNotImplemeted.mockReturnValue('notImplementedResponse');

        const result = chargerMessageHandler.callSwitch(uniqueID, request, chargerID);

        expect(mockFunc.getCallResultNotImplemeted()).toHaveBeenCalledWith(uniqueID, 'INVALID_ACTION');
        expect(result).toBe('notImplementedResponse');
      });

      it('Should handle a STATUS_NOTIFICATION action', () => {
        const request = { [c.ACTION_INDEX]: 'STATUS_NOTIFICATION' };
        mockFunc.sendStatusNotificationResponse.mockReturnValue('statusNotificationResponse');

        const result = chargerMessageHandler.callSwitch(uniqueID, request, chargerID);

        expect(mockFunc.sendStatusNotificationResponse).toHaveBeenCalledWith(chargerID, uniqueID, request);
        expect(result).toBe('statusNotificationResponse');
      });

      it('Should handle a DATA_TRANSFER action', () => {
        const request = { [c.ACTION_INDEX]: 'DATA_TRANSFER' };
        mockFunc.handleDataTransfer.mockReturnValue('dataTransferResponse');

        const result = chargerMessageHandler.callSwitch(uniqueID, request, chargerID);

        expect(mockFunc.handleDataTransfer).toHaveBeenCalledWith(chargerID, uniqueID, request);
        expect(result).toBe('dataTransferResponse');
      });

      it('Should handle a START_TRANSACTION action', () => {
        const request = { [c.ACTION_INDEX]: 'START_TRANSACTION' };
        mockFunc.handleStartTransaction.mockReturnValue('startTransactionResponse');

        const result = chargerMessageHandler.callSwitch(uniqueID, request, chargerID);

        expect(mockFunc.handleStartTransaction).toHaveBeenCalledWith(chargerID, uniqueID, request);
        expect(result).toBe('startTransactionResponse');
      });

      it('Should handle a STOP_TRANSACTION action', () => {
        const request = { [c.ACTION_INDEX]: 'STOP_TRANSACTION' };
        mockFunc.handleStopTransaction.mockReturnValue('stopTransactionResponse');

        const result = chargerMessageHandler.callSwitch(uniqueID, request, chargerID);

        expect(mockFunc.handleStopTransaction).toHaveBeenCalledWith(chargerID, uniqueID, request);
        expect(result).toBe('stopTransactionResponse');
      });

      it('Should handle a METER_VALUES action', () => {
        const request = { [c.ACTION_INDEX]: 'METER_VALUES' };
        mockFunc.handleMeterValues.mockReturnValue('meterValuesResponse');

        const result = chargerMessageHandler.callSwitch(uniqueID, request, chargerID);

        expect(mockFunc.handleMeterValues).toHaveBeenCalledWith(chargerID, request);
        expect(result).toBe('meterValuesResponse');
      });
    });




    describe('callResultCallSwitch', (chargerMessageHandler, constants) => {
      const c = constants.get();
      const uniqueID = 'unique123';
      const chargerID = 'charger123';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('Should handle a valid RESERVE_NOW action', () => {

        const response = { [c.ACTION_INDEX]: c.RESERVE_NOW };
        mockFunc.checkIfValidUniqueID.mockReturnValue(true);

        chargerMessageHandler.callResultSwitch(uniqueID, response, chargerID);

        expect(interfaceHandler.handleReserveNowRepsonse).toHaveBeenCalledWith(chargerID, uniqueID, response);
        expect(mockFunc.getGenericError).not.toHaveBeenCalled();
      });

      it('Should handle an invalid RESERVE_NOW action', () => {

        const response = { [c.ACTION_INDEX]: c.RESERVE_NOW };
        mockFunc.checkIfValidUniqueID.mockReturnValue(false);

        chargerMessageHandler.callResultSwitch(uniqueID, response, chargerID);

        expect(() => callResultSwitch(uniqueID, response, chargerID)).toThrow(c.INVALID_UNIQUE_ID);
        expect(interfaceHandler.handleReserveNowRepsonse).not.toHaveBeenCalled();
      });

      it('Should handle a valid REMOTE_START_TRANSACTION action', () => {
        const response = { [c.ACTION_INDEX]: c.REMOTE_START_TRANSACTION };
        mockFunc.checkIfValidUniqueID.mockReturnValue(true);

        chargerMessageHandler.callResultSwitch(uniqueID, response, chargerID);

        expect(interfaceHandler.handleRemoteStartTransaction).toHaveBeenCalledWith(chargerID, response);
        expect(mockFunc.getGenericError).not.toHaveBeenCalled();
      });

      it('Should handle an invalid REMOTE_START_TRANSACTION action', () => {
        const response = { [c.ACTION_INDEX]: c.REMOTE_START_TRANSACTION };
        mockFunc.checkIfValidUniqueID.mockReturnValue(false);

        chargerMessageHandler.callResultSwitch(uniqueID, response, chargerID);

        expect(() => callResultSwitch(uniqueID, response, chargerID)).toThrow(c.INVALID_UNIQUE_ID);
        expect(interfaceHandler.handleRemoteStartTransaction).not.toHaveBeenCalled();
      });

      it('Should handle a valid REMOTE_STOP_STRANSACTION action', () => {
        const response = { [c.ACTION_INDEX]: c.REMOTE_STOP_TRANSACTION };
        mockFunc.checkIfValidUniqueID.mockReturnValue(true);

        chargerMessageHandler.callSwitch(uniqueID, response, chargerID);

        expect(interfaceHandler.handleRemoteStopTransaction).toHaveBeenCalledWith(chargerID, response);
        expect(mockFunc.getGenericError).not.toHaveBeenCalled();
      });

      it('Should handle an invalid REMOTE_STOP_TRANSACTION action', () => {
        const response = { [c.ACTION_INDEX]: c.REMOTE_STOP_TRANSACTION };
        mockFunc.checkIfValidUniqueID.mockReturnValue(false);

        chargerMessageHandler.callResultSwitch(uniqueID, response, chargerID);

        expect(() => callResultSwitch(uniqueID, response, chargerID)).toThrow(c.INVALID_UNIQUE_ID);
        expect(interfaceHandler.handleRemoteStopTransaction).not.toHaveBeenCalled();
      });

      it('Should handle a valid DATA_TRANSFER action', () => {
        const response = {
          [c.ACTION_INDEX]: c.DATA_TRANSFER,
          [c.PAYLOAD_INDEX]: { status: c.ACCEPTED },
        };

        expect(() => callResultSwitch(uniqueID, response)).not.toThrow();
        expect(console.log).toHaveBeenCalledWith('DataTransfer response was OK');
        expect(mockFunc.getGenericError).not.toHaveBeenCalled();
      });

      it('Should handle an invalid DATA_TRANSFER action', () => {
        const response = {
          [c.ACTION_INDEX]: c.DATA_TRANSFER,
          [c.PAYLOAD_INDEX]: { status: 'SOME_OTHER_STATUS' },
        };

        expect(() => callResultSwitch(uniqueID, response)).toThrow(c.RESPONSE_STATUS_REJECTED);
      });
    });