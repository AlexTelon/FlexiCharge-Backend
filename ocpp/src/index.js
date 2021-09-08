const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1337 });

wss.on('connection', function connection(ws, req) {

    // saving websocket with serial number
    let origin = req.url
    let originArray = origin.split("/")
    let chargerSerial = originArray[originArray.length - 1]

    console.log(ws)
    console.log(req)
    console.log(origin)
    console.log(chargerSerial)

    ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        var request = JSON.parse(message)
        console.log(request)
    });
});