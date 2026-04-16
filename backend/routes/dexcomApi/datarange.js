import { Router } from 'express';
import tokenService from '../../services/dexcom/tokenService.js'
const router = Router();
router.get('/dataRange', async (req, res) => {

const query = new URLSearchParams({lastSyncTime: 'string'}).toString();
const accessToken = tokenService();
const resp = await fetch(
  `https://developer.dexcom.com/docs/_mock/swaggerv3/v3/users/self/dataRange?${query}`,
  {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }
);

const data = await resp.text();
res.send(JSON.parse(data))
});

export default router