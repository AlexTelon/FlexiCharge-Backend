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

describe('All chargerpoints tests', () => {
  test('should return all chargerpoints', async () => {
    const response = await axios.get(`${URL}/chargerPoints`);
    expect(response.status).toBe(200);
  });

  test('should return a new chargerpoint', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const data = {
      "name": "name",
      "location": [
        10,
        10
      ],
      "price": 10,
      "klarnaReservationAmount": 10
    };
    const response = await axios.post(`${URL}/chargerPoints`, data, { headers });
    expect(response.status).toBe(200);
  });

  test('should return chargerPoint by id', async () => {
    const response = await axios.get(`${URL}/chargerPoints/1`);
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
  });

  // test('should return an updated chargerpoint', async () => {
  //   //TODO: endpoint doesn't work
  // });

  test('should delete a chargerpoint', async () => {
    const response = await axios.delete(`${URL}/chargerPoints/1`);
  });
});