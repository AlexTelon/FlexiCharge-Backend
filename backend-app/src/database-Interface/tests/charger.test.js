const chargerValidation = require('../validation/chargerValidation')({})
const {describe, expect, test} = require('@jest/globals')

test('what a joke', () => {    
    const valErrors = chargerValidation.getChargerBySerialNumberValidation('')
    expect(valErrors.length).toBe(0)
})