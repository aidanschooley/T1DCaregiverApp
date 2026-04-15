const { Router } = require('express');
const oauth = require('oauth4webapi');
const config = require('../../config/dexcomClient.js');
const pool = require('../../config/db.js')
const { formatDexcomTime } = require("../../config/dexcom_time.js")
require("dotenv")
// "/dexcom/auth"
const router = Router();

// /dexcom/auth/login
router.get('/login', async (req, res) => {
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



// /dexcom/auth/callback
router.get('/callback'   , async (req, res) => {
  const { code, state, error } = req.query;

  if (error) return res.status(400).send(`Authorization failed: ${error}`);
  if (state !== req.session.oauthState) return res.status(400).send('Invalid state');
  if (!code) return res.status(400).send('Missing code');

  try{
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

     if (!response.ok) {
      const err = await response.text();
      return res.status(400).send(`Token exchange failed: ${err}`);
    }

    const data = await response.json();
  
    await pool.query(
      //TODO make it specific to different patients
      'UPDATE patient SET access_token = $1, refresh_token=$2, token_expires_at=$3 WHERE id=1',
      [data.access_token, data.refresh_token, new Date(Date.now() + data.expires_in * 1000).toISOString()]
    )

    res.send('Successfully Got Token'); 
  }catch (err){
    console.error('Auth callback error:', err.message);
    res.status(500).json({ error: 'Auth failed', details: err.message });
  }
});


module.exports = router