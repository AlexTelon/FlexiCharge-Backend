const transactionValidation = require('../validation/transactionValidation')({})
const {describe, expect, test} = require('@jest/globals')

const validChargeMeterInput = 0
const validCurrentChargePercentageInput = 0
const validClientId = "123"
const validSessionId = "123"
describe('Transaction by pricePerKwh with input:', () => {
    
    test('integer below 0', () => {    
        const errors = transactionValidation.getAddTransactionValidation(-1);
        expect(errors.length).toBe(2);
    });

    test('string', () => {    
        const errors = transactionValidation.getAddTransactionValidation("1");
        expect(errors.length).toBe(2);
    });

    test('null', () => {
        const errors = transactionValidation.getAddTransactionValidation(null);
        expect(errors.length).toBe(3);
    });

    test('undefined', () => {
        const valErrors = transactionValidation.getAddTransactionValidation(undefined);
        expect(valErrors.length).toBe(3);
    });

});

describe('Update Charger by chargeMeterValue input', () => {
    
    test('null', () => {
        const errors = transactionValidation.getUpdateTransactionChargingStatus(null,validCurrentChargePercentageInput);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const valErrors = transactionValidation.getUpdateTransactionChargingStatus(undefined,validCurrentChargePercentageInput);
        expect(valErrors.length).toBe(1);
    });

    test('integer below 0', () => {
        const errors = transactionValidation.getUpdateTransactionChargingStatus(-1,validCurrentChargePercentageInput);
        expect(errors.length).toBe(1);
    });

});

describe('Update Charger by currentChargePercentage input', () => {
    
    test('null', () => {
        const errors = transactionValidation.getUpdateTransactionChargingStatus(validChargeMeterInput,null);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const valErrors = transactionValidation.getUpdateTransactionChargingStatus(validChargeMeterInput,undefined);
        expect(valErrors.length).toBe(1);
    });

    test('integer below 0 string input', () => {
        const errors = transactionValidation.getUpdateTransactionChargingStatus(validChargeMeterInput,"test");
        expect(errors.length).toBe(1);
    });

    test('integer below 0 array input', () => {
        const errors = transactionValidation.getUpdateTransactionChargingStatus(validChargeMeterInput,[1,2,3]);
        expect(errors.length).toBe(1);
    });

    test('integer below 0', () => {
        const errors = transactionValidation.getUpdateTransactionChargingStatus(validChargeMeterInput,-1);
        expect(errors.length).toBe(1);
    });

    test('integer over 100', () => {
        const errors = transactionValidation.getUpdateTransactionChargingStatus(validChargeMeterInput,101);
        expect(errors.length).toBe(1);
    });

});

describe('Test klarna by session_id input', () => {
    
    test('null', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation(null, validClientId);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation(undefined, validClientId);
        expect(errors.length).toBe(1);
    });

    test('datatype not string', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation(1, validClientId);
        expect(errors.length).toBe(1);
    });

    test('empty string', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation("", validClientId);
        expect(errors.length).toBe(1);
    });
})

describe('Test klarna by client_id input', () => {
    
    test('null', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation(validSessionId, null);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation(validSessionId, undefined);
        expect(errors.length).toBe(1);
    });

    test('datatype not string', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation(validSessionId, 1);
        expect(errors.length).toBe(1);
    });

    test('empty string', () => {
        const errors = transactionValidation.addKlarnaTransactionValidation(validSessionId, "");
        expect(errors.length).toBe(1);
    });
});