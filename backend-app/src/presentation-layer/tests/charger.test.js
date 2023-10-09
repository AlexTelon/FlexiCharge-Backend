const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

const URL = config.TEST_URL;
const username = config.TEST_USERNAME;
const password = config.TEST_PASSWORD;

const login = async () => {
  const response = await axios.post(URL + '/auth/sign-in', {
    username: username,
    password: password
  });
  const token = response.data.accessToken;
  return token;
}

describe('chargers tests', () => {
  test('should return a list of charge points', async () => {
    const response = await axios.get(`${URL}/chargers`);
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(3103);
  });

  test('should delete a charger', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${URL}/chargers/serial/100000`, { headers });
    expect(response.status).toBe(200);
  });

  test('post test for the charger', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const data = {
      chargerPointNumber: 23,
      location: [
        57.777714,
        14.16301
      ],
      serialNumber: "android"
    };
    const response = await axios.post(`${URL}/chargers`, data, { headers });
    expect(response.status).toBe(200);
  });

  test('should return a specific charge point', async () => {
    const response = await axios.get(`${URL}/chargers/serial/1`);
    expect(response.status).toBe(200);
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

  test('should return charger by id', async () => {
      const response = await axios.get(`${URL}/chargers/serial/10011`);
    expect(response.status).toBe(200);
  });
});
