from urllib import response
import requests
import pytest
# IP to online backend
#CHARGER_API_URL = "http://18.202.253.30:8080/chargers/"

# IP to local Backend
CHARGER_API_URL = "http://localhost:8080/chargers/"


class TestApiChargers:

    def test_api_status_code(self):
        r = requests.get(CHARGER_API_URL)
        assert r.status_code == 200, "Status code is not 200"

    def test_api_encoding(self):
        r = requests.get(CHARGER_API_URL)
        assert r.encoding == "utf-8", "Encoding is not utf-8"

    # The way I've learnt is that test should be simple and only test one thing, so using 2 asserts might be wrong

    def test_connectorID_exists(self, connectorID="100007"):

        url = CHARGER_API_URL + connectorID

        r = requests.get(url)

        # If the response code is 200 this code will execute
        response_body = r.json()
        got_id = int(response_body['connectorID'])
        # The actual test.
        assert got_id == int(
            connectorID), f"Returned connectorID does not match the one supplied. expected: {connectorID} got: {got_id}"

    # In order to run this test we need a bearer auth token retrieved when logging into the system.

    # This function does not work yet, it requires an authentication token in the header.
    # Without this token it will return 401: Unauthorized
    def TODO_test_post_charger(self):
        # Arrange
        url = CHARGER_API_URL
        payload = {
            "chargerPointNumber": 25,
            "location": [57.777714, 14.16301],
            "serialNumber": "android"
        }
        headers = {"Authorization": "PUT_AUTHORIZATION_TOKEN_HERE"}

        # Act
        request = requests.post(url, json=payload, headers=headers)

        # Asserts
        print(request.status_code)
        assert request.status_code == 200, "Status code is not 200"

        # TODO: Ensure that we only do these types of test on local database in a docker container or something so we dont mess with the production env?
        # TODO:
        #       *  assert that charger X does NOT exists
        #       *  create charger X
        #       *  assert that charger X DOES exists

    def test_connectorID_exists_status_code(self, connectorID="100000"):
        url = CHARGER_API_URL + connectorID
        r = requests.get(url)

        assert r.status_code == 200, "Charger with id: " + connectorID + " does not exist."

    def test_charger_does_not_exist_status_code(self, connectorID="99999"):
        url = CHARGER_API_URL + connectorID
        r = requests.get(url)

        assert r.status_code == 404, "Charger with id: " + connectorID + " exists."

    # Function to test if charger is available
    # DOESNT WORK PROPERLY

    def test_charger_status_is_available(self, connectorID="100006"):
        url = CHARGER_API_URL + connectorID
        r = requests.get(url)

        status = r.json()["status"]
        assert status == "Available", f"Charger is not available {status}"

    def test_charger_serialnmbr(self, serial_number="abc117"):
        url = CHARGER_API_URL + "serial/" + serial_number
        r = requests.get(url)

        got_serial = r.json()["serialNumber"]
        assert got_serial == serial_number, f"Serial number does not exist got {got_serial} != expected {serial_number}"
