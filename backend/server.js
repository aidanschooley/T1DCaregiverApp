import 'dotenv/config.js'
import app from './app.js'
import bgRetrieve from './workers/bgRetrieve.js';

backgroundRetrieve();
app.listen(3000, () => console.log('Server running on port 3000'))
