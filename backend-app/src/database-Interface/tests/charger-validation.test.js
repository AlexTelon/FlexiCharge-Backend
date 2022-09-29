const chargerValidation = require('../validation/chargerValidation')({})
const {describe, expect, test} = require('@jest/globals')

describe('Charger By SerialNumber Validation with input:', () => {
    
    test('empty string', () => {    
        const errors = chargerValidation.getChargerBySerialNumberValidation('');
        expect(errors.length).toBe(1);
    });

    test('null', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(null);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const valErrors = chargerValidation.getChargerBySerialNumberValidation(undefined);
        expect(valErrors.length).toBe(1);
    });

    test('int', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(1);
        expect(errors.length).toBe(1);
    });

    test('float', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(11.11);
        expect(errors.length).toBe(1);
    });

    test('long string', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(
            'ashdfjasdfj;laksdjflkasjdf;lkjsalkdfjlkajdfljadhfaoiuwoejasklflha;sjdsljdfasdfhjalshdfkja'
        );
        expect(errors.length).toBe(1);
    });
});

describe('Add Charger Validation with input:', () => {
    test('all undefined', () => {
        const errors = chargerValidation.getAddChargerValidation(undefined, undefined, undefined);
        expect(errors.length).toBe(3);
    });
    test('all null', () => {
        const errors = chargerValidation.getAddChargerValidation(null, null, null);
        expect(errors.length).toBe(3);
    });
    test('all empty string', () => {
        const errors = chargerValidation.getAddChargerValidation('', '', '');
        console.log(errors)
        expect(errors.length).toBe(3);
    });
    test('location as array of string', () => {
        const location = ['123', '213']
        const errors = chargerValidation.getAddChargerValidation(location, "serialNumber", 1);
        console.log(errors);
        expect(errors.length).toBe(3);
    });
    test('valid input', () => {
        const location = [80, 123]
        const errors = chargerValidation.getAddChargerValidation(location, "serialNumber", 1);
        console.log(errors);
        expect(errors.length).toBe(0);
    });
    test('location as array of int and string', () => {
        const location = [123, '213']
        const errors = chargerValidation.getAddChargerValidation(location, "serialNumber", 1);
        console.log(errors);
        expect(errors.length).toBe(2);
    });
    test('location array of length 3', () => {
        const location = [12, 12, 12]
        const errors = chargerValidation.getAddChargerValidation(location, "serialNumber", 1);
        console.log(errors);
        expect(errors.length).toBe(1);
    });
    test('location array of length 1', () => {
        const location = [12]
        const errors = chargerValidation.getAddChargerValidation(location, "serialNumber", 1);
        expect(errors.length).toBe(1);
    });

});

describe('Update Charger Status Validation with input:', () => {
    test('null', () => {
        const errors = chargerValidation.getUpdateChargerStatusValidation(null);
        expect(errors.length).toBe(1);
    });
    test('undefined', () => {
        const errors = chargerValidation.getUpdateChargerStatusValidation(undefined);
        expect(errors.length).toBe(1);
    });
    test('empty string', () => {
        const errors = chargerValidation.getUpdateChargerStatusValidation('');
        expect(errors.length).toBe(1);
    });
    test('Available', () => {
        const errors = chargerValidation.getUpdateChargerStatusValidation('Available');
        expect(errors.length).toBe(0);
    });
    test('Availableqweqwe', () => {
        const errors = chargerValidation.getUpdateChargerStatusValidation('Availableqweqwe');
        expect(errors.length).toBe(1);
    });
    test('Available qweqwe', () => {
        const errors = chargerValidation.getUpdateChargerStatusValidation('Available qweqwe');
        expect(errors.length).toBe(1);
    });
    
    test('int', () => {
        const errors = chargerValidation.getUpdateChargerStatusValidation(123);
        expect(errors.length).toBe(2);
    });
    
} )