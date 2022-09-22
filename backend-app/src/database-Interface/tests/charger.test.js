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
    
});