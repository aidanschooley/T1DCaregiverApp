import express from 'express'
import session from 'express-session'

// App routes
import patient from './routes/patients.js'
import glucose from './routes/glucose.js'
import alerts from './routes/alert.js'
import settings from './routes/settings.js'

// Dexcom routes
import authentication from './routes/dexcomApi/authentication.js'
import glucoseApi from './routes/dexcomApi/glucoseApi.js'
import dataRange from './routes/dexcomApi/datarange.js'

const app = express()

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
}))
app.use(express.json())

// App routes
app.use('/api/patients', patient)
app.use('/api/glucose', glucose)
app.use('/api/alerts', alerts)
app.use('/api/settings', settings)

// Dexcom routes
app.use('/dexcom/auth', authentication)
app.use('/dexcom/api', glucoseApi)
app.use('/dexcom/api', dataRange)

app.get('/', (req, res) => {
  res.json("Api running")
})

export default app
