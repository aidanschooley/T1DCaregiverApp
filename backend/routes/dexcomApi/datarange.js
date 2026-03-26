const { Router } = require('express');
const getValidAccessToken = require('../../function/getValidAccessToken');
const router = Router();
router.get('/dataRange', async (req, res) => {

const query = new URLSearchParams({lastSyncTime: 'string'}).toString();
const accessToken = getValidAccessToken();
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

module.exports = router