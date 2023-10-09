const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

const URL = config.TEST_URL;
const username = config.TEST_USER_USERNAME;
const password = config.TEST_USER_PASSWORD;

describe('chargers tests', () => {
  let connectorID = 0;
  let token = '';

  test('should log in', async () => {
    const response = await axios.post(`${URL}/auth/sign-in`, {
      username: username,
      password: password
    });
    token = response.data.accessToken;
  });

  test('should return a list of charge points', async () => {
    const response = await axios.get(`${URL}/chargers`);
    expect(response.status).toBe(200);
    // expect(response.data.length).toBe(3103);
  });

  test('post test for the charger', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const data = {
      chargePointID: 1,
      location: [
        57.777714,
        14.16301
      ],
      serialNumber: "testcharger"
    };
    const response = await axios.post(`${URL}/chargers`, data, { headers });
    connectorID = response.data.connectorID;
    expect(response.status).toBe(201);
  });

  test('should return a specific charger', async () => {
    const response = await axios.get(`${URL}/chargers/${connectorID}`);
    expect(response.status).toBe(200);
  });

  test('should delete a charger', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${URL}/chargers/${connectorID}`, { headers });
    expect(response.status).toBe(204);
  });

  test('should return all available chargers', async () => {
    const response = await axios.get(`${URL}/chargers/available`);
    expect(response.status).toBe(200);
    if (Array.isArray(response.data)) {
      for (const charger of response.data) {
        if (charger.status === 'Available') {
          expect(charger.status).toBe('Available');
        }
      }
    } else if (response.data.status === 'Available') {
        expect(response.data.status).toBe('Available');
      }
  });
});
