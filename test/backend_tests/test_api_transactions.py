import requests
import pytest
# Online hosted URL
#TRANSACTIONS_API_URL = "http://18.202.253.30:8080/transactions/"

# Local Hosted URL
TRANSACTIONS_API_URL = "http://localhost:8080/transactions/"


class TestApiTransactions:

    def test_transaction_status_code(self, transactionID="3"):

        url = TRANSACTIONS_API_URL + transactionID

        r = requests.get(url)

        r.json()

        print(r)
        assert requests.get(url).status_code == 200, "Status code is not 200"

    # TODO
    # Currently only checks if transactions exists with the userID

    def test_transaction_by_userId(self):

        userId = "1"

        url = TRANSACTIONS_API_URL + "/userTransactions/" + userId

        r = requests.get(url)

        response = r.json()

        assert r.status_code == 200, "Status code is not 200"

    def test_post_transaction(self):

        # Arrange
        url = TRANSACTIONS_API_URL

        payload = {
            "userID": "1",
            "connectorID": 100005,
            "isKlarnaPayment": True,
            "pricePerKwh": 33.0
        }

        # Act
        request = requests.post(url, json=payload)

        # Assert
        # Return 201 status code, meaning it has been created.
        # It also returns the transactionID
        assert request.status_code == 201, "Status code is not 201"
