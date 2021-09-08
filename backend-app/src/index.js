const express = require('express')

const PORT = process.env.PORT || 8080

const app = express()
app.get('/', (req, res) => {
    res.send('Helloo')
})

app.listen(PORT, () => {
    console.log(`Backend app is running on port ${PORT}`)
})