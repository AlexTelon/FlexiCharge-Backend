const axios = require("axios");
const { describe, expect, test } = require("@jest/globals");

const URL = "http://127.0.0.1:8080";
const ROUTES_TO_CHECK = [
  {
    method: "GET",
    route: "/chargers",
    successStatus: 200,
  },
  {
    method: "GET",
    route: "/chargers/" + 100000,
    successStatus: 200,
  },
  {
    method: "GET",
    route: "/chargers/serial/" + "abc111",
    successStatus: 200,
  },
];

describe("Router endpoints", () => {
  ROUTES_TO_CHECK.forEach((routeObject) => {
    test(`Testing route ${routeObject.method}: ${routeObject.route}`, async () => {
      if (routeObject.method === "GET") {
        const res = await axios.get(URL + routeObject.route, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        expect(res).toBeTruthy();
        expect(res.status).toBe(routeObject.successStatus);
      } else if (routeObject.method === "POST") {
        const res = await axios.post(URL + routeObject.route, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(routeObject.body),
        });

        expect(res).toBeTruthy();
        expect(res.status).toBe(routeObject.successStatus);
      }
    });
  });
});
