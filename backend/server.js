import 'dotenv/config.js'
import app from './app.js'
import './workers/bgRetrieve.js';

app.listen(3000, () => console.log('Server running on port 3000'))
