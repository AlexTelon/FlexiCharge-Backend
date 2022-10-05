import requests
import pytest

# Would be somewhere else, probably hosted in a docker container
# It would differ from the production server in two ways
#  1. Pre-populated with custom data.
#       Users is done in icognito, so how to populate with that?
#  2. The ability to turn off security.
#       How to implemnt that in a way so that it never can end up in the production code.


class MockServer():
    ...


MockServer()


class MockIcogniotServer():
    # here we can add users and remove them without actually doing it towards the igocniotoooo db.
    ...
####


class TestApiUsers:

    # Send verification code to email, needs to be put in the verify test with the same email
    def test_sign_up_user(self):
        # Arrange
        url = "http://18.202.253.30:8080/auth/sign-up"
        payload = {
            "username": "9914kach@gmail.com",
            "password": "Password123!"
        }
        # Act
        request = requests.post(url, json=payload)
        # Assert
        assert request.status_code == 200, "Status code is not 200, couldn't sign up user."

    def test_verify_user(self):
        # Arrange
        url = "http://18.202.253.30:8080/auth/verify"
        payload = {
            "username": "9914kach@gmail.com",
            "code": "977793"
        }
        # Act
        request = requests.post(url, json=payload)
        # Assert
        assert request.status_code == 200, "Status code is not 200, couldn't verify user."

    def test_login_user(self):
        # Arrange
        url = "http://18.202.253.30:8080/auth/sign-in"
        payload = {
            "username": "9914kach@gmail.com",
            "password": "Password123!"
        }
        # Act
        request = requests.post(url, payload)
        # Assert
        assert request.status_code == 200, "Status code is not 200, could't log in user."

    def test_forgot_password(self, username="9914kach@gmail.com"):
        # Arrange
        url = "http://18.202.253.30:8080/auth/forgot-password/" + username
        # Act
        request = requests.post(url)
        # Assert
        assert request.status_code == 200, "Status code is not 200, couldn't send password reset."

    # This test works by manually imputing the confirmation code received from the email.
    # TODO: implement automatic insertion of this code to be able to run in the workflow
    def test_confirm_forgot_password(self):
        # Arrange
        url = "http://18.202.253.30:8080/auth/confirm-forgot-password"
        payload = {
            "username": "9914kach@gmail.com",
            "password": "Password123?",
            "confirmationCode": "856404"
        }
        # Act
        request = requests.post(url, json=payload)
        # Assert
        assert request.status_code == 200, "Status code is not 200, couldn't confirm forgot password."
