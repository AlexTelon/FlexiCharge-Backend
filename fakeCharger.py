import json
import time
import math
import random
import threading
from websockets.sync.client import connect

HOST = 'localhost'
PORT = 1337

BASE_URL = f'ws://{HOST}:{PORT}'

CHARGER_SERIAL = 'abc117'
CONNECTOR_ID = 100_007

SEND_HTTP = False
USE_AS_CHARGER_INSTANCE = True

OCPP_REQUEST = 2
OCPP_RESPONSE = 3

LIVE_DATA_INTERVAL = 3

# Does not work properly
STOP_CHARGING_AT_100 = False

with connect(f'{BASE_URL}/charger/{CHARGER_SERIAL}') as websocket:

    def send(data):
        data = json.dumps(data)
        print(f'Sending data: {data}')
        websocket.send(data)

    def recv(waitingFor):
        print(f'Waiting for: {waitingFor}')
        data = json.loads(websocket.recv())
        print(f'Received data: {data}')
        return data

    def timestamp(): return math.floor(time.time())

    if USE_AS_CHARGER_INSTANCE:

        STATE = 'WAITING_FOR_RESERVE_NOW'

        CURRENT_TRANSACTION_ID = 0
        CURRENT_CHARGE_PERCENTAGE = 0
        CURRENT_CHARGE_POWER = 0
        CURRENT_CHARGED_SO_FAR = 0

        def threadFunc():
            global STATE
            print('threadFunc')

            # Reset
            CURRENT_CHARGE_PERCENTAGE = 0
            CURRENT_CHARGE_POWER = 0
            CURRENT_CHARGED_SO_FAR = 0

            print('Starting live metrics')
            while STATE == 'WAITING_FOR_REMOTE_STOP_TRANSACTION':
                print('Sending live metrics', f'{STATE=}')
                send([
                    OCPP_REQUEST,
                    f"100007MeterValues{timestamp()}",
                    "MeterValues",
                    {
                        "connectorId": CONNECTOR_ID,
                        "transactionId": CURRENT_TRANSACTION_ID,
                        "timestamp": timestamp(),
                        "values": {
                            "chargingPercent": {
                                "value": CURRENT_CHARGE_PERCENTAGE,
                                "unit": "%",
                                "measurand": "SoC"
                            },
                            "chargingPower": {
                                "value": CURRENT_CHARGE_POWER,
                                "unit": "W",
                                "measurand": "Power.Active.Import"
                            },
                            "chargedSoFar": {
                                "value": CURRENT_CHARGED_SO_FAR,
                                "unit": "Wh",
                                "measurand": "Energy.Active.Import.Interval"
                            }
                        }
                    }
                ])

                CURRENT_CHARGE_PERCENTAGE += random.randint(0, 10)
                CURRENT_CHARGE_POWER = random.randint(0, 10_000)

                if CURRENT_CHARGE_PERCENTAGE > 100:
                    CURRENT_CHARGE_PERCENTAGE = 100
                    CURRENT_CHARGE_POWER = 0

                    if STOP_CHARGING_AT_100:
                        print('Charging stopped because CURRENT_CHARGE_PERCENTAGE reaced 100')
                        STATE = 'WAITING_FOR_RESERVE_NOW'
                        send([
                            OCPP_REQUEST,
                            f"100007StopTransaction{timestamp()}",
                            "StopTransaction",
                            {
                                "connectorId": CONNECTOR_ID,
                                "idTag": 1,
                                "meterStop": CURRENT_CHARGED_SO_FAR,
                                "reservationId": 1,
                                "transactionId": CURRENT_TRANSACTION_ID,
                                "timestamp": timestamp()
                            }
                        ])

                CURRENT_CHARGED_SO_FAR += math.floor(CURRENT_CHARGE_POWER * LIVE_DATA_INTERVAL / 3600)

                time.sleep(LIVE_DATA_INTERVAL)

            print('Stopping live metrics')

        while True:
            message = recv('message')
            message = {
                'type': message[0],
                'uid': message[1],
                'operation': message[2],
                'data': message[3] if len(message) >= 4 else None,
            }

            if STATE == 'WAITING_FOR_RESERVE_NOW':
                if message['operation'] == 'ReserveNow':
                    send([
                        OCPP_RESPONSE,
                        message['uid'],
                        "ReserveNow",
                        {
                            "status": "Accepted"
                        }
                    ])
                    STATE = 'WAITING_FOR_REMOTE_START_TRANSACTION'

                elif message['type'] == OCPP_RESPONSE:print('Response received. Ignoring')
                else: print('ERROR! Can only be reserved!')

            elif STATE == 'WAITING_FOR_REMOTE_START_TRANSACTION':
                if message['operation'] == 'RemoteStartTransaction':
                    send([
                        OCPP_RESPONSE,
                        message['uid'],
                        "RemoteStartTransaction",
                        {
                            "status": "Accepted"
                        }
                    ])
                    send([
                        OCPP_REQUEST,
                        message['uid'],
                        "StartTransaction",
                        {
                            "connectorId": CONNECTOR_ID,
                            "idTag": 1,
                            "meterStart": 0,
                            "reservationId": 1,
                            "timestamp": timestamp()
                        }
                    ])

                elif message['operation'] == 'StartTransaction':

                    STATE = 'WAITING_FOR_REMOTE_STOP_TRANSACTION'
                    CURRENT_TRANSACTION_ID = message['data']['transactionId']

                    threading.Thread(target=threadFunc).start()

            elif STATE == 'WAITING_FOR_REMOTE_STOP_TRANSACTION':
                if message['operation'] == 'RemoteStopTransaction':
                    send([
                        OCPP_RESPONSE,
                        message['uid'],
                        "RemoteStopTransaction",
                        {
                            "status": "Accepted"
                        }
                    ])
                    send([
                        OCPP_REQUEST,
                        message['uid'],
                        "StopTransaction",
                        {
                            "connectorId": CONNECTOR_ID,
                            "idTag": 1,
                            "meterStop": CURRENT_CHARGED_SO_FAR,
                            "reservationId": 1,
                            "transactionId": CURRENT_TRANSACTION_ID,
                            "timestamp": timestamp()
                        }
                    ])
                    STATE = 'WAITING_FOR_RESERVE_NOW'
                    print('Charging is stopped!', f'{STATE=}')

            else:
                print('Unknown state!')

    else:

        while True:
            # websocket.send("Hello world!")
            message = recv('message')

            if message[0] == 3:
                print('Received repsonse')

            elif message[2] == 'ReserveNow':
                send([
                    OCPP_RESPONSE,
                    message[1],
                    "ReserveNow",
                    {
                        "status": "Accepted"
                    }
                ])
            elif message[2] == 'RemoteStartTransaction':
                send([
                    OCPP_RESPONSE,
                    message[1],
                    "RemoteStartTransaction",
                    {
                        "status": "Accepted"
                    }
                ])
                send([
                    OCPP_REQUEST,
                    message[1],
                    "StartTransaction",
                    {
                        "connectorId": CONNECTOR_ID,
                        "idTag": 1,
                        "meterStart": 1,
                        "reservationId": 1,
                        "timestamp": timestamp()
                    }
                ])
            elif message[2] == 'RemoteStopTransaction':
                send([
                    OCPP_RESPONSE,
                    message[1],
                    "RemoteStopTransaction",
                    {
                        "status": "Accepted"
                    }
                ])
                send([
                    OCPP_REQUEST,
                    message[1],
                    "StopTransaction",
                    {
                        "connectorId": CONNECTOR_ID,
                        "idTag": 1,
                        "meterStop": 1,
                        "reservationId": 1,
                        "transactionId": 1,
                        "timestamp": timestamp()
                    }
                ])
            else:
                print('ELSE!', message)
