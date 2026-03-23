require('dotenv').config()
const patients = require('./routes/patients.js')
const express = require('express')
const app = express()

app.use(express.json())
app.use('/api/patinets', require('./routes/patients'))
// app.use('/api/posts', require('./routes/posts'))

app.listen(3000, () => console.log('Server running on port 3000'))