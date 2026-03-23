const express = require('express')
const patient = require('./routes/patients')
const app = express()

app.use(express.json())
app.use('/api/patients', patient )

app.get('/', (req, res) => {
    res.json("Api running")
})

module.exports = app
