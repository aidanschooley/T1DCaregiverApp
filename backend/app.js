const express = require('express')
const patient = require('./routes/patients')
const glucose = require('./routes/glucose')
const authentication = require('./routes/dexcomApi/authentication')
const glucoseApi = require('./routes/dexcomApi/glucoseApi')
const dataRange = require('./routes/dexcomApi/datarange')
const session = require('express-session')
const app = express()

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
}))

app.use(express.json())
app.use('/api/patient', patient )
app.use('/api/glucose', glucose)
app.use('/dexcom/auth', authentication)
app.use('/dexcom/api', glucoseApi)
app.use('/dexcom/api', dataRange)


app.get('/', (req, res) => {
    res.json("Api running")
})


module.exports = app
