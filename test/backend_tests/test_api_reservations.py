import requests
import pytest


class TestApiReservations:

    # Reservations are not yet implemented  in the backend
    def TODO_test_reservation_status_code(self):
        r = requests.get("http://18.202.253.30:8080/reservations")
        assert r.status_code == 200, "Status code is not 200"
