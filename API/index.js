const express = require('express');
const cors = require('cors');
var chargers = require('./Chargers/chargers');
var transactions = require('./Transactions/transactions');
var reservations = require('./Reservations/reservations');

const port = 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/chargers', chargers)
app.use('/transactions', transactions)
app.use('/reservations', reservations)

app.get('/', (request, response) => {
    response.send('Hello world')
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
