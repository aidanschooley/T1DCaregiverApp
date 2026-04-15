require('dotenv').config() 
const app = require('./app')
const bgRetrieve = require('./routes/dexcomApi/bgRetrieve');

app.listen(3000, () => console.log('Server running on port 3000'))
