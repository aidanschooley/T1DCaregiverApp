import express from 'express'
import patient from './routes/patients.js'
import glucose from './routes/glucose.js'
import authentication from './routes/dexcomApi/authentication.js'
import glucoseApi from './routes/dexcomApi/glucoseApi.js'
import dataRange from './routes/dexcomApi/datarange.js'
// import session from 'express-session'
const app = express()

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'dev_secret',
//   resave: false,
//   saveUninitialized: false,
// }))

app.use(express.json())
app.use('/api/patients', patient )
app.use('/api/glucose', glucose)
app.use('/dexcom/auth', authentication)
app.use('/dexcom/api', glucoseApi)
app.use('/dexcom/api', dataRange)


app.get('/', (req, res) => {
    res.json("Api running")
})


export default app
