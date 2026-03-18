const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

//Test Route
app.get('/api', (req, res) => {
    res.json({status:"ok"})
})

const PORT = 3000

app.listen(PORT, ()=> {
    console.log(`Server Running on http://localhost:${PORT}`)
})