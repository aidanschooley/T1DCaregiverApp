const { Router } = require('express');
const oauth = require('oauth4webapi');
const config = require('../dexcom/dexcomClient.js');
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

module.exports = router