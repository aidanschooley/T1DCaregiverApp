const { Router } = require('express');
const oauth = require('oauth4webapi');
const config = require('../dexcom/dexcomClient.js');
const { formatDexcomTime } = require("../function/dexcom_time")
require("dotenv")

const router = Router();

router.get('/login', async (req, res) => {
console.log('client_id:', config.clientId)
  console.log('redirect_uri:', config.redirectUri)
  console.log('authorizationEndpoint:', config.authorizationEndpoint)
  const state = oauth.generateRandomState();
  req.session.oauthState = state;

  const authUrl = new URL(config.authorizationEndpoint);
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'offline_access');
  authUrl.searchParams.set('state', state);

  res.redirect(authUrl.toString());
});

router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).send(`Authorization failed: ${error}`);
  }

  if (code) {
    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri
    });
    
    const response = await fetch(config.tokenEndpoint, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });
    const data = await response.json();
    console.log(data)
    req.session.token = data; 
    req.session.save()
    res.send('Successfully Got Token');
    

  }
});

router.get('/bg', async (req, res) => {
  console.log('token from session:', req.session.token);
  const [startDate, endDate] = formatDexcomTime();
  console.log(startDate);
  console.log(endDate);
  if (!req.session.token) {
    return res.status(401).json({ error: 'Not authenticated — visit /login first' });
  }
  const query = new URLSearchParams({
  startDate: startDate,
  endDate: endDate
  }).toString();

  const bearerAuthToken = req.session.token.access_token;
  const resp = await fetch(
  `https://sandbox-api.dexcom.com/v3/users/self/egvs?${query}`,
  {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + bearerAuthToken
    }
  }
);

const data = await resp.text();
console.log('Dexcom status:', resp.status);
console.log('Dexcom body:', data);

if (!resp.ok) {
    return res.status(resp.status).send(data);
  }

res.json(JSON.parse(data));
});


module.exports = router