const express = require('express')
const patient = require('./routes/patients')
const glucose = require('./routes/glucose')
const app = express()

app.use(express.json())
app.use('/api/patients', patient )
app.use('/api/glucose', glucose)

app.get('/', (req, res) => {
    res.json("Api running")
})

module.exports = app
