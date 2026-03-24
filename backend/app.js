const express = require('express')
const patient = require('./routes/patients')
const glucose = require('./routes/glucose')
const authentication = require('./routes/authentication')
const session = require('express-session')
const app = express()


console.log('patient:', typeof patient)
console.log('glucose:', typeof glucose)
console.log('authentication:', typeof authentication)
console.log('session:', typeof session)

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
}))

app.use(express.json())
app.use('/api/patients', patient )
app.use('/api/glucose', glucose)
app.use('/auth', authentication)

app.get('/', (req, res) => {
    res.json("Api running")
})


module.exports = app
