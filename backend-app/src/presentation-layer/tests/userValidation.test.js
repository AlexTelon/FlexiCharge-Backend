const axios = require("axios");
const assert = require("assert");
const { expect, describe } = require("@jest/globals");
const config = require("../../config");

const URL = config.TEST_URL;
const username = config.TEST_USER_USERNAME;
const password = config.TEST_USER_PASSWORD;

describe("Authentication Verification Test", () => {
  let token = '';

  test('should log in', async () => {
    try {
      const loginResponse = await axios.post(`${URL}/auth/sign-in`, {
        username: username,
        password: password
      });
      token = loginResponse.data.accessToken;
      expect(token).toBeDefined();
    } catch(error) {
      expect(false).toBeTruthy();
    }
  });

  test('Try the access token', async () => {

    try {
      const successExpectedResponse = await axios.get(`${URL}/auth/user-information`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(successExpectedResponse.status).toBe(200);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('Try an incorrect access token', async () => {
    try {
      const errorExpectedResponse = await axios.get(`${URL}/auth/user-information`, {
        headers: {
          Authorization: `Bearer ${token}e`,
        },
      });
      expect(false).toBeTruthy();
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });
});
