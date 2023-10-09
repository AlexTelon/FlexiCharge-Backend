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

describe('transactions tests', () => {
  test('should create a transaction', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const data = {
      "chargerID": 1,
      "isKlarnaPayment": true,
      "pricePerKwh": 123.00
    }
    const response = await axios.post(`${URL}/transactions`, data, { headers });
    expect(response.status).toBe(200);
  });

  test('should start a transaction', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.put(`${URL}/transactions/start/1`, { headers });
    expect(response.status).toBe(200);


  });

  test('should return the status of a transaction', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${URL}/transactions/1`, { headers });
    expect(response.status).toBe(200);
  });

  test('should stop a transaction', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.put(`${URL}/transactions/stop/1`, { headers });
    expect(response.status).toBe(200);
  });

  test('should return user transactions by userID', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${URL}/transactions/user/1`, { headers });
    expect(response.status).toBe(200);
  });

  test('should return transactions by transactionID', async () => {
    const token = await login();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${URL}/transactions/100000`, { headers });
    expect(response.status).toBe(200);
  });
});
