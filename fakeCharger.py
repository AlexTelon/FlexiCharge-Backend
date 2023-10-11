import json
import time
from websockets.sync.client import connect

HOST = 'localhost'
PORT = 1337

BASE_URL = f'ws://{HOST}:{PORT}'

CHARGER_SERIAL = 'abc117'
CONNECTOR_ID = 100_007

SEND_HTTP = False

with connect(f'{BASE_URL}/charger/{CHARGER_SERIAL}') as websocket:

    def send(data):
        data = json.dumps(data)
        print(f'Sending data: {data}')
        websocket.send(data)

    def recv(waitingFor):
        print(f'Waiting for: {waitingFor}')
        return json.loads(websocket.recv())

    while True:
        # websocket.send("Hello world!")
        message = recv('message')

        if message[2] == 'ReserveNow':
            send([
                3,
                message[1],
                "ReserveNow",
                {
                    "status": "Accepted"
                }
            ])
        elif message[2] == 'RemoteStartTransaction':
            send([
                3,
                message[1],
                "RemoteStartTransaction",
                {
                    "status": "Accepted"
                }
            ])
            send([
                2,
                message[1],
                "StartTransaction",
                {
                    "connectorId": CONNECTOR_ID,
                    "idTag": 1,
                    "meterStart": 1,
                    "reservationId": 1,
                    "timestamp": time.time()
                }
            ])
        elif message[2] == 'RemoteStopTransaction':
            send([
                3,
                message[1],
                "RemoteStopTransaction",
                {
                    "status": "Accepted"
                }
            ])
            send([
                2,
                message[1],
                "StopTransaction",
                {
                    "connectorId": CONNECTOR_ID,
                    "idTag": 1,
                    "meterStop": 1,
                    "reservationId": 1,
                    "transactionId": 1,
                    "timestamp": time.time()
                }
            ])
        else:
            print('ELSE!', message)
