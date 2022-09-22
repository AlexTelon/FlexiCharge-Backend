const chargerValidation = require('../validation/chargerValidation')({})
const {describe, expect, test} = require('@jest/globals')

describe('Charger By SerialNumber Validation', () => {
    
    test('with empty string', () => {    
        const errors = chargerValidation.getChargerBySerialNumberValidation('');
        expect(errors.length).toBe(1);
    });

    test('with null input', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(null);
        expect(errors.length).toBe(1);
    });

    test('with undefined input', () => {
        const valErrors = chargerValidation.getChargerBySerialNumberValidation(undefined);
        expect(valErrors.length).toBe(1);
    });

    test('with int input', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(1);
        expect(errors.length).toBe(1);
    });

    test('with float input', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(11.11);
        expect(errors.length).toBe(1);
    });

    test('with long string', () => {
        const errors = chargerValidation.getChargerBySerialNumberValidation(
            'ashdfjasdfj;laksdjflkasjdf;lkjsalkdfjlkajdfljadhfaoiuwoejasklflha;sjdsljdfasdfhjalshdfkja'
        );
        expect(errors.length).toBe(1);
    });
});
