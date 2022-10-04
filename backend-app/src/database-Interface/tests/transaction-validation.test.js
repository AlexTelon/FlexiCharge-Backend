const transactionValidation = require('../validation/transaction-validation')({})
const {describe, expect, test} = require('@jest/globals')

const validChargeMeterInput = 0
const validCurrentChargePercentageInput = 0
const validClientId = "123"
const validSessionId = "123"
describe('Transaction by pricePerKwh with input:', () => {
    
    test('integer below 0', () => {    
        const errors = transactionValidation.getAddTransactionValidation(-1);
        expect(errors.length).toBe(1);
    });

    test('string', () => {    
        const errors = transactionValidation.getAddTransactionValidation("1");
        expect(errors.length).toBe(1);
    });

    test('null', () => {
        const errors = transactionValidation.getAddTransactionValidation(null);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const valErrors = transactionValidation.getAddTransactionValidation(undefined);
        expect(valErrors.length).toBe(1);
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