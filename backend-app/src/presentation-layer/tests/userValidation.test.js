const axios = require("axios");
const assert = require("assert");
const { expect, describe } = require("@jest/globals");
const config = require("../../config");

describe("Authentication Verification Test", () => {
  it("Fetch an access token by signing in", async () => {
    const loginResponse = await axios.post("http://localhost:8080/auth/sign-in", {
      username: config.TEST_USER_USERNAME,
      password: config.TEST_USER_PASSWORD,
    });

    const { accessToken } = loginResponse.data;

    const successExpectedResponse = await axios.get("http://localhost:8080/auth/user-information", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log("Response expects status 200 and got", successExpectedResponse.status);
    expect(successExpectedResponse.status).toBe(200);

    try {
      const errorExpectedResponse = await axios.get("http://localhost:8080/auth/user-information", {
        headers: {
          Authorization: `Bearer ${accessToken}e`,
        },
      });
    } catch (error) {
      // console.log("Response expects status 401 and got", error.response.status);
      expect(error.response.status).toBe(401);
    }
  });
});
