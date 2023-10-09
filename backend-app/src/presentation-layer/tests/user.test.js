const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

describe('Authentication Router API', () => {

  const URL = config.TEST_URL;
  const username = config.TEST_USERNAME;
  const password = config.TEST_PASSWORD;

  test('should return a 200 status code and a token when valid credentials are provided', async () => {
    const response = await axios.post(URL + '/auth/sign-in', {
      username: username,
      password: password
    });
    expect(response.status).toBe(200);
  });
});
